import { useState } from "react";
import ToDo from "../components/ToDo";
import { useNavigate } from "react-router";
import { decodeToken } from "react-jwt";

function ToDoPage(){

    const history = useNavigate()

    useState(()=>{
        const token = localStorage.getItem('token')
        if(token){
            const user = decodeToken(token)
            if(!user){
                localStorage.removeItem(token)
                history('/login')
            }
         
            }
        else{
            history('/login')
        }
    })

    return(
        <ToDo/>
    )
}

export default ToDoPage