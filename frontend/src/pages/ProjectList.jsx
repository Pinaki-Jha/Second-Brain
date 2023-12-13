import Projects from "../components/Projects";
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

function ProjectList(){ 

    const history = useNavigate()
    const [projectList, setProjectList] = useState()

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



    async function getProjectList() {
        const token = localStorage.getItem('token');
        if(token){
        const user = decodeToken(token);
        const response = await fetch('http://localhost:3000/api/getprojectlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
      
        const data = await response.json();
        const lalaList = await data.projectlist;
      
        setProjectList(lalaList);
      }
    }
      
      useEffect(() => {
        getProjectList();
      }, []);
      
      
      
      
      



    
    //console.log(projectList)


    

    return projectList ? (<Projects projectList={projectList}/>
    ):(<></>)
}

export default ProjectList