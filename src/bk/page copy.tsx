'use client'
import servicepush from "@/services/servicepush";
import Link from "next/link";
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoAlertCircle, IoArrowBack, IoCheckmark, IoCheckmarkCircle, IoNotifications, IoSearch } from "react-icons/io5";


interface PushProps {
    allCli: boolean;
    codCli: string;
    nameCli: string;
    title: string;
    body: string;
    url: string;
    image: string;
    token: string;
}

const schema = z.object({
    allCli: z.string().optional(),
    codCli: z.string().optional(),
    nameCli: z.string(),
    title: z.string().min(1, 'O título não deve estar vazio.'),
    body: z.string().min(1, 'O corpo da mensagem não deve estar vazio.'),
    url: z.string(),
    image: z.string(),
    token: z.string().min(1, 'Digite o codigo do cliente ou marque a opção disparar total da base de dados'),
});

type FormData = z.infer<typeof schema>;

const EnviarPush = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingAll, setLoadingAll] = useState<boolean>(false);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [pushEnviado, setPushEnviado] = useState<string>('');
    const [pushStatus, setPushStatus] = useState<boolean>(false);
    const [allTokens, setAllTokens] = useState<any>([]);
    const [customerError, setCustomerError] = useState<any>(null);
    const [customersFound, setCustomersFound] = useState<any>(null);
    const [valueCustomerCod, setValueCustomerCod] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
        defaultValues: {
            allCli: "",
            codCli: "",
            nameCli: "",
            title: "",
            body: "",
            url: "",
            image: "",
            token: ""
        },
        mode: 'onSubmit',
        resolver: zodResolver(schema),
    });

    const handleClienteCode = async (e: any) => {
        e.preventDefault();
        setLoadingSearch(true);
        await servicepush.post(`(WS_CLIENTES_NOTIFY)`,
            {
                code: valueCustomerCod
            })
            .then((result) => {
                const { success, customers } = result.data.response;
                if (success) {
                    const token = customers.map((tk: any) => (tk.token));
                    const name = customers.map((tk: any) => (tk.name));
                    console.log(customers);
                    setValue('nameCli', name, { shouldValidate: true });
                    setValue('token', JSON.stringify(token), { shouldValidate: true });
                    setAllTokens(token);
                    setLoadingSearch(false);
                    setCustomerError(null)
                } else {
                    setCustomerError("Cliente não existe na base de dados, tente sem o último dígito.");
                    setLoadingSearch(false);
                    setValue('token', '');
                }
            })
            .catch((err) => {
                setLoadingSearch(false);
                console.log(err);
            })
    }

    const handleChange = () => {
        setChecked(state => !state)
    }

    useEffect(() => {
        const handleClientAll = async () => {
            if (checked) {
                setValue('codCli', '');
                setValue('nameCli', 'Todos os clientes');
                setLoadingAll(true);
                await servicepush.post(`(WS_CLIENTES_NOTIFY)`, { code: "" })
                    .then((result) => {
                        setLoadingAll(false);
                        const datatk = result.data.response.customers;
                        const gertoken = datatk.map((tk: any) => (tk.token));
                        setValue('token', JSON.stringify(gertoken), { shouldValidate: true });
                        setAllTokens(gertoken);
                        setCustomersFound(`Encontrados ${datatk.length} clientes para o envio de notificações.`);
                    })
                    .catch((err) => {
                        setLoadingAll(false);
                        console.log(err);
                    })
            } else {
                setCustomersFound(null);
                setValue('codCli', '');
                setValue('nameCli', '');
                setValue('token', '');
            }
        };
        handleClientAll();
    }, [checked, setValue]);


    const array_chunk = (arr: any, len: number) => {
        let chunks = [], i = 0, n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        };
        return chunks;
    };

    const parts = array_chunk(allTokens, 500);
    // const partsmap = parts.map((part: any, idx: number) => (
    //     console.log(`or partes de 99 --> ${idx}`, part)
    // ));

    const submitPush = async (data: any) => {
        setLoading(true);

        let headers = {
            "Content-Type": "application/json",
        }
        try {
            parts.map(async (part: any, idx: number) => {
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
                setLoading(false);
                const { success, failure, message }: any = await response.json();

                if (success === 1 && failure === 0) {
                    setPushEnviado(`Envio de mensagem: Sucesso(${success}), Falha(${failure})`);
                    setPushStatus(true);
                    reset({});
                } else {
                    setPushEnviado(`Envio de mensagem: Sucesso(${success}), Falha(${failure})`);
                    setPushStatus(failure > 0 ? false : true);
                }
            })
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    }

    const handleChangeCod = (e: any) => {
        setValueCustomerCod(e.target.value);
    };

    return (
        <>
            <div className="md:w-2/4 mx-auto bg-gray-50 rounded-md shadow mt-4 border border-white">
                <div className="relative flex items-center justify-start bg-solar-blue-primary px-3 py-2 rounded-t-md">
                    <div className="absolute bg-white hover:bg-gray-50 -left-10 text-solar-blue-primary rounded-l-full w-8 h-8 flex items-center justify-center mx-2 shadow">
                        <Link
                            href="http://portal.gruposolar.com.br/ecommerce"
                        >
                            <IoArrowBack size={20} />
                        </Link>
                    </div>
                    <div className="mr-2 text-white">
                        <IoNotifications size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg text-white font-semibold">Envio de push</h1>
                    </div>
                </div>
                <div className="">
                    {pushEnviado &&
                        <div className={`py-4 flex items-center justify-start pl-5 ${pushStatus ? 'bg-green-200 border-b border-b-green-300' : 'bg-red-300 border-b border-b-red-400'}`}>
                            {pushStatus ? <IoCheckmarkCircle size={22} className="text-green-700" /> : <IoAlertCircle size={22} className="text-red-700" />}
                            <h1 className={`text-lg ml-8 ${pushStatus ? 'text-green-700' : 'text-red-700'}`}>{pushEnviado}</h1>
                        </div>
                    }
                    <form onSubmit={handleSubmit(submitPush)}>
                        <div className="px-3">
                            <div className="flex flex-col mt-6">
                                <div className="flex items-center justify-start">
                                    <input
                                        type="checkbox"
                                        name="allCli"
                                        defaultChecked={false}
                                        onChange={handleChange}
                                    />
                                    <label className="label-form ml-2">Disparar para todos os clientes</label>
                                </div>
                                {customersFound && (
                                    <div className="text-sm text-solar-blue-primary">
                                        {customersFound}
                                    </div>
                                )}
                                {loadingAll &&
                                    <div className="flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 bg-gray-700 bg-opacity-50">
                                        <div className="flex items-center justify-center bg-white p-6 rounded shadow-lg">
                                            <div>spin</div>
                                            <div className="text-xl text-gray-500">Aguarde buscando clientes...</div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col mt-4">
                                <label className="label-form" htmlFor="codCli">
                                    Código do cliente
                                </label>
                                <div className="md:flex items-center justify-start gap-4">
                                    <div className="flex items-center justify-start">
                                        <input
                                            className={`input-form !border-r-0 !rounded-r-none w-full ${checked ? 'bg-gray-200' : ''}`}
                                            type="text"
                                            id="codCli"
                                            onChange={handleChangeCod}
                                            disabled={checked ? true : false}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e: any) => handleClienteCode(e)}
                                            disabled={checked || valueCustomerCod === "" ? true : false}
                                            className={`input-form !rounded-l-none ${checked || valueCustomerCod === "" ? 'bg-gray-200' : ''}`}
                                        >
                                            {loadingSearch ? 'spin' : <IoSearch size={24} color={'#949494'} />}
                                        </button>
                                    </div>
                                    <input
                                        className={`input-form w-full md:mt-0 mt-4 ${checked ? 'bg-gray-200' : ''}`}
                                        type="text"
                                        id="nameCli"
                                        {...register('nameCli')}
                                        readOnly
                                    />
                                </div>
                                {customerError && (
                                    <div className="text-sm text-red-600">
                                        {customerError}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="title">
                                    Título da mensagem
                                </label>
                                <input
                                    className="input-form"
                                    type="text"
                                    {...register('title')}
                                />
                                {errors.title?.message && (
                                    <div className="text-sm text-red-600">
                                        {errors.title?.message}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="body">
                                    Texto da mensagem
                                </label>
                                <textarea
                                    className="input-form"
                                    {...register('body')}
                                />
                                {errors.body?.message && (
                                    <div className="text-sm text-red-600">
                                        {errors.body?.message}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="image">
                                    URL da imagem
                                </label>
                                <input
                                    className="input-form"
                                    type="text"
                                    {...register('image')}
                                />
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="url">
                                    Link web
                                </label>
                                <input
                                    type="text"
                                    className="input-form"
                                    {...register('url')}
                                />
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="token">
                                    Token do celular
                                </label>
                                <textarea
                                    className={`input-form ${checked ? 'bg-gray-200' : ''} !text-xs`}
                                    {...register('token')}
                                    disabled
                                    rows={6}
                                />
                            </div>
                            {errors.token?.message && (
                                <div className="text-sm text-red-600">
                                    {errors.token?.message}
                                </div>
                            )}
                        </div>
                        <div className={`bg-white rounded-b-md border-t mt-4 p-3 flex items-center justify-end`}>
                            <button
                                type="submit"
                                className="btn-save"
                            >
                                {loading ? <RiLoader3Fill size={24} color={'#f3f3f3'} className="animate-spin" /> : 'Enviar mensagem'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EnviarPush