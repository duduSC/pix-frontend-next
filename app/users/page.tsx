'use client'
import api from "@/services/api/api";
import React, { FormEvent } from "react";






function Form() {
    const [usuario, setUsuario] = React.useState(
        {
            nome: "",
            cpfcnpj: "",
            telefone: "",
            rua: "",
            bairro: "",
            cidade: "",
            email: "",
            password: "",
            conta: 0
        }
    )

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        setUsuario({ ...usuario, [name]: value });


    }

    async function postUser(event: FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()

            const resp = await api.post("/v1/usuarios", {
                ...usuario, conta: {
                    nroConta: Number(usuario.conta),
                    saldo: 0
                }
            })
            console.log(resp)
        } catch (error) {
            console.log(error)
        }

    }



    return (
        <div style={{justifySelf:"center",padding:250}}>
        <form onSubmit={postUser}>

            <label> Nome : <input name="nome" onChange={handleChange}></input></label><br />
            <label> CPF : <input name="cpfcnpj" onChange={handleChange} /></label><br />
            <label> Telefone: <input name="telefone" onChange={handleChange} /></label><br />
            <label> Rua: <input name="rua" onChange={handleChange} /></label><br />
            <label> Bairro:<input name="bairro" onChange={handleChange} /></label><br />
            <label> Cidade: <input name="cidade" onChange={handleChange} /></label><br />
            <label> Numero da conta: <input name="conta" type="number" onChange={handleChange} /></label><br />
            <label> Email: <input name="email" type="email" onChange={handleChange} /></label><br />
            <label> Senha: <input name="conta" type="password" onChange={handleChange} /></label><br />

            <button style={{ width: 100}} type="submit">Enviar</button>
        </form>
        </div>
    )
}

export default Form