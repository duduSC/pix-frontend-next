'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, ShieldCheck, LogOut, Building, Hash, Loader2 } from 'lucide-react';
import { PayloadSchema, UserSchema } from '@/Model/models';
import { getPayload } from '@/functions/getPayload';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<PayloadSchema | null>(null);
    const [loading, setLoading] = useState(false);

    const formatDocument = (doc: string) => {
        const cleaned = doc.replace(/\D/g, '');
        if (cleaned.length === 11) { // CPF
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cleaned.length === 14) { // CNPJ
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return doc;
    };

    const formatPhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        // Formato (11) 90000-0000
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        // Formato (11) 0000-0000
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    };

    useEffect(() => {
        const payload = async () => {
            setLoading(true)

            try {
                const resp = await getPayload()
                if (resp == 401) return router.push("/login?error=unauthorized")
                setUser(resp)
            } catch (error: any) {
                console.log(error)
            }
        }
        payload()
        setLoading(false)
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="text-gray-500 font-medium">Carregando perfil...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-4xl mx-auto space-y-6">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Capa Decorativa */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-emerald-500"></div>

                    <div className="px-8 pb-8">
                        {/* ALTERAÇÃO PRINCIPAL AQUI:
                            Removi o -mt-12 e o flex do container pai.
                            Agora tratamos o posicionamento individualmente.
                        */}
                        <div className="relative mb-6">

                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">

                                {/* O Avatar sobe (-mt-12) para ficar sobre o banner */}
                                <div className="-mt-12 relative w-24 h-24 bg-white rounded-full p-1 shadow-md flex-shrink-0 z-10">
                                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                </div>

                                {/* O Nome fica no fluxo normal (embaixo do banner, na parte branca) */}
                                <div className="text-center sm:text-left sm:mb-2 flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.nome}</h1>
                                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1 text-sm sm:text-base">
                                        <Building size={14} />
                                        {user.cidade}
                                    </p>
                                </div>

                                {/* Botão de Logout Desktop */}

                            </div>

                        </div>

                        {/* Grid de Informações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                            {/* Seção: Identidade */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Identidade
                                </h3>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:border-blue-200">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-600 mr-4">
                                        <Mail size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500">E-mail</p>
                                        <p className="font-medium text-gray-900 truncate" title={user.email}>{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:border-blue-200">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-600 mr-4">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">CPF / CNPJ</p>
                                        <p className="font-medium text-gray-900 font-mono">
                                            {formatDocument(user.cpfcnpj)}
                                        </p>
                                    </div>
                                </div>


                            </div>

                            {/* Seção: Endereço */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Endereço & Contato
                                </h3>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:border-blue-200">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-600 mr-4">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Telefone</p>
                                        <p className="font-medium text-gray-900">
                                            {formatPhone(user.telefone)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:border-blue-200">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-600 mr-4">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Endereço Completo</p>
                                        <p className="font-medium text-gray-900">
                                            {user.rua}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {user.bairro} - {user.cidade}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}