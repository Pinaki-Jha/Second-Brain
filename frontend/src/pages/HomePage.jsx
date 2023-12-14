import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Quote from "../components/Quote"
import { useEffect, useState} from 'react'
import { useJwt, isExpired, decodeToken } from 'react-jwt'

function HomePage(props){

    const history = useNavigate()
    const [username, setUsername] = useState()
    
    useEffect(()=>{
        const token = localStorage.getItem("token");
        //console.log("yay")
        if(token){
            //console.log("yay2")
            const user = decodeToken(token)
            if (!user){
                localStorage.removeItem("token")
                history("/login")
            }
            else{
                setUsername(user.username)
            }
        }
        else{
            history("/login")
        }
    },[])

    console.log(username)

    
    return(
        <div>

            <div className="pt-3 mx-auto main-heading">
                <h1 className="text-center text-5xl my-3">Welcome, {username}</h1>
                <hr className="mx-auto w-11/12 md:w-5/12 border-black"/>
            </div>

            <div className="flex flex-col md:flex-row my-16 main-heading">

                <div className="md:w-1/2 border-x mx-2 md:mx-0 md:ml-5 border-black">
        
                    <div className="flex flex-row">
                        <div className="w-1/2 border-r py-3 border-black px-5 hover:bg-indigo-50">
                            <Link to="/project list">
                                <h1 className="text-5xl bold-heading">Projects</h1>
                                <p className="my-3 mr-16 pl-1 pb-10">Organize all the resources for your projects in one place.</p>
                            </Link>
                        </div>
                        <div className="md:w-1/2 px-5 py-3 hover:bg-indigo-50">
                            <Link to="/book page">
                                <h1 className="text-5xl bold-heading">Books</h1>
                                <p className="my-3 pl-1 mr-16">Organize your learnings from the books you have read.</p>
                            </Link>
                        </div>
                    </div>

                    <hr className="border-black w-11/12 mx-auto my-2"/>

                    <div className="px-5 pb-1 pt-3 hover:bg-indigo-50">
                        <Link to="/todo list">
                            <h1 className="text-5xl bold-heading">To Do</h1>
                            <p className="my-3 mr-16 pl-1 pb-9 mb-4">Review pending tasks and start finishing them off, one at a time.</p>
                        </Link>
                    </div>

                    <hr className="border-black md:hidden w-11/12 mx-auto my-2"/>
                    
                    

                    
                </div>

                <div className="md:w-1/2 border-r border-l md:border-l-0 mx-2 md:mx-0 md:mr-5  border-black main-heading">
                    <Quote/>
                </div>
                <hr className="border-black md:hidden w-11/12 mx-auto my-2"/>
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
