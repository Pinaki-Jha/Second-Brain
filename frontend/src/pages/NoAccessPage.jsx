import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt, isExpired, decodeToken } from 'react-jwt'
import conns from "../components/BackendConn";


function NoAccessPage(){

    const [requestSent, setRequestSent] = useState(false);

    const { path } = useParams();
    const [username, setUsername] = useState()
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        //console.log("yay")
        if(token){
            //console.log("yay2")
            const user = decodeToken(token)
            if (!user){
                localStorage.removeItem("token")
                navigate("/login")
            }
            else{
                setUsername(user.username)
            }
        }
        else{
            navigate("/login")
        }
    },[])

    useEffect(()=>{
        const checkAccess = async () =>{
            const response = await fetch(conns.ConnPrefix + `/api/access/${username}/${path}`,{
                method:'GET'
            })
            const data = await response.json()

            if(data.status===200 && data.access===true){
                navigate(`/${path}`)
            }
        }
        if(username){
        checkAccess();
        }
    },[username])
    const sendAccessRequest = async() =>{

        try{
            const response = await fetch(conns.ConnPrefix + `/api/reqacc/${username}/${path || ''}`,{
                method:"POST",
                headers:{},
                body:{}
              });
            
            const tempdata = await response.json();
            if(tempdata.status==200){
                setRequestSent(true);
            }
        }catch(err){
            console.log(err);
        }
    }

    
    return(
        <div className="w-11/12 mx-auto main-heading">
            <div className="flex flex-col py-10 px-5 bg-gray-200">
                {requestSent?
                <>
                <h1 className="text-lg bold-heading">Request Sent</h1>
                <h1>Your Request has been sent successfully to the resource owner</h1>
                </>
                :
                <>
                <h1 className="text-lg bold-heading"> Access Denied</h1>
                <p> You do not have access to the requested resource.</p>
                <button className="inline w-2/12 border-black border my-3 py-1 px-2 bg-white hover:bg-gray-100 focus:bg-gray-100" onClick={()=>{sendAccessRequest()}}> Request Access</button>
                </>
                }
                <Link to='/' className="text-sm underline">Back to Homepage</Link>
                
                
                
            </div>
        </div>
    )
}


export default NoAccessPage;