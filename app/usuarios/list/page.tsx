'use client'
import { userSchema, UserSchema } from "@/Model/models"
import api from "@/services/api/api"
import React, { useEffect } from "react"
import CardUser from "../card/page"




export default function List() {

    const [users, setUsers] = React.useState<UserSchema[]>([])

    async function getUsers() {
        const resp = await api.get("/usuarios")
        setUsers(resp.data)
        console.log(users)
    }
    useEffect(()=>{getUsers()},[])
    return (
        <>
            <button onClick={getUsers}>cliqeu aqui</button>
            {users.map((user) => (
                <CardUser key={user.id} {...user}></CardUser>
            )
            )
            }
        </>
    )
}