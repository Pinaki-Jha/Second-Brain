import SectionSubsection from "../components/SectionSubsection";
import { decodeToken } from "react-jwt";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function ProjectPage(props){

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
        }
        else{
            history("/login")
        }
    },[])
  
  
    //console.log(props.projectID)
    return (
        <SectionSubsection section="projectlist" projectID={props.projectID} heading = {props.heading} itemList = {props.itemList}/>
    )

}

export default ProjectPage;