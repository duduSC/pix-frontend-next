import { valibotResolver } from "@hookform/resolvers/valibot";
import {z} from "zod";

export const userSchema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  cpfcnpj: z.string().min(11, "CPF ou CNPJ inválido"),
  telefone: z.string().min(10, "Telefone obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(3, "Rua/Logradouro é obrigatório"),
  conta: z.object({
    nroConta: z.coerce.number("Deve ser um número"),
    saldo: z.coerce.number("Deve ser um número").optional()
  })
});
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