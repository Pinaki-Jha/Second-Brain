//import { Link } from "react-router-dom"
//import Quote from "../components/Quote"
import { useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import TextEditor from "../components/TextEditor";
import { useJwt, isExpired, decodeToken } from 'react-jwt'
import conns from '../components/BackendConn';
import axios from "axios";

function RootPage(props){

    const navigate = useNavigate()
    const [username, setUsername] = useState()

    const { user, path } = useParams();

    const [data, setData] = useState(null);
    const [currentDir, setCurrentDir] = useState(null);
    const [currentDirData, setCurrentDirData] = useState(null);
    const [currentFile,setCurrentFile] = useState(null);

    const [newDirName,setNewDirName] = useState("")
    const [dirFormVis, setDirFormVis] = useState("hidden")
    const [newFileName, setNewFileName] = useState("")
    const [fileFormVis, setFileFormVis] = useState("hidden")
    
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

    const fetchPageContent = async () => {
        try {

          const response = await fetch(conns.ConnPrefix + `/api/${user}/${path || ''}`,{
            method:"GET"
          });
          const tempdata = await response.json();
          setCurrentDirData(tempdata);
          setData(tempdata);
          if(tempdata.type=="directory"){
          setCurrentDir(tempdata.directory);
          setCurrentFile(null);
          }else if (tempdata.type=="file"){
            setCurrentDir(tempdata.directory);
            setCurrentFile(tempdata.file);
          }

        } catch (err) {
          console.error(err);
        }
      };

    //sending login details in the header -- see example from the cornell notes app project!!!
    useEffect(() => {
        
        fetchPageContent();
    }, [user, path]);    

    //console.log(username)

    //console.log(currentDir)

    const handleCreateFile=async (event)=> {
        event.preventDefault();
        
        for( let i=0;i< currentDirData.directory.files.length;i++){
            let file = currentDirData.directory.files[i]
            if(file === newFileName){
                console.log("can't create two files having the same name")
                return;
            }
        }

        const response = await fetch(conns.ConnPrefix + `/api/${user}/${path || ''}`,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
                name: newFileName,
                type:"file",
                content: "",
                parent: currentDirData.directory.name,
                owner: user,
        
            }),

        })

        const data = await response.json()
        console.log(data)
        //console.log("file created " + newFileName)

        setNewFileName("")
        setFileFormVis("hidden")

        fetchPageContent();
        

    }

    const handleCreateDirectory=async (event)=>{

        event.preventDefault();
        
        for( let i=0;i< currentDirData.directory.directories.length;i++){
            let subDir = currentDirData.directory.directories[i]
            if(subDir === newDirName){
                console.log("can't create two directories having the same name")
                return;
            }
        }

        const response = await fetch(conns.ConnPrefix + `/api/${user}/${path || ''}`,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
                name: newDirName,
                type:"directory",
                parent: currentDirData.directory.name,
                owner: user,
        
            }),

        })

        const data = await response.json()
        console.log(data)
        
        console.log("Directory created " + newDirName)

        setNewDirName("")
        setDirFormVis("hidden")

        fetchPageContent();
        
    }


    const navigateToDirectory = (dirName) => {
        if(!path){
            const newPath = dirName;
            navigate(`/${username}/${newPath}`);   
        }

        let tempPath = path.split('-')
        if(tempPath[tempPath.length-1].startsWith('file:')){
            tempPath.pop()
        }
        let correctedPath = tempPath.join('-');
        console.log(correctedPath)
        
        const newPath = path ? `${correctedPath}-${dirName}` : dirName;
        navigate(`/${username}/${newPath}`);
      };

    const navigateToFile = (fileName) =>{
        const newPath = path ? `${path}-file:${fileName}` : `file:${fileName}`;
        navigate(`/${username}/${newPath}`);
    }

    const sample_dir = {
        name: 'root',
        owner: username,
        directories: [{id:1,name:'subdir1'},{id:2,name:'subdir2'},{id:3,name:'subdir3'}],
        files: [{id:1,name:'file1'},{id:2,name:'file2'},{id:3,name:'file3'}],
    }

    if(!data || data.status==404){return <div><p>Loading...</p></div>}

    console.log(data)

    return(
        
        <div>

            <div className="flex flex-row py-10 px-10">
                <div className="w-1/5 min-h-screen border-r-2 border-black">
                    <p className="main-heading text-2xl px-2">{currentDir.name=="root" ? username : currentDir.name}</p>
                    <hr/>
                    <div className=" text-right px-5">
                        <button className="material-symbols-outlined" onClick={()=>{setFileFormVis("")}}>note_add</button>
                        <button className="material-symbols-outlined" onClick={()=>{setDirFormVis("")}}>create_new_folder</button>
                    </div>
                    <hr/>

                    {currentDir.directories.map((directory)=>{
                        return(
                            <div className="flex flex-row" key={directory.id}>
                                <p className="px-3 material-symbols-outlined">folder</p>
                                <button onClick={() => navigateToDirectory(directory)} className="w-2/3 text-left px-2">{directory}</button>
                                <div className="w-1/3 flex flex-row justify-evenly" >
                                <button className="material-symbols-outlined">more_vert</button>
                                </div>
                                
                            </div>)
                    })}
                    
                    {currentDir.files.map((file)=>{
                        return(
                            <div className="flex flex-row" key={file.id}>
                                <p className="px-3 material-symbols-outlined">news</p>
                                <button onClick={()=>navigateToFile(file)} className="w-2/3 text-left px-2">{file}</button>
                                <div className="w-1/3 flex flex-row justify-evenly" >
                                <button className="material-symbols-outlined">more_vert</button>
                                </div>
                            </div>)
                    })}
                    


                    <div className={"px-3 " + dirFormVis}>
                        <form className="" onSubmit={handleCreateDirectory}>  
                            <input required className="inline-block border-b w-full focus:outline-none border-black py-1" value={newDirName} type="text" placeholder="new Directory" onChange={(e)=>{setNewDirName(e.target.value)}}/>
                            <div className="text-right">
                            <input type="submit" className="material-symbols-outlined" value="check"/>
                            <button className="material-symbols-outlined" onClick={()=>{setDirFormVis("hidden")}}>close</button>
                            </div>
                        </form>
                    </div>

                    <div className={"px-3 " + fileFormVis}>
                        <form className="" onSubmit={handleCreateFile}>  
                            <input required className="inline-block border-b w-full focus:outline-none border-black py-1" value={newFileName} type="text" placeholder="new File" onChange={(e)=>{setNewFileName(e.target.value)}}/>
                            <div className="text-right">
                            <input type="submit" className="material-symbols-outlined" value="check"/>
                            <button className="material-symbols-outlined" onClick={()=>{setFileFormVis("hidden")}}>close</button>
                            </div>
                        </form>
                    </div>


                </div>
                
                {currentFile && (
                <div className="w-4/5 px-10 main-heading text-sm border-0 hover:border-0 focus:border-0">
                    <div className="pt-1 pb-1 mb-5 flex flex-row justify-between border-b text-xl">
                        <h1>{currentFile.name}</h1>
                        <button>X</button>
                    </div>
                    
                    <TextEditor/>
                </div> )}
            </div>




            
            
        </div>
    )
}

export default RootPage



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
