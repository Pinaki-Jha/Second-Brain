import { useEffect, useState } from "react"
import { decodeToken } from "react-jwt"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

function Header(props){

    const [logoutVisibility, setLogoutVisibility] = useState("")
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
            const user = decodeToken(token);
            if(user){
                setLogoutVisibility("")
            }
            else{
                setLogoutVisibility("hidden")
                localStorage.removeItem("token")
            }

        }
        else{
            setLogoutVisibility("hidden")
        }
    },[])

    const history = useNavigate()
    const logout = ()=>{
        localStorage.clear()
        history("/login")

    }

    return(
        <div className="w-11/12 mx-auto ">
            <div className="flex flex-row">
            <div className="w-1/2">
                
                <Link to ="/" className="text-2xl m-2 main-heading inline-block">Second Brain</Link>
            </div> 
            <div className="w-1/2 text-right">
                <h1 className={"inline-block mt-3 hover:underline focus:underline " + logoutVisibility} onClick={logout}> | Logout</h1>
            </div>
            
        </div>
        <hr className="border-black"/>
        </div>
    )
    // return(
    //     <div className="bg-slate-950 margin-0 py-2 text-center">
    //         <h1 className="text-slate-50 text-lg main-heading">Second Brain</h1>

    //     </div>
    // )
}

export default Header