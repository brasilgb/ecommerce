'use client'
import servicepush from "@/services/servicepush";
import Link from "next/link";
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoAlertCircle, IoArrowBack, IoCheckmark, IoCheckmarkCircle, IoNotifications, IoSearch } from "react-icons/io5";
import { RiLoader3Fill } from "react-icons/ri";

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

    const { register, handleSubmit, formState: { errors }, getValues, setValue, reset } = useForm<FormData>({
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
        mode: 'onBlur',
        resolver: zodResolver(schema),
    });

    const handleClienteCode = async (e: any) => {
        e.preventDefault();
        setLoadingSearch(true);
        let cod = getValues('codCli');
        await servicepush.post(`(WS_CLIENTES_NOTIFY)`,
            {
                code: cod
            })
            .then((result) => {
                const { token, name } = result.data.response.customers[0];
                setValue('nameCli', name);
                setValue('token', token);
                setLoadingSearch(false);
            })
            .catch((err) => {
                setLoadingSearch(false);
                console.log(err);
            })

    }

    const handleClientesAll = async (e: any) => {
        setChecked(!checked);
        if (!checked) {
            setValue('codCli', '');
            setValue('nameCli', 'Todos os clientes');
            setLoadingAll(true);
            await servicepush.post(`(WS_CLIENTES_NOTIFY)`, { code: "" })
                .then((result) => {
                    setLoadingAll(false);
                    const datatk = result.data.response.customers;
                    const gertoken = datatk.map((tk: any) => (tk.token));
                    setValue('token', JSON.stringify(gertoken));
                })
                .catch((err) => {
                    setLoadingAll(false);
                    console.log(err);
                })
        } else {
            setValue('codCli', '');
            setValue('nameCli', '');
            setValue('token', '');
        }
    };

    const submitPush = async (data: any) => {
        setLoading(true);
        const firebase_api_key = "AAAAM-_KeU4:APA91bGUHCmXD9jH7wkxPM1-6gZqR06jRJ6NyyVNBlbJW1TugXpKqKKY4Cxub92kqC-TmohGYyOaze63Dsb7AGxvNPC5QRK-IBu7crQ2ujMbslBTSdXEN4uVsHTdxWL2b8yYyboKrNGe"
        // const datafcm = JSON.stringify(data.token);
        const message = {
            "to": data.token,
            "data": {
                "title": `${data.title}`,
                "body": `${data.body}`,
                "url": `${data.url ? data.url : '#'}`,
                "image": `${data.image ? data.image : '#'}`
            },
            "contentAvailable": true,
            "priority": "high"
        }
        let headers = {
            "Authorization": `key=${firebase_api_key}`,
            "Content-Type": "application/json",
        }
        try {
            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(message),
            });
            setLoading(false);
            const { success, failure, results }: any = await response.json();
            if (success === 1 && failure === 0) {
                setPushEnviado("Mensagens enviadas com successo");
                setPushStatus(true);
                reset({});
            } else {
                setPushEnviado(`Erro ao enviar mensagem: ${results[0].error}`);
                setPushStatus(false);
            }

        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        const path = window.location.pathname;
        console.log('apos url principal = ', path.split('/')[1]);
    },[])
    return (

        <>
            <div className="mt-1 absolute bg-blue-light text-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
                <Link
                    href="http://portal.gruposolar.com.br/ecommerce"
                >
                    <IoArrowBack size={22} />
                </Link>
            </div>
            <div className="md:w-2/4 mx-auto bg-gray-50 rounded-md shadow mt-4">
                <div className="flex items-center justify-start h-10 px-4 bg-blue-light text-white rounded-t-md">
                    <div className="mr-2">
                        <IoNotifications size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">Envio de push</h1>
                    </div>
                </div>
                <div className="">
                    {pushEnviado &&
                        <div className={`py-4 flex items-center justify-start pl-5 ${pushStatus ? 'bg-green-200 border-b border-b-green-300' : 'bg-red-300 border-b border-b-red-400'}`}>
                            {pushStatus ? <IoCheckmarkCircle size={22} className="text-green-700" /> : <IoAlertCircle size={22} className="text-red-700" />}
                            <h1 className={`text-lg ml-8 ${pushStatus ? 'text-green-700' : 'text-red-700'}`}>{pushEnviado}</h1>
                        </div>
                    }
                    <form name="formPush" onSubmit={handleSubmit(submitPush)}>
                        <div className="px-3">
                            <div className="flex flex-col mt-6">
                                <div className="flex items-center justify-start">
                                    <div
                                        className={`flex items-center justify-center w-5 h-5 rounded-md cursor-pointer ${checked ? 'bg-blue-light text-white' : 'bg-white border border-gray-300'}`}
                                        onClick={handleClientesAll}
                                    >
                                        {checked ? <IoCheckmark size={22} /> : ''}
                                    </div>
                                    <div className="label-form ml-2">Disparar total da base de dados</div>
                                </div>
                                {loadingAll &&
                                    <div className="flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 bg-gray-700 bg-opacity-50">
                                        <div className="flex items-center justify-center bg-white p-6 rounded shadow-lg">
                                            <div><RiLoader3Fill size={32} color={'#949494'} className="animate-spin" /></div>
                                            <div className="text-xl text-gray-500">Aguarde buscando dados...</div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col mt-4">
                                <label className="label-form" htmlFor="codCli">
                                    Código do cliente
                                </label>
                                <div className="flex items-center justify-start gap-4">
                                    <div className="flex items-center justify-start">
                                        <input
                                            className="input-form !border-r-0 !rounded-r-none"
                                            type="text"
                                            id="codCli"
                                            {...register('codCli')}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e: any) => handleClienteCode(e)}
                                            className="input-form !rounded-l-none"
                                        >
                                            {loadingSearch ? <RiLoader3Fill size={24} color={'#949494'} className="animate-spin" /> : <IoSearch size={24} color={'#949494'} />}
                                        </button>
                                    </div>
                                    <input
                                        className="input-form w-full"
                                        type="text"
                                        id="nameCli"
                                        {...register('nameCli')}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="title">
                                    Título push
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
                                    Texto
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

                            {/* <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="body">
                                    Tipo de push
                                </label>
                                <div className="flex items-center justify-start py-2">
                                    <div className="">
                                        <input type="radio" id="link" value={'link'} {...register('pushType')} />
                                        <label className="ml-1 text-base text-gray-500" htmlFor="openlink">Abertura de link</label>
                                    </div>
                                    <div className="ml-4">
                                        <input type="radio" id="pesquisa" value={'pesquisa'} {...register('pushType')} />
                                        <label className="ml-1 text-base text-gray-500" htmlFor="">Pesquisa de satisfação</label>
                                    </div>
                                    <div className="ml-4">
                                        <input type="radio" id="aviso" value={'aviso'} {...register('pushType')} />
                                        <label className="ml-1 text-base text-gray-500" htmlFor="aviso">Aviso</label>
                                    </div>

                                </div>
                            </div> */}

                            {/* <div className="flex flex-col mt-3">
                                <label className="label-form" htmlFor="pesquisa">
                                    Pesquisa
                                </label>
                                <input
                                    className="input-form"
                                    type="text"
                                    {...register('pesquisa')}
                                />
                            </div> */}

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
                                    className="input-form"
                                    {...register('token')}
                                    readOnly
                                />
                            </div>
                            {errors.token?.message && (
                                <div className="text-sm text-red-600">
                                    {errors.token?.message}
                                </div>
                            )}
                        </div>
                        <div className="bg-white rounded-b-md border-t mt-4 p-3 flex items-center justify-end">
                            <button
                                className="btn-save"
                            >
                                {loading ? <RiLoader3Fill size={24} color={'#f3f3f3'} className="animate-spin" /> : 'Enviar push'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EnviarPush