'use client'
import { UserSchema } from "@/Model/models"
import React from "react"





  export default function CardUser(props:UserSchema
    ){
    function firstLetter(nome : string){
    let nome_lista = nome.split("");
    return nome_lista[0]
  }
        return(
        <>
            <h1>{props.nome}</h1>
        </>
        )   
    }