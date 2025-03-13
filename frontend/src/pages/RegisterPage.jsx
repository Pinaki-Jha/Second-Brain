import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import favicon from "../assets/favicon.png";
import { useJwt, isExpired, decodeToken } from 'react-jwt'
import conns from "../components/BackendConn"
import axios from "axios";

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

    const [usernameValidity, setUsernameValidity] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);


    const [passwordVisibility, setPasswordVisibility] = useState("password")

    const handleUsernameChange = (e)=>{
        const value = e.target.value.toLowerCase();

        // Update username state
        setUsername(value);

        

        // Clear any existing timeout
        if (typingTimeout) clearTimeout(typingTimeout);

        // Set a new timeout to delay the request
        setTypingTimeout(
            setTimeout(() => {
            const validationError = validateUsername(value);
    
            if (validationError.toLowerCase() !== "success") {
                setMessage(validationError)
                console.error(validationError);
            } else {
                checkUsernameAvailability(value);
            }
            }, 2000)
        );
    }

    const validateUsername = (value) =>{
        const regex = /^[a-z0-9_-]+$/; // Only lowercase letters, numbers, hyphens, and underscores
    const minLength = 3;
    const maxLength = 30;

    if (value.length < minLength || value.length > maxLength) {
        setUsernameValidity(false);
        setMessage("Username must be between 3 and 30 characters.")
        return "Username must be between 3 and 30 characters.";
    }

    if (!regex.test(value)) {
        setUsernameValidity(false);
        setMessage("Username can only contain lowercase letters, numbers, hyphens, and underscores.");
        return "Username can only contain lowercase letters, numbers, hyphens, and underscores.";
    }

    setUsernameValidity(true); // Valid input
    setMessage("")
    return "success";
  };
    

    const checkUsernameAvailability= async (username)=>{
        try{
            const response = await axios.post(conns.CheckUsernameConn,{username});
            if (response.data.available){ setUsernameAvailable(true)}
            else{setUsernameAvailable(false)}
        }catch(err){
            console.error("error checking username availability",err);
            setUsernameAvailable(false);
        }
    }

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

        else if(usernameAvailable && usernameValidity){
            setMessage("")

        const response = await fetch(conns.RegisterConn,{
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
           {/* <div className="flex flex-col">
                    <div className="flex flex-row">
                        <h1 className=" px-auto py-1">Username</h1>
                        <input pattern="[a-z0-9_-]+" minlength="3" maxlength="30"  required className="inline-block border-b w-full focus:outline-none border-black py-1 " value={username} type="text" placeholder="username" onChange={(e)=>{handleUsernameChange(e)}}/>
                        <p>{usernameAvailable? "Y": "N"}</p>

                    </div>
                </div>
           */}
            <div className="flex flex-row">
                <div className="md:w-1/4 py-12 px-5 md:px-32 text-left">
                <h1 className=" px-auto py-1">Username</h1>
                <h1 className="px-auto py-1">Email</h1>
                <h1 className="px-auto py-1">Password</h1>
                <h1 className="px-auto py-1">Confirm Password</h1>
                </div>
                <div className=" w-3/4 pr-12 py-12">
                    
                    <div className="flex flex-row items-center">
                        <input required className={"inline-block border-b w-full focus:outline-none border-black py-1 " + (usernameValidity ? " ":" bg-red-200")} value={username} type="text" placeholder="username" onChange={(e)=>{handleUsernameChange(e)}}/>
                        <p>{usernameAvailable? "Y": "N"}</p>
                    </div>
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