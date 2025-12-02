'use client';

import { useState, FormEvent } from 'react';
import { Search, Wallet, Building2, User } from 'lucide-react';
import { ChaveSchema } from '@/Model/models';
import api from '@/services/api/api';

export default function Home() {
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chaves, setChaves] = useState<ChaveSchema[]>([]);

  // Lógica da máscara Híbrida (CPF ou CNPJ)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    // Limita ao tamanho máximo de um CNPJ (14 dígitos)
    if (value.length > 14) value = value.slice(0, 14);

    // Aplica a máscara dependendo do tamanho
    if (value.length <= 11) {
      // Máscara de CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Máscara de CNPJ: 00.000.000/0000-00
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    setCpf(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const cpfCnpjLimpo = cpf.replace(/\D/g, '');

    if (cpfCnpjLimpo.length !== 11 && cpfCnpjLimpo.length !== 14) {
      alert('Por favor, digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
      return;
    }

    setIsLoading(true);
    setChaves([]);

    try {
      const resp = await api.get(`usuarios/cpfcnpj/${cpfCnpjLimpo}/chaves`)
      const resultadoLista: ChaveSchema[] = resp.data
      if (resultadoLista.length > 0 ) {
        setChaves(resp.data)
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const isCnpj = cpf.replace(/\D/g, '').length > 11;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
   

      <main className="flex flex-col items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Consulta Pública de <span className="text-blue-600">Chaves Pix</span>
          </h1>
          <p className="text-lg text-gray-600">
            Digite o CPF ou CNPJ para localizar as chaves cadastradas em nosso sistema.
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF ou CNPJ
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={18} 
                  placeholder="000.000.000-00"
                  className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all text-lg placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-all duration-300">
                  {isCnpj ? (
                    <Building2 className="h-5 w-5 text-blue-600 animate-in fade-in zoom-in" />
                  ) : (
                    <User className="h-5 w-5 text-gray-400 animate-in fade-in zoom-in" />
                  )}
                </div>
              </div>
             
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Chaves
                </>
              )}
            </button>
          </form>
        </div>

        {chaves && (
          <div className="w-full max-w-md mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Resultado para {isCnpj ? 'Empresa' : 'Pessoa Física'}
            </h3>
            <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {chaves.map((chave) => (
                  <li key={chave.chave} className="px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{chave.tipo}</p>                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate font-mono bg-gray-50 p-1 rounded border border-transparent group-hover:border-gray-200">
                      {chave.chave}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </main>

      <footer className="w-full py-6 text-center text-gray-400 text-sm">
        <p>&copy; 2024 Projeto Pix.</p>
      </footer>
    </div>
  );
}