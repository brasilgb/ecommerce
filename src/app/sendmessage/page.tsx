'use client';
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangleIcon, Bell, Check, Lightbulb, Search, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import servicepush from "@/services/servicepush";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Loading from "../loading";
import { Textarea } from "@/components/ui/textarea";

const sendSchema = z.object({
  allCli: z.boolean().optional(),
  codCli: z.string().optional(),
  nameCli: z.string().optional(),
  title: z.string().min(1, 'O título não deve estar vazio.'),
  body: z.string().min(1, 'O corpo da mensagem não deve estar vazio.'),
  url: z.string().optional(),
  image: z.string().optional(),
  token: z.string().min(1, 'Digite o codigo do cliente ou marque a opção disparar total da base de dados'),
});

const SendMessage = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [customerTokens, setCustomerTokens] = useState<any>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [pushEnviado, setPushEnviado] = useState<any>(null);
  const [sendingSuccess, setSendingSuccess] = useState<number>(0);
  const [sendingFail, setSendingFail] = useState<number>(0);
  const [findMessage, setFindMessage] = useState<string>('');

  const form = useForm<z.infer<typeof sendSchema>>({
    resolver: zodResolver(sendSchema),
    defaultValues: {
      allCli: false,
      codCli: "",
      nameCli: "",
      title: "",
      body: "",
      url: "",
      image: "",
      token: ""
    }
  });

  const getCustomerCode = (codcli: any) => {
    setSendingSuccess(0);
    setSendingFail(0);
    setPushEnviado('');
    let cliValidate = form.getValues('codCli');
    if (cliValidate === '0') { setFindMessage('Nenhum cliente encontrado para o filtro informado'); return; }
    handleNotifyCustomers(codcli);
  }

  const getCustomerAll = (codcli: any) => {
    setSendingSuccess(0);
    setSendingFail(0);
    setPushEnviado('');
    setChecked(state => !state);
    form.setValue('codCli', '')
    form.setValue('nameCli', '')
    if (checked) {
      form.resetField('token')
      setCustomerTokens([]);
    } else {
      handleNotifyCustomers(codcli);
    }
  }

  const handleNotifyCustomers = async (codcli: any) => {
    setLoading(true);
    await servicepush.post(`(WS_CLIENTES_NOTIFY)`,
      {
        code: codcli
      }
    )
      .then((response) => {
        const { message, success, customers } = response.data.response;
        setFindMessage(message);
        const gertoken = customers.map((tk: any) => (tk.token));
        setCustomerTokens(gertoken);
        form.setValue('token', JSON.stringify(gertoken), { shouldValidate: true });
        if (codcli > 0) {
          form.setValue('nameCli', (customers[0].name).toString());
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => { setLoading(false) })
  }

  const array_chunk = (arr: any, len: number) => {
    let chunks = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    };
    return chunks;
  };

  const parts = array_chunk(customerTokens, 500);

  const submitPush = async (data: any) => {
    setLoading(true);

    let headers = {
      "Content-Type": "application/json",
    }
    parts.forEach(async (part) => {
      const response = await fetch("https://portal.gruposolar.com.br/send", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          tokens: part,
          "data": {
            "title": `${data.title}`,
            "body": `${data.body}`,
            "url": `${data.url ? data.url : '#'}`,
            "image": `${data.image ? data.image : '#'}`
          },
          "contentAvailable": true,
          "priority": "high"
        })
      }) as any;
      const { success, failure, message }: any = await response.json();
      if (success === 1 && failure === 0) {
        setSendingSuccess(current => current + success);
        setSendingFail(current => current + failure);
        setPushEnviado(message);
      } else {
        setSendingSuccess(current => current + success);
        setSendingFail(current => current + failure);
        setPushEnviado(message);
      }
      form.reset()
      setCustomerTokens([]);
      setLoading(false);
    });
  }

  return (
    <>
      {loading &&
        <Loading />
      }
      <div className="flex flex-col h-full w-full bg-gray-50 shadow-sm rounded-md border border-white">
        <header className="bg-gray-100 rounded-t-md px-4 py-2 flex items-center justify-start gap-4 text-zinc-600 border-b">
          <Bell />
          <h1 className="text-lg font-medium">Enviar mensagem ou notificação</h1>
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitPush)} className="space-y-4">
            <main className="flex-1">
              <div className="p-4">

                {customerTokens?.length > 0 &&
                  <Alert className="bg-sky-200 flex items-center gap-2">
                    <Lightbulb size={18} /><AlertTitle> {customerTokens?.length} clientes encontrados</AlertTitle>
                  </Alert>
                }
                {pushEnviado &&
                  <Alert className="w-full bg-green-200">
                    <div className="flex items-center gap-2">
                      <Check size={18} /> <AlertTitle> {pushEnviado}</AlertTitle>
                    </div>
                    <AlertDescription className="flex flex-col gap-2 pl-2 mt-2">
                      <div className="font-medium flex items-center justify-start gap-2">Sucesso: <div className="bg-solar-green-prymary min-h-6 min-w-6 rounded-full flex items-center justify-center">{sendingSuccess}</div></div>
                      <div className="font-medium flex items-center justify-start gap-2">Falhas: <div className="bg-solar-red-support min-h-6 min-w-6 rounded-full flex items-center justify-center">{sendingFail}</div></div>
                    </AlertDescription>
                  </Alert>
                }
                {findMessage &&
                  <Alert className="w-full bg-yellow-100 flex items-center gap-2 text-red-500">
                    <AlertTriangleIcon color="red" size={18} /><AlertTitle> {findMessage}</AlertTitle>
                  </Alert>
                }

              </div>

              <div className="flex flex-col items-center space-x-2">
                <div className="px-6 md:grid grid-cols-5 w-full md:items-center flex flex-col justify-start-center gap-4">
                  <FormField
                    control={form.control}
                    name="allCli"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:p-4">
                        <FormControl>
                          <Checkbox
                            id="allcli"
                            defaultChecked={field.value ? true : false}
                            checked={checked}
                            onCheckedChange={() => getCustomerAll("0")}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="allCli">
                            Enviar mensagem para todos os clientes
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codCli"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="codCli">
                            Código do cliente
                          </FormLabel>
                        </div>
                        <div className="flex items-center w-full">
                          <FormControl>
                            <Input
                              disabled={checked ? true : false}
                              className="rounded-r-none"
                              id="codCli"
                              name="codCli"
                              type="text"
                              value={form.getValues('codCli')}
                              onChange={(e) => form.setValue('codCli', e.target.value)}
                            />
                          </FormControl>
                          <Button
                            disabled={checked ? true : false}
                            type="button"
                            onClick={(e) => getCustomerCode(form.getValues('codCli'))}
                            className="rounded-l-none btn-save bg-solar-blue-primary hover:bg-solar-blue-primary/90 border-none"
                          >
                            <Search size={20} />
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameCli"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4 col-span-3">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="nameCli">
                            Cliente
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            disabled={checked ? true : false}
                            className=""
                            name="nameCli"
                            id="nameCli"
                            type="text"
                            value={form.getValues('nameCli')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col justify-start-center w-full px-6">
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4 col-span-3">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="token">
                            Chaves para o envio de mensagens
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            disabled={checked ? true : false}
                            className=""
                            name="token"
                            id="token"
                            value={form.getValues('token')}
                            onChange={(e) => form.setValue('token', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4 col-span-3">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="title">
                            Título
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            className=""
                            name="title"
                            id="title"
                            type="text"
                            value={form.getValues('title')}
                            onChange={(e) => form.setValue('title', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4 col-span-3">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="body">
                            Mensagem
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            className=""
                            name="body"
                            id="body"
                            value={form.getValues('body')}
                            onChange={(e) => form.setValue('body', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4 col-span-3">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="image">
                            Imagem
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            className=""
                            name="image"
                            id="image"
                            type="text"
                            value={form.getValues('image')}
                            onChange={(e) => form.setValue('image', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-col items-start space-y-0 md:p-4 col-span-3">
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="url">
                            URL
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            className=""
                            name="url"
                            id="url"
                            type="text"
                            value={form.getValues('url')}
                            onChange={(e) => form.setValue('url', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </main>
            <footer className="bg-gray-100 rounded-b-md text-zinc-600 border-t flex items-center justify-end px-6 py-4">
              <Button
                className="btn-save bg-solar-blue-primary hover:bg-solar-blue-primary/90"
                type="submit"
              >
                <span>Enviar mensagem</span><Send size={20} />
              </Button>
            </footer>
          </form>
        </Form>
      </div>
    </>
  )
}
export default SendMessage;