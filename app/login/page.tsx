'use client'
import { LoginSchema, loginSchema } from "@/Model/models";
import api from "@/services/api/api"
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Suspense, useEffect, useState } from "react"

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


export function LoginContent() {
    const [showPassword, setShowPassword] = React.useState(false)
    const [globalError, setGlobalError] = React.useState("")
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    })
    useEffect(() => {
        const error = searchParams.get('error');

        if (error === 'unauthorized') {
            setErrorMessage('Sessão expirada. Faça login para continuar.');

            window.history.replaceState(null, '', '/login');
        }

    }, [searchParams]
    )
    const onSubmit = async (data: LoginSchema) => {
        setGlobalError("") // Limpa erros anteriores
        try {
            const resp = await api.post("/autenticacao", { ...data })
            router.push("/usuarios")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais."
            setGlobalError(msg)
        }
    }

    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-md w-full max-w-md flex items-center animate-bounce-short">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Bem-vindo de volta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Entre com suas credenciais para acessar
                    </p>
                </div>

                {globalError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3 text-center">
                        {globalError}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">

                        {/* Campo Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="seu@email.com"
                                    {...register("email")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                                />

                                {/* Botão de Olhinho */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Botão de Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={18} />
                                    Entrando...
                                </span>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default function LoginUser() {
    return (
        <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-indigo-600" /></div>}>
            <LoginContent />
        </Suspense>
    );
}