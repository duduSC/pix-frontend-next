import React from "react"
import api from "@/services/api"
import { User } from "../../Model/userModel";



export default function Users(){
    
    const [user,setUser] = React.useState<User>();
    React.useEffect(() => {
            async function postUser() {
                const resposta = await api.post("/users",user)

        
                setUser(resposta.data)
            }
        
        }
    )

    return(
        <>
            <p>Página de Cadastro de Usuário</p>
        </>
    )
}