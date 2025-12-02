'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  Search, 
  Loader2, 
  DollarSign, 
  Filter,
  ChevronLeft,  // Importado
  ChevronRight  // Importado
} from 'lucide-react';
import api from '@/services/api/api';
import { getPayload } from '@/functions/getPayload';
import { useRouter } from 'next/navigation';
import { ChaveSchema, PayloadSchema, TransacaoSchema } from '@/Model/models';

const ITEMS_PER_PAGE = 10; // Deve ser igual ao default do backend ou o que você quiser controlar

export default function ExtratoPage() {
  const router = useRouter();
  const [transacoes, setTransacoes] = useState<TransacaoSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioChaves, setUsuarioChaves] = useState<string[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null); // Estado para guardar ID do user

  // --- ESTADOS DE PAGINAÇÃO ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Formatadores
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const dateFormatter = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 1. Efeito de Autenticação e Carga Inicial (Roda uma vez)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data_payload = await getPayload();
        
        if (!data_payload || data_payload === 401) {
          router.push('/login?error=unauthorized');
          return;
        }
        
        const payload: PayloadSchema = data_payload as PayloadSchema;
        setUsuarioId(Number(payload.id)); // Salva o ID para usar no próximo effect

        // Busca as chaves para identificar Entrada/Saída
        const resp_chaves = await api.get(`usuarios/${payload.id}/chaves`);
        const data_chaves: ChaveSchema[] = resp_chaves.data;
        const keys = data_chaves.map((val) => val.chave).filter(Boolean);
        setUsuarioChaves(keys);

      } catch (error) {
        console.error("Erro na autenticação:", error);
      }
    };

    initAuth();
  }, [router]);

  // 2. Efeito de Busca de Transações (Roda quando usuarioId ou page mudam)
  useEffect(() => {
    const fetchTransacoes = async () => {
      if (!usuarioId) return; // Só busca se tiver o ID do usuário

      try {
        setLoading(true);
        
        // Adiciona os parâmetros de paginação na URL
        const resp = await api.get(`/usuarios/${usuarioId}/transacoes?page=${page}&limit=${ITEMS_PER_PAGE}`);
        
        setTransacoes(resp.data);

        // Verifica se tem mais dados para a próxima página
        // Se a API retornou menos itens que o limite, chegamos ao fim.
        if (resp.data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransacoes();
  }, [usuarioId, page]); // Dependências: roda se o ID ou a PÁGINA mudar

  // Handlers de Paginação
  const handleNextPage = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const isExpense = (tx: TransacaoSchema) => {
    if (!tx.chave_origem) return true;
    return usuarioChaves.includes(tx.chave_origem);
  };

  if (loading && page === 1) { // Loading inicial tela cheia apenas na primeira carga
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-500">Carregando movimentações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="text-blue-600" />
              Extrato
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Acompanhe suas transferências recentes.
            </p>
          </div>

         
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {transacoes.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-300 w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma movimentação</h3>
              <p className="text-gray-500 text-sm mt-1">
                Nenhuma transação encontrada nesta página.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {transacoes.map((tx) => {
                  const isOut = isExpense(tx);
                  
                  return (
                    <li key={tx.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-default animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full flex-shrink-0 ${
                            isOut ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                          }`}>
                            {isOut ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {isOut ? 'Transferência Enviada' : 'Transferência Recebida'}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {dateFormatter(String(tx.data_transferencia))}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate max-w-[150px] sm:max-w-[200px]" title={isOut ? tx.chave_destino : tx.chave_origem}>
                                {isOut ? `Para: ${tx.chave_destino}` : `De: ${tx.chave_origem}`}
                              </span>
                            </div>
                            {tx.mensagem && (
                              <p className="text-xs text-gray-400 mt-1 italic truncate max-w-[200px]">
                                "{tx.mensagem}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-base sm:text-lg font-bold ${
                            isOut ? 'text-gray-900' : 'text-green-600'
                          }`}>
                            {isOut ? '- ' : '+ '}
                            {currencyFormatter.format(tx.valor)}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            Pix
                          </div>
                        </div>

                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* --- RODAPÉ DE PAGINAÇÃO --- */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1 || loading}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                    page === 1 || loading
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                    <span className="text-sm text-gray-500 font-medium">
                        Página {page}
                    </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!hasMore || loading}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                    !hasMore || loading
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  Próxima
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}