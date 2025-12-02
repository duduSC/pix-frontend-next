'use client'
import { userSchema, UserSchema } from "@/Model/models";
import api from "@/services/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useActionState } from "react";
import { useForm } from "react-hook-form"





export default function Form() {

const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <span style={{ color: "red", fontSize: "0.875rem", display: "block", marginTop: "4px" }}>{error}</span>;
};
const [statusMessage, setStatusMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema) as any
    })

   
    const onSubmit = async (data: UserSchema) => {
        setStatusMessage(null); 
        console.log("Enviando dados:", data)

        try {
            const resp = await api.post("/usuarios", data);

            if (resp.status === 201) {
                setStatusMessage({ type: 'success', text: "Usuário cadastrado com sucesso!" });
                console.log(resp.data)
                reset();
            } else {
                throw new Error(resp.data?.message || "Erro desconhecido ao salvar");
            }

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Falha ao conectar com o servidor.";
            setStatusMessage({ type: 'error', text: msg });
        }
    }

    const onInvalid =(error:any) => {
        console.log(error)
    }
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <h1 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>Cadastro de Usuário</h1>

            {}
            {statusMessage && (
                <div style={{
                    padding: "10px",
                    marginBottom: "20px",
                    borderRadius: "4px",
                    backgroundColor: statusMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: statusMessage.type === 'success' ? '#155724' : '#721c24'
                }}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit,onInvalid)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input id="nome" {...register("nome")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.nome?.message} />
                </div>

                <div>
                    <label htmlFor="cpf">CPF/CNPJ:</label>
                    <input id="cpf" {...register("cpfcnpj")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.cpfcnpj?.message} />
                </div>

                <div>
                    <label htmlFor="tel">Telefone:</label>
                    <input id="tel" {...register("telefone")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.telefone?.message} />
                </div>

                <div>
                    <label htmlFor="rua">Rua:</label>
                    <input id="rua" {...register("rua")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.rua?.message} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="bairro">Bairro:</label>
                        <input id="bairro" {...register("bairro")} style={{ width: "100%", padding: "8px" }} />
                        <ErrorMessage error={errors.bairro?.message} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="cidade">Cidade:</label>
                        <input id="cidade" {...register("cidade")} style={{ width: "100%", padding: "8px" }} />
                        <ErrorMessage error={errors.cidade?.message} />
                    </div>
                </div>

                <hr style={{ margin: "10px 0" }} />

                <div>
                    <label htmlFor="nroConta">Número da conta:</label>
                    <input id="nroConta" {...register("conta.nroConta")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.conta?.nroConta?.message} />
                </div>

                <div>
                    <label htmlFor="saldo">Saldo Inicial:</label>
                    {/* valueAsNumber é crucial para inputs type="number" funcionarem bem com Zod */}
                    <input
                        id="saldo"
                        type="number" 
                        defaultValue={0}
                        {...register("conta.saldo", { valueAsNumber: true })}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    <ErrorMessage error={errors.conta?.saldo?.message} />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" {...register("email")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.email?.message} />
                </div>

                <div>
                    <label htmlFor="password">Senha:</label>
                    <input id="password" type="password" {...register("password")} style={{ width: "100%", padding: "8px" }} />
                    <ErrorMessage error={errors.password?.message} />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: isSubmitting ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    {isSubmitting ? "Enviando..." : "Cadastrar Usuário"}
                </button>
            </form>
        </div>
    )
}