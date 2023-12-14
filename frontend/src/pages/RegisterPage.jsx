import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import favicon from "../assets/favicon.png";
import { useJwt, isExpired, decodeToken } from 'react-jwt'

function RegisterPage(){

    const history = useNavigate()
    
    
    useEffect(()=>{
        const token = localStorage.getItem("token");
        console.log("yay")
        if(token){
            console.log("yay2")
            const user = decodeToken(token)
            if (user){
                history("/")
            }
            else{
                localStorage.removeItem("token")  
            }
        }
    },[])


    const [username,setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [message, setMessage] = useState("")
    const [messageColor, setMessageColor] = useState("text-red-500")

    const [passwordVisibility, setPasswordVisibility] = useState("password")

    const togglePasswordVisibility = ()=>{
        if (passwordVisibility == "password"){
            setPasswordVisibility("text")
        }
        else{
            setPasswordVisibility("password")
        }

    }

    async function registerUser(event){

        event.preventDefault()

        if (password != confirmPassword){
            setMessage("Passwords don't match.")
        }

        else{
            setMessage("")

        const response = await fetch('/api/register',{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
                username,
                email,
                password,
            }),

        })

        console.log(response)

        const data = await response.json()
        setMessage(data.message)
        setMessageColor(data.color)
        console.log(data)

    }
}


    return(
        <div className="main-heading w-11/12 md:w-1/2 mx-auto my-12 pt-12 border text-center border-black ">
            <img src={favicon} className="h-16 md:h-32 mx-auto"/>
            <h1 className="text-5xl text-center">Welcome!</h1>
            <hr className="my-2 w-11/12 mx-auto border-black"/>

            <form onSubmit={registerUser} className="">
            <div className="flex flex-row">
                <div className="md:w-1/4 py-12 px-5 md:px-32 text-left">
                <h1 className=" px-auto py-1">Username</h1>
                <h1 className="px-auto py-1">Email</h1>
                <h1 className="px-auto py-1">Password</h1>
                <h1 className="px-auto py-1">Confirm Password</h1>
                </div>
                <div className=" w-3/4 pr-12 py-12">
                
                <input required className="inline-block border-b w-full focus:outline-none border-black py-1 " value={username} type="text" placeholder="username" onChange={(e)=>{setUsername(e.target.value)}}/>
                <br/>
                <input required className="inline-block border-b w-full focus:outline-none border-black py-1" value={email} type="email" placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
                <br/>
                <input required className="inline-block border-b w-full focus:outline-none border-black py-1" value={password} type={passwordVisibility} placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
                <br/>
                <input required className="inline-block border-b w-full focus:outline-none border-black py-1" value={confirmPassword} type={passwordVisibility} placeholder="password" onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                <br/>
                <input className="inline-block border-b border-black py-6" type="checkbox" onClick={togglePasswordVisibility}/> Show Password
                <br/>
                </div>
            </div>

            <h1 className={messageColor}>{message}</h1>
                
                <input className="border border-black p-2 hover:bg-slate-200" type="Submit" value="Register"/>
            </form>

            <h1 className="my-3 inline-block">Already a member? </h1> <Link className="inline-block text-blue-500" to="/login">Log in.</Link>
            
        </div>
    )
}

export default RegisterPage