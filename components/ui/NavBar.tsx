'use client'

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/services/api/api";

export default function MainNavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // Para destacar o link ativo (opcional)
    const router = useRouter()
    // Mapeamento dos links solicitados
    const menuItems = [
        { label: "Home", href: "/" },
        { label: "Meu Perfil", href: "/usuarios" },
        { label: "Minhas Chaves", href: "/chaves" },
        { label: "Minhas Transações", href: "/transacoes" },
        { label: "Cadastrar Chaves", href: "/chaves/form" },
        { label: "Realizar Pix", href: "/transacoes/pix" },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);
    const handleLogout = async () => {
        try {
            await api.post("/autenticacao/logout");
        } catch (error) {
            console.error("Erro ao deslogar", error);
        }
        router.push("/login");
        router.refresh();
    }
    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* LADO ESQUERDO: Logo ou Nome do App */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            PixApp
                        </Link>
                    </div>

                    {/* LADO DIREITO: Botão Hambúrguer */}
                    <div className="flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center cursor-pointer justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Abrir menu</span>

                            {/* Ícone: Se aberto mostra X, se fechado mostra 3 linhas */}
                            {!isOpen ? (
                                // Ícone Hambúrguer (3 linhas)
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                // Ícone Fechar (X)
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* O MENU DROP DOWN (Aparece quando clica) */}
            {isOpen && (
                <div className="absolute top-16 right-0 w-64 bg-white shadow-lg border-l border-b border-gray-200 rounded-bl-lg" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)} // Fecha o menu ao clicar
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-2 cursor-pointer rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}