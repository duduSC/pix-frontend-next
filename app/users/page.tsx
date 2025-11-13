'use client'
import { userSchema, UserSchema } from "@/Model/models";
import api from "@/services/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useActionState } from "react";
import { useForm } from "react-hook-form"





function Form() {

     const  {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema) as any
    })

     const  onSubmit = async (data: UserSchema) => {
        console.log("Dados validados", data)
        const resp = await api.post("/v1/usuarios", {data})
        alert("Formulario enviado com sucesso!")
        reset()
    }


    return (
        <div style={{ justifySelf: "center", padding: 250 }}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <label> Nome :
                    <input {...register("nome")}></input></label><br />
                <label> CPF :
                    <input {...register("cpf_cnpj")} /></label><br />
                <label> Telefone:
                    <input {...register("telefone")} /></label><br />
                <label> Rua:
                    <input {...register("rua")} /></label><br />
                <label> Bairro:
                    <input {...register("bairro")} /></label><br />
                <label> Cidade:
                    <input {...register("cidade")} /></label><br />
                <label> Numero da conta:
                    <input {...register("conta.nroConta")} type="number" /></label><br />
                <label> Saldo:
                    <input {...register("conta.saldo")} type="number" /></label><br/>
                <label> Email:
                    <input {...register("email")} type="email" /></label><br />
                    {errors.email && <span style={{color:"red"}}>{errors.email.message}</span>}
                <label> Senha:
                    <input {...register("password")} type="password" /></label><br />

                <button style={{ width: 100 }} type="submit" disabled={isSubmitting}>Enviar</button>
            </form>
        </div>
    )
}

export default Form