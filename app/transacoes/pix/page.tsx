'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  DollarSign, 
  Send, 
  User, 
  MessageSquare, 
  Loader2, 
  Wallet
} from 'lucide-react';
import api from '@/services/api/api';
import { getPayload } from '@/functions/getPayload';
import { ChaveSchema, PayloadSchema } from '@/Model/models';

// --- SCHEMA ---
const transactionFormSchema = z.object({
  valor: z.string().min(1, "Digite um valor"),
  chave_destino: z.string().min(1, "A chave de destino é obrigatória"),
  chave_origem: z.string().min(1, "Selecione uma chave para pagamento"),
  mensagem: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionFormSchema>;

export default function NovaTransacaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userKeys, setUserKeys] = useState<ChaveSchema[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayValue, setDisplayValue] = useState('');
  
  // Estado simplificado de feedback (apenas texto)
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionFormSchema) as any
  });

  // --- CARREGAR DADOS ---
  useEffect(() => {
    const init = async () => {
      try {
        const payload = await getPayload();
        
        if (!payload || payload === 401) {
          router.push('/login?error=unauthorized');
          return;
        }

        const userData = payload as PayloadSchema;
        setUserId(userData.id);

        const resp = await api.get(`usuarios/${userData.id}/chaves`);
        setUserKeys(resp.data);

        if (resp.data.length > 0) {
          setValue('chave_origem', resp.data[0].chave);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router, setValue]);

  // --- MÁSCARA ---
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    const numericValue = Number(value) / 100;
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue);

    setDisplayValue(formatted);
    setValue('valor', value); 
  };

  // --- SUBMIT ---
  const onSubmit = async (data: TransactionForm) => {
    setFeedback({ type: '', message: '' }); // Limpa msg anterior

    try {
      const valorNumerico = Number(data.valor) / 100;

      if (valorNumerico <= 0) {
        setFeedback({ type: 'error', message: "O valor deve ser maior que zero." });
        return;
      }

      const dados = {
        ...data,
        valor: valorNumerico
        
      };

      await api.post(`/transacoes`, dados); 

      // Feedback simples
      setFeedback({ type: 'success', message: "Pix enviado! Redirecionando..." });
      
      setTimeout(() => {
        router.push('/transacoes');
      }, 1500);

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.statusText || "Erro ao realizar transação.";
      setFeedback({ type: 'error', message: msg });
    } 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Fazer um Pix</h2>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={displayValue}
                  onChange={handleAmountChange}
                  disabled={isSubmitting}
                  className="block w-full text-center text-3xl font-bold text-blue-600 placeholder-gray-300 border-none focus:ring-0 p-4 bg-gray-50 rounded-lg disabled:opacity-50"
                />
                <input type="hidden" {...register('valor')} />
              </div>
              {errors.valor && <p className="mt-1 text-xs text-red-600 text-center">{errors.valor.message}</p>}
            </div>

            {/* Chave Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Para quem?</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Chave Pix"
                  disabled={isSubmitting}
                  {...register('chave_destino')}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 disabled:bg-gray-100"
                />
              </div>
              {errors.chave_destino && <p className="mt-1 text-xs text-red-600">{errors.chave_destino.message}</p>}
            </div>

            {/* Chave Origem */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pagar com</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  disabled={isSubmitting}
                  {...register('chave_origem')}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 bg-white disabled:bg-gray-100"
                >
                  <option value="" disabled>Selecione...</option>
                  {userKeys.map((k) => (
                    <option key={k.chave} value={k.chave}>{k.tipo} - {k.chave}</option>
                  ))}
                </select>
              </div>
              {errors.chave_origem && <p className="mt-1 text-xs text-red-600">{errors.chave_origem.message}</p>}
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mensagem</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Opcional"
                  disabled={isSubmitting}
                  {...register('mensagem')}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* FEEDBACK SIMPLES (Apenas Texto) */}
            {feedback.message && (
              <div className={`text-center text-sm font-medium ${feedback.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || userKeys.length === 0}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-5 w-5" />
                  Transferir
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}