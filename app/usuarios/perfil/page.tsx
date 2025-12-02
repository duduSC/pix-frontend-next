'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, ShieldCheck, LogOut, Building, Hash, Loader2 } from 'lucide-react';
import { PayloadSchema, UserSchema } from '@/Model/models';
import api from '@/services/api/api';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<PayloadSchema | null>(null);
    const [loading, setLoading] = useState(true);

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
        const getPayload = async () => {
            try {
               const resp = await api.get("/autenticacao/me")
               setUser(resp.data)
            } catch (error) {
                console.log(error)
            }
        }
        getPayload()
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                    <span className="text-gray-500 font-medium">Carregando perfil...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

            {/* Container Principal */}
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Cabeçalho do Perfil (Cartão Principal) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Capa Decorativa */}
                    <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-500"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            {/* Avatar e Nome */}
                            <div className="flex items-end gap-6">
                                <div className="relative w-24 h-24 bg-white rounded-full p-1 shadow-md">
                                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.nome}</h1>
                                    <p className="text-gray-500 flex items-center gap-1">
                                        <Building size={14} />
                                        {user.cidade}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Grid de Informações Principais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                            {/* Seção: Identidade */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Identidade
                                </h3>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-green-600 mr-4">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">E-mail</p>
                                        <p className="font-medium text-gray-900 break-all">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-green-600 mr-4">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">CPF / CNPJ</p>
                                        <p className="font-medium text-gray-900 font-mono">
                                            {formatDocument(user.cpfcnpj)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-gray-400 mr-4">
                                        <Hash size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">ID do Usuário</p>
                                        <p className="font-medium text-gray-600 text-xs font-mono truncate w-40 sm:w-full">
                                            {user.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Seção: Endereço e Contato */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Endereço & Contato
                                </h3>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-green-600 mr-4">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Telefone</p>
                                        <p className="font-medium text-gray-900">
                                            {formatPhone(user.telefone)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-green-600 mr-4">
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
    );
}