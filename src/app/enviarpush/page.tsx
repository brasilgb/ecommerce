'use client'
import servicepush from "@/services/servicepush";
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { IoCheckbox, IoCheckmark, IoNotifications, IoSearch } from "react-icons/io5";
import { RiLoader3Fill } from "react-icons/ri";

interface PushProps {
    allCli: boolean;
    codCli: string;
    namecli: string;
    title: string;
    body: string;
    pushType: string;
    pesquisa: string;
    url: string;
    image: string;
    token: string;
    emoji: string;
}
const EnviarPush = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingAll, setLoadingAll] = useState<boolean>(false);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [allTokens, setAllTokens] = useState<any>([]);

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<PushProps>({
        defaultValues: {
            allCli: false,
            codCli: "",
            namecli: "",
            title: "",
            body: "",
            pushType: "",
            pesquisa: "",
            url: "",
            image: "",
            token: ""
        },
        mode: 'onBlur',
    });

    const handleClienteCode = async (e: any) => {
        e.preventDefault();
        setLoadingSearch(true);
        let cod = getValues('codCli');

        if (cod) {
            await servicepush.post(`(WS_CLIENTES_NOTIFY)`,
                {
                    code: `${cod}`
                })
                .then((result) => {
                    setLoadingSearch(false);
                    const { token, name } = result.data.response.customers[0];
                    setValue('namecli', name);
                    setValue('token', token);
                })
                .catch((err) => {
                    setLoadingSearch(false);
                    console.log(err);
                })
        } else {
            setLoadingSearch(false);
        }
    }

    const handleClientesAll = async (e: any) => {
        setChecked(!checked);
        if (!checked) {
            setLoadingAll(true);
            await servicepush.post(`(WS_CLIENTES_NOTIFY)`, { code: "" })
                .then((result) => {
                    setLoadingAll(false);
                    setValue('namecli', 'Todos os clientes');
                    const datatk = result.data.response.customers;
                    const gertoken = datatk.map((tk: any) => (tk.token));
                    setValue('token', JSON.stringify(gertoken));
                    setAllTokens(gertoken);
                })
                .catch((err) => {
                    setLoadingAll(false);
                    console.log(err);
                })
        } else {
            setValue('namecli', '');
            setValue('token', '');
            setAllTokens([]);
        }
    };

    const submitPush = async (data: any) => {
        setLoading(true);
        const firebase_api_key = "AAAAM-_KeU4:APA91bGUHCmXD9jH7wkxPM1-6gZqR06jRJ6NyyVNBlbJW1TugXpKqKKY4Cxub92kqC-TmohGYyOaze63Dsb7AGxvNPC5QRK-IBu7crQ2ujMbslBTSdXEN4uVsHTdxWL2b8yYyboKrNGe"
        const datafcm = JSON.stringify(data.token);
        const message = {
            "to": data.token,
            "data": {
                "title": `${data.title}`,
                "body": `${data.body}`,
                "url": `${data.url}`,
                "image": `${data.image}`
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
            const result = await response.json();
            console.log("Success:", result);
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    }

    return (
        <div className="md:w-2/4 mx-auto bg-gray-50 rounded-b-md shadow">
            <div className="flex items-center justify-start h-10 px-4 bg-blue-light text-white rounded-t-md">
                <div className="mr-2">
                    <IoNotifications size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-semibold">Envio de push</h1>
                </div>
            </div>
            <div className="">
                <form onSubmit={handleSubmit(submitPush)}>
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
                                    id="namecli"
                                    {...register('namecli')}
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
                        </div>

                        <div className="flex flex-col mt-3">
                            <label className="label-form" htmlFor="body">
                                Texto
                            </label>
                            <textarea
                                className="input-form"
                                {...register('body')}
                            />
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
                        </div>

                        <div className="flex flex-col mt-3">
                            <label className="label-form" htmlFor="pesquisa">
                                Pesquisa
                            </label>
                            <input
                                className="input-form"
                                type="text"
                                {...register('pesquisa')}
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
                                className="input-form"
                                {...register('token')}
                                required
                            />
                        </div>

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
    )
}

export default EnviarPush