import { useEffect, useState } from "react"
import SectionSubsection from "../components/SectionSubsection"
import { useNavigate } from "react-router"
import {decodeToken} from "react-jwt"

function BookPage(){

    const history = useNavigate()
    const [bookList, setbookList] = useState()

    async function getBookList(){
        const token = localStorage.getItem("token")
        if(token){
        const user = decodeToken(token)

        const response = await fetch('/api/getbooklist', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body : JSON.stringify(user) 
        })
        const data = await response.json()
        const booklist = data.booklist
        setbookList(booklist)
    }
    }
    
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
                getBookList()
            }
        }
        else{
            history("/login")
        }
    },[])


    return bookList ? (<SectionSubsection section="booklist" heading= "Books" itemList = {bookList}/>):(<></>)


}

export default BookPage