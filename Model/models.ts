import {z} from "zod";

 export const userSchema = z.object({
    id: z.number().nullable(),
    cpf_cnpj: z.string().transform((val)=>{String(val).replace(/\D/g, '')}),
    nome: z.string().trim(),
    telefone: z.string().trim(),
    rua: z.string().trim(),
    bairro: z.string().trim(),
    cidade: z.string().trim(),
    conta: z.object({
        nroConta : z.number(),
        saldo: z.number().default(0)
    }),
    email: z.email('Email inválido'),
    password: z.string().trim()
})
export type UserSchema = z.infer<typeof userSchema>;

