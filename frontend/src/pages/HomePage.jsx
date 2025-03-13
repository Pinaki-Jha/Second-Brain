import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import { useJwt, isExpired, decodeToken } from 'react-jwt'
import favicon from "../assets/favicon.png";
import conns from '../components/BackendConn';


function HomePage(props) {

    const navigate = useNavigate()

    const [username, setUsername] = useState()
    const [User, setUser] = useState()
    const [root, setRoot] = useState()
    

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        //console.log("yay")
        if (token) {
            //console.log("yay2")
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem("token")
                navigate("/login")
            }
            else {
                setUsername(user.username)
                console.log("username set")
            }
        }
        else {
            navigate("/login")
        }
        
    }, [])

    useEffect(()=>{
        if(username){
        const fetchUser = async()=>{
            try{
                const response = await fetch(conns.ConnPrefix + `/api/homeinfo/${username}`);
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUser(data.user); 
                
                setRoot((prev) => {
                    const newRoot = data.root;
                    return newRoot;
                  });
                  
                console.log(data.root.id)
            }catch(err){
                console.log("error")
            }
        }
        fetchUser();
    }
    },[username])
    //console.log(username)

    useEffect(() => {
        if (root && root.id) {
          navigate(`/${username}/${root.id}`);
        }
      }, [root, navigate, username]);
      


    return (
        <div>
            <div>
            <img src={favicon} className="h-16 md:h-32 mt-5 mx-auto"/>
            </div>

            <div className="pt-3 mx-auto main-heading">

                <p className="text-center text-base md:text-xl mt-3 mb-1">Welcome</p>
                <hr className="mx-auto w-11/12 md:w-5/12 border-black" />
                <h1 className="text-center text-3xl md:text-5xl my-3">{username}</h1>
            </div>
            <div className="flex flex-row mt-5 gap-10 justify-center items-center">
                <button className="py-2 px-2 border border-black bg-gray-200 hover:bg-gray-50" onClick={()=>{navigate(`/${root._id}`)}}>Your Folders</button>
                <button className="py-2 px-2 border border-black  hover:bg-gray-50">Shared With You</button>

            </div>

                   </div>
    )
}

export default HomePage



/*<div className="flex flex-row">
                        <div className="md:w-1/2 border-r py-3 border-black px-5 hover:bg-slate-100">
                            <Link to="/journal">
                                <h1 className="text-5xl">Journal</h1>
                                <p className="my-3 mr-16 pl-1 pb-10">Review your works and continue right where you left off </p>
                            </Link>
                        </div>
                        
                        <div className="md:w-1/2 px-5 py-3 hover:bg-slate-100">
                            <Link to="/calendar">
                                <h1 className="text-5xl">Calendar</h1>
                                <p className="my-3 pl-1 mr-16">Plan your days, weeks and months ahead.</p>
                            </Link>
                        </div>
                        
                    </div>
                    */

/*<div className="px-5 pb-9 pt-3 hover:bg-slate-100">
                        <Link to="/notes">
                            <h1 className="text-5xl">Notes</h1>
                            <p className="my-3 pl-1 pr-16 pb-9 mb-4">Review your tasks for the day and start finishing them off, one at a time.</p>
                        </Link>
                    </div>
                 */
