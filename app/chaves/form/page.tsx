    'use client'

    import { getPayload } from "@/functions/getPayload";
    import { ChaveSchema, chaveSchema, PayloadSchema } from "@/Model/models";
    import api from "@/services/api/api";
    import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
    import React, { useEffect } from "react";
    import { useForm } from "react-hook-form"

    const ErrorMessage = ({ error }: { error?: string }) => {
        if (!error) return null;
        return <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>;
    };

    export default function FormChavePix() {
        const [statusMessage, setStatusMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
        const [payload, setPayload] = React.useState<PayloadSchema>()
        const [isLoadingUser, setIsLoadingUser] = React.useState(true);
        const router = useRouter()
        const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
            reset
        } = useForm<ChaveSchema>({
            resolver: zodResolver(chaveSchema) as any
        })

        useEffect(() => {
            
            async function loadUser() {
                try {
                const resp = await getPayload()
                if (!resp) {
                    console.log("Sem payload")
                    return
                }
                setPayload(resp)    
                } catch (error) {
                    console.log(error)
                }finally{
                    setIsLoadingUser(false)
                }
                
            }
            loadUser()
        }, [])
    
        const onSubmit = async (data: ChaveSchema) => {
            setStatusMessage(null);

            if (!payload?.id) {
                setStatusMessage({ type: 'error', text: "Usuário não identificado. Recarregue a página." });
                return;
            }


            console.log("Enviando:", data)

            try {
                const resp = await api.post("/chaves", data);

                if (resp.status === 201) {
                    setStatusMessage({ type: 'success', text: "Chave Pix cadastrada com sucesso!" });
                    router.push("/chaves")
                    setIsLoadingUser(false)
                    reset();
                } else {
                    throw new Error(resp.data?.message || "Erro desconhecido");
                }

            } catch (error: any) {
                console.error(error);
                const msg = error.response?.data?.message || "Falha ao conectar com o servidor.";
                setStatusMessage({ type: 'error', text: msg });
            }

        if (isLoadingUser) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Nova Chave Pix
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Verificando credenciais...
                        </p>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="mt-4 text-gray-500 text-sm font-medium">Carregando dados do usuário...</p>
                        </div>
                    </div>
                </div>
            )
        }

        
        }


        
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Nova Chave Pix
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vincule uma nova chave à sua conta
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                        {statusMessage && (
                            <div className={`mb-4 p-4 rounded-md border ${statusMessage.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                <p className="text-sm font-medium text-center">{statusMessage.text}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                            <div>
                                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                                    Tipo da Chave
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="tipo"
                                        {...register("tipo")}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                                    >
                                        <option defaultValue="A">Selecione um tipo...</option>
                                        <option value="A">Aleatória</option>
                                        <option value="C">CPF/CNPJ</option>
                                        <option value="T">Telefone</option>
                                        <option value="E">Email</option>
                                    </select>
                                    <ErrorMessage error={errors.tipo?.message} />
                                </div>
                            </div>

                            {/* Campo Chave */}
                            <div>
                                <label htmlFor="chave" className="block text-sm font-medium text-gray-700">
                                    Valor da Chave
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="chave"
                                        type="text"
                                        placeholder="Ex: seu@email.com ou 000.000.000-00"
                                        {...register("chave")}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <ErrorMessage error={errors.chave?.message} />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Certifique-se que a chave corresponde ao tipo selecionado.
                                </p>
                            </div>

                            {/* Botão Salvar */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? "Processando..." : "Cadastrar Chave"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
