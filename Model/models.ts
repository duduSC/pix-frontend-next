import { valibotResolver } from "@hookform/resolvers/valibot";
import {z} from "zod";

export const userSchema = z.object({
    id: z.number().optional(),
    cpfcnpj: z.string().transform((val) => {return String(val).replace(/\D/g, '')}).refine((val)=>(val.length ===11|| val.length === 14),"CPF/CNPJ tem de ser válidos"),
    nome: z.string().min(1,"Preencha o campo").trim(),
    telefone: z.string().min(1,"Preencha o campo").trim(),
    rua: z.string().min(1,"Preencha o campo"),
    bairro: z.string().min(1,"Preencha o campo"),
    cidade: z.string().min(1,"Preencha o campo"),
    conta: z.object({
        nroConta : z.coerce.number("Preencha o campo"),
        saldo: z.coerce.number().default(0)
    }),
    email: z.email('Email inválido'),
    password: z.string().min(1,"Preencha o campo")
})
export type UserSchema = z.infer<typeof userSchema>;

export const payloadSchema = z.object({
    id: z.string(),
    cpfcnpj: z.string(),
    nome: z.string(),
    telefone: z.string(),
    rua: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    email: z.string(),
})
export type PayloadSchema = z.infer<typeof payloadSchema>

export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
})

export type LoginSchema = z.infer<typeof loginSchema>


enum tipoChave  {
    aleatoria= "A",
    email = "E",
    telefone = "T",
    cpf = "C"
}
export const chaveSchema = z.object({
    chave: z.string(),
    tipo: z.preprocess((val)=> String(val).toUpperCase(),z.enum(tipoChave)),
    usuarioId: z.number().optional()
})

export type ChaveSchema  = z.infer<typeof chaveSchema>

export const transacaoSchema = z.object({
    id: z.number().optional(),
    data_transferencia : z.date().optional(),
    valor: z.coerce.number(),
    mensagem: z.string().optional(),
    chave_origem : z.string().optional(),
    chave_destino : z.string()
})

export type TransacaoSchema = z.infer<typeof transacaoSchema>