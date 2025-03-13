import { useEffect, useState } from "react"
import { decodeToken } from "react-jwt"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

function Header(props){

    const [user,setUser] = useState(null)
    const [logoutVisibility, setLogoutVisibility] = useState("")
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
            const theUser = decodeToken(token);
            setUser(theUser)
            if(theUser){
                setLogoutVisibility("")
                //console.log(theUser);
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

    const navigate = useNavigate()
    const logout = ()=>{
        localStorage.clear()
        navigate("/login")

    }

    return(
        <div className="w-11/12 mx-auto ">
            <div className="flex flex-row">
            <div className="w-1/2">
                
                <Link to ="/" className="text-2xl m-2 main-heading inline-block">Second Brain</Link>
            </div> 
            <div className="w-1/2 text-right flex flex-row justify-end gap-4 ">
                {user && <h1 className="my-auto" onClick={()=>{navigate(`/notifications/${user.id}`)}}>N</h1>}
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