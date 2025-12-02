'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Key,
    Plus,
    Trash2,
    Copy,
    CheckCircle,
    Mail,
    Phone,
    FileText,
    Shuffle,
    Loader2,
} from 'lucide-react';
import api from '@/services/api/api';
import { getPayload } from '@/functions/getPayload';
import { ChaveSchema } from '@/Model/models';
import { useRouter } from 'next/navigation';

export default function MyChavesPage() {
    const [chaves, setChaves] = useState<ChaveSchema[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const router = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const userData = await getPayload();
                if (userData == 401) return router.push("/login?error=unauthorized")

                if (userData && userData.id) {
                    const resp = await api.get(`/usuarios/${userData.id}/chaves`);
                    setChaves(resp.data);
                } else {
                    console.error("ID do usuário não encontrado no payload");
                    if (userData == 401) return router.push("/login?error=unauthorized")

                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    router.push('/login?error=unauthorized');
                }
                console.error("Erro ao buscar dados:", error);
                setChaves([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (chaveValor: string) => {
        if (!confirm('Tem certeza que deseja excluir esta chave Pix?')) return;

        try {
            await api.delete(`/chaves/${chaveValor}`);

            setChaves((prev) => prev.filter((chave) => chave.chave !== chaveValor));
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir chave. Tente novamente.');
        }
    };

    const getChaveLabel = (tipo: string) => {
        switch (tipo) {
            case 'E': return 'E-mail';
            case 'T': return 'Telefone';
            case 'C': return 'CPF/CNPJ';
            case 'A': return 'Chave Aleatória';
            default: return tipo;
        }
    };

    const getChaveIcon = (tipo: string) => {
        switch (tipo) {
            case 'E': return <Mail size={20} />;
            case 'T': return <Phone size={20} />;
            case 'C': return <FileText size={20} />;
            case 'A': return <Shuffle size={20} />;
            default: return <Key size={20} />;
        }
    };

    const getBadgeColor = (tipo: string) => {
        switch (tipo) {
            case 'E': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'T': return 'bg-green-100 text-green-700 border-green-200';
            case 'A': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'C': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-sm text-gray-500">Carregando chaves...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Key className="text-blue-600" />
                            Minhas Chaves Pix
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Gerencie suas chaves para receber transferências.
                        </p>
                    </div>

                    <Link
                        href="/chaves/form"
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={20} className="mr-1" />
                        Nova Chave
                    </Link>
                </div>

                {/* Lista de Chaves */}
                {chaves.length === 0 ? (
                    // Estado Vazio
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Key className="text-gray-300 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma chave cadastrada</h3>
                        <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
                            Você ainda não tem chaves Pix cadastradas. Crie uma agora para começar a receber.
                        </p>
                        <Link
                            href="/chaves/nova"
                            className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                        >
                            Cadastrar primeira chave
                        </Link>
                    </div>
                ) : (
                    // Grid de Cards
                    <div className="grid grid-cols-1 gap-4">
                        {chaves.map((chave) => (
                            <div
                                key={chave.chave}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-blue-100 group"
                            >
                                {/* Ícone e Informações */}
                                <div className="flex items-start gap-4 overflow-hidden w-full">
                                    <div className={`p-3 rounded-lg flex-shrink-0 ${getBadgeColor(chave.tipo).split(' ')[0]}`}>
                                        <span className={getBadgeColor(chave.tipo).split(' ')[1]}>
                                            {getChaveIcon(chave.tipo)}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeColor(chave.tipo)}`}>
                                                {getChaveLabel(chave.tipo)}
                                            </span>
                                        </div>
                                        <p className="text-gray-900 font-mono font-medium truncate text-base sm:text-lg" title={chave.chave}>
                                            {chave.chave}
                                        </p>
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                                    <button
                                        onClick={() => handleCopy(chave.chave, chave.chave)}
                                        className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Copiar chave"
                                    >
                                        {copiedId === chave.chave ? (
                                            <>
                                                <CheckCircle size={16} className="text-blue-600 mr-2" />
                                                <span className="text-blue-600">Copiado</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} className="mr-2" />
                                                <span>Copiar</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(chave.chave)}
                                        className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Excluir chave"
                                    >
                                        <Trash2 size={16} className="mr-2 sm:mr-0" />
                                        <span className="sm:hidden">Excluir</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}