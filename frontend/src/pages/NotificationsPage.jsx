import { useEffect, useState } from "react"
import conns from "../components/BackendConn";
import { useNavigate } from "react-router";
import { decodeToken } from "react-jwt";
import { Link } from "react-router-dom";

function NotificationsPage(){

    const [username,setUsername] = useState();
    const [data, setData] = useState(null);
    const [notifs,setNotifs] = useState(null);
    
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

    const grantAccess = async(notif_id)=>{
        console.log("granting access...")
        try{
            const response = await fetch(conns.ConnPrefix + `/api/reqacc/${username}/${notif_id}`,{
                method:'PATCH'
            })

            const data = await response.json();
            if(data.status==200){
                fetchNotifications();
            }
        }catch(err){
            console.log(err.message)
        }
        
    } 
    const deleteNotif = async (notif_id) =>{
        console.log("deleting notification...");
        try{
            const response = await fetch(conns.ConnPrefix + `/api/notifications/${username}/${notif_id}`,{
                method:'DELETE'
            })

            const data = await response.json();
            if(data.status==200){
                fetchNotifications();
            }
        }catch(err){
            console.log(err.message)
        }
        
    }

    const fetchNotifications = async()=>{
        const response = await fetch(conns.ConnPrefix + `/api/notifications/${username}`,{
            method:"GET"
          });
          console.log(response)
          const tempData = await response.json();
          setData(tempData);
          console.log(tempData);

          setNotifs(tempData.notifications);
    }

    useEffect(()=>{ 
        if(username){
        fetchNotifications();
        }
    },[username])

    if(!data || data.status==404){return <div><p>Loading...</p></div>}
    return (
    <div className="pl-10 py-10 main-heading">
        <h1 className="bold-heading text-xl">Notifications</h1>
        <hr className="w-11/12 my-1"/>
        <div className=" overflow-y-auto"></div>
        {notifs.map((notif)=>(
            <div key={notif._id} className="border border-black w-11/12 py-3 px-2 my-1 bg-gray-50 flex flex-row justify-between items-start">
                
                {notif.type.toUpperCase() ==="REQACC" && 
                    <div>
                        <p className=" text-sm">{notif.sender.name} is requesting access to the resource <Link to={`/${notif.directory}`} className="hover:text-blue-900 hover:underline">{notif.directory}</Link> owned by you.</p>
                        <button className="mx-2 px-2 py-1 underline hover:bg-blue-200 text-sm" onClick={()=>{grantAccess(notif._id)}}> Grant</button>
                        <button className="mx-2 px-2 py-1 underline hover:bg-red-200 text-sm" onClick={()=>{deleteNotif(notif._id)}}>Decline</button>
                    </div>
                }
                <button className="mr-1 h-full" onClick={()=>{deleteNotif(notif._id)}}>x</button>
            </div>
        ))}
        
    </div>)

}


export default NotificationsPage