'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  Loader2, 
  ArrowRight,
  FileText,
  CheckCircle2,
  Wallet,
  DollarSign,
  Vault
} from 'lucide-react';
import api from '@/services/api/api';
import Link from 'next/link';
import { UserSchema , userSchema} from '@/Model/models';

// --- SCHEMA DE CADASTRO ---


export default function RegisterPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema) as any
  });

  // --- MÁSCARAS DE INPUT ---
  const handleDocumentMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    // Máscara dinâmica CPF/CNPJ
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
    setValue('cpfcnpj', value.replace('/\Dg',"")); 
  };

  const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    }
    
    e.target.value = value;
    setValue('telefone', value);
  };

  const onSubmit = async (data: UserSchema) => {
    setServerError('');
    try {
      const dados = {
        ...data,
        cpfcnpj: data.cpfcnpj.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, '')
      };

      await api.post('/usuarios', dados); 

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setServerError(error.response?.data?.message || "Erro ao realizar cadastro. Tente novamente.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
          <p className="text-gray-600 mb-6">
            Sua conta foi criada com sucesso. Você será redirecionado para o login.
          </p>
          <Link 
            href="/login"
            className="text-green-600 font-medium hover:underline inline-flex items-center"
          >
            Ir para Login agora <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Crie sua conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Comece a usar o PixCollege hoje mesmo.
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm text-center">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dados Pessoais*/}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <User size={16} className="mr-2" /> Dados Pessoais
              </h3>
            </div>

                       <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  {...register('nome')}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Seu nome"
                />
              </div>
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF ou CNPJ</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  onChange={handleDocumentMask}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.cpfcnpj && <p className="text-red-500 text-xs mt-1">{errors.cpfcnpj.message}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  onChange={handlePhoneMask}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
            </div>


            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <MapPin size={16} className="mr-2" /> Endereço
              </h3>
            </div>

                      <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Rua / Logradouro</label>
              <input
                type="text"
                {...register('rua')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.rua && <p className="text-red-500 text-xs mt-1">{errors.rua.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                type="text"
                {...register('bairro')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('cidade')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>}
            </div>

            {/*Dados de Acesso */}
            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <Lock size={16} className="mr-2" /> Dados de Acesso
              </h3>
            </div>

                        <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

                        <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
             {/*Dados da Conta */}

            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <Wallet size={16} className="mr-2" /> Dados de Conta
              </h3>
            </div>

                        <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Número da conta</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Vault className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('conta.nroConta')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0000001"
                />
              </div>
              {errors.conta?.nroConta && <p className="text-red-500 text-xs mt-1">{errors.conta.nroConta?.message}</p>}
            </div>

                        <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Saldo</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('conta.saldo')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
              {errors.conta?.saldo && <p className="text-red-500 text-xs mt-1">{errors.conta?.saldo.message}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Criando conta...
                </span>
              ) : (
                "Cadastrar"
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Faça login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}