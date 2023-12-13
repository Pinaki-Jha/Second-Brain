import { useEffect, useRef, useState } from "react"
import { decodeToken } from "react-jwt";
import { Link } from 'react-router-dom';
import {nanoid} from "nanoid"

function Projects(props){

    const [projectList, setProjectList] = useState(props.projectList);
    const [selectedProject, setSelectedProject] = useState(projectList[0]._id || projectList[0].id)
    const [notifvis, setNotifvis] = useState("")
    const [categoryVis,setCategoryVis] = useState("hidden")
    const categoryRef = useRef()
    const projectRef = useRef()

    //console.log(props.projectList[0])

    const toggleCategoryVis=()=>{
        if (categoryVis ==="hidden"){
            setCategoryVis("")
        }
        else{
            setCategoryVis("hidden")
        }
    }
    


    const handleClick = (projectID) => {
        setSelectedProject(projectID);
        //console.log("hi")
        //console.log(selectedProject)
    }

    const projectContent = projectList.find(
        (project) => project._id === selectedProject ||project.id ===selectedProject
      ).content 

    const projectName = projectList.find(
        (project) => project._id === selectedProject ||project.id ===selectedProject
      )


    async function updateProjectList(newprojectlist){

        const token = localStorage.getItem('token')
        const user = decodeToken(token)
        
        user.projectList = newprojectlist;

        const response = await fetch('http://localhost:3000/api/updateprojectlist',{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body : JSON.stringify(user)

        })
      }


    const handleAddProject = ()=>{
        const name = projectRef.current.value
        if(name===""){
            return;
        }
        else{
            const newProjectList =  projectList.map((project) => {

                if (project._id === selectedProject || project.id === selectedProject) {
                  //console.log(project)
                  // Update the content of the specific project
                  const oldContent = project.content;
                  const newContent = [...oldContent, { id: nanoid(), name: name, itemList: [{id:"0", name:"Project Details", content:[]}] }];
                  
                  // Return a new project object with updated content
                  return {...project, content: newContent };
                }
                // Return unchanged projects
                return project;})
            //console.log(newProjectList)
            setProjectList(newProjectList)
            updateProjectList(newProjectList)
              
        }
        projectRef.current.value = null
    }

    function removeCat(id){
        const newProjectList = projectList.filter(projects => projects.id!==id)
        setProjectList(newProjectList)
        updateProjectList(newProjectList)
        setSelectedProject("0")
    }

    function removeProject(id){
        const newProjectList = projectList.map((project)=>{
            const newContent = project.content.filter(pj =>pj.id!==id)
            const newProject = {id:project.id, heading:project.heading, content:newContent};
            return newProject;
        })
        setProjectList(newProjectList)
        updateProjectList(newProjectList)
    }
    const handleAddCategory = ()=>{
        //console.log("yay")
        const heading = categoryRef.current.value
        if (heading===""){
            return;
        }
        else{

            if(projectList.length>0){
                const newProjectList = [...projectList, { id: nanoid(), heading:heading, content:[] }];
                setProjectList(newProjectList)
                updateProjectList(newProjectList)
            }
            else{
                const newProjectList = [{id: nanoid(), heading:heading, content:[]}];
                setProjectList(newProjectList)
                updateProjectList(newProjectList)
                    
                }
        }
        //console.log(heading)
        categoryRef.current.value = null
    }

    let isLight = true;


    return (
        <div className="">
            <h1 className="bold-heading text-5xl my-3 pt-3 text-center md:text-left md:mx-20">The Projects</h1>
            <hr className="md:mx-20 w-11/12 md:w-5/12 border-black"/>

            <div className={"flex flex-row my-2 border border-gray-600 " + notifvis}>
                <button className="text-red-500 px-5" onClick={()=>{setNotifvis("hidden")}}>X</button>
                <p className="px-5 text-gray-400">Note: To create the Project Page, refresh the webpage after updating Project Lists</p>
            </div>

            
            <div className="md:inline-block align-text-top mx-auto hidden ml-10 my-3 pl-2 w-1/4 border-slate-800 border-l">
                
                {projectList.map(projectData=>{
                    return(
                        <>
                        <button key={projectData._id || projectData.id} className="block py-2 rounded-sm hover:bg-indigo-50 main-heading w-full" onClick={() => handleClick(projectData._id || projectData.id)}>{projectData.heading}</button>
                        <hr className="mx-auto w-11/12 border-black"/>
                        </>
                    )
                }   
                )}
                <input className="inline-block w-full  text-center mx-2.5 border-b py-2 border-black focus:outline-none" ref={categoryRef} onKeyDown={function(event){if(event.code==="Enter"){handleAddCategory();}}} placeholder="new category"/>
            </div>

            <div className="md:inline-block align-text-top mx-auto hidden my-3 px-1 border-slate-800 border-r">
                
                {projectList.map(projectData=>{
                    return (projectData.id!="0")?(
                        <>
                        <button key={projectData._id || projectData.id} className="block py-2 rounded-sm hover:bg-red-100 main-heading w-full" onClick={() =>removeCat(projectData._id || projectData.id)}>x</button>
                        </>
                    ):(<div className="block py-2 rounded-sm hover:bg-indigo-50 main-heading w-full"><br/></div>)
                }   
                )}
            </div>


            <div className="inline-block align-text-top ml-5 w-11/12 md:w-8/12 my-3 mr-5 pl-2 border-slate-800 border-r">
                <h1 className="bold-heading inline-block text-4xl">{projectName.heading}</h1>
                <button className={(categoryVis==="hidden")?("bold-heading text-3xl mx-2 text-slate-300 md:hidden rotate-180"):("bold-heading text-3xl mx-2 text-slate-300 md:hidden")} onClick={()=>{toggleCategoryVis()}}>^</button>
                <hr className="w-11/12 md:w-5/12 border-black"/>

                    <div className={categoryVis}>
                    <div className="inline-block flex flex-row md:hidden justify-stretch align-text-top mx-auto w-11/12 my-3 py-3 border-y pl-2 border-slate-800 border-x">
                <div className="w-11/12">
                {projectList.map(projectData=>{
                    return(
                        <>
                        <button key={projectData._id || projectData.id} className="block py-2 rounded-sm hover:bg-indigo-50 main-heading w-full" onClick={() => {handleClick(projectData._id || projectData.id); toggleCategoryVis()}}>{projectData.heading}</button>
                        <hr className="mx-auto w-11/12 border-black"/>
                        </>
                    )
                }   
                )}
                <input className="inline-block w-11/12 text-center mx-2.5 border-b py-2 border-black focus:outline-none" ref={categoryRef} onKeyDown={function(event){if(event.code==="Enter"){handleAddCategory();}}} placeholder="new category"/>
                </div>
                <div>
                {projectList.map(projectData=>{
                    return (projectData.id!="0")?(
                        <>
                        <button key={projectData._id || projectData.id} className="block py-2 rounded-sm hover:bg-red-100 main-heading w-full" onClick={() =>removeCat(projectData._id || projectData.id)}>x</button>
                        </>
                    ):(<div className="block py-4 rounded-sm hover:bg-indigo-50 main-heading w-full"><br/></div>)
                }   
                )}
                </div>
                
                
                </div>
                
                <div className={categoryVis}>
                <div className="inline-block md:hidden hidden align-text-top mx-auto my-3 w-1/11 px-1 border-slate-800 border-r">
                
                {projectList.map(projectData=>{
                    return (projectData.id!="0")?(
                        <>
                        <button key={projectData._id || projectData.id} className="block py-2 rounded-sm hover:bg-red-100 main-heading w-full" onClick={() =>removeCat(projectData._id || projectData.id)}>x</button>
                        </>
                    ):(<div className="block py-4 rounded-sm hover:bg-indigo-50 main-heading w-full"><br/></div>)
                }   
                )}
                </div>
                </div>
            </div>
            <div className="flex flex-row">
            <div className="w-11/12">
                {projectContent.map(content=>{
                    const oldPath = '/'+content.name;
                    const path = oldPath.split(' ').join('-');
                    return(
                        <>
                        <Link to={path} className="block hover:bg-indigo-50 py-1 px-2">{content.name}</Link>
                        <hr className="mx-3 border-black"/>
                        </>
                    )

                })}
                <input className="px-2 py-1 w-full border-black focus:outline-none"  ref={projectRef} onKeyDown={function(event){if(event.code==="Enter"){handleAddProject();}}} placeholder="new project"/>
                <hr className="mx-3 mb-10 border-black"/>
            </div>
            <div className="">
                {projectContent.map(content=>{
                    const oldPath = '/'+content.name;
                    const path = oldPath.split(' ').join('-');
                    return(
                        <>
                        <button className="block hover:bg-red-100 py-1 px-2" onClick={()=>{removeProject(content.id)}}>x</button>
                        </>
                    )

                })}
            </div>
            </div>
            

            
            </div>
            
           
        </div>
    )

}

export default Projects