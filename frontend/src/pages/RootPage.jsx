//import { Link } from "react-router-dom"
//import Quote from "../components/Quote"
import { useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import TextEditor from "../components/TextEditor";
import { useJwt, isExpired, decodeToken } from 'react-jwt'
import conns from '../components/BackendConn';
import axios from "axios";
import {initialValue} from '../components/SlateInitialValue';
import PopupMenu from '../components/PopupMenu';
import NewTextEditor from '../components/NewTextEditor';




function RootPage(props){

    const navigate = useNavigate()
    const [username, setUsername] = useState()

    const { path } = useParams();

    /*useEffect(() => {
        console.log("Params:", user, path);
      }, [user, path]); // Log when params change
    */

    const [data, setData] = useState(null);
    const [currentDir, setCurrentDir] = useState(null);
    const [currentDirOwner,setCurrentDirOwner] = useState(null);
    const [currentFile,setCurrentFile] = useState(null);
    const [saveState, setSaveState] = useState("")
    //const [currentDirData, setCurrentDirData] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ name: '', type: '' });


    const [newDirName,setNewDirName] = useState("")
    const [dirFormVis, setDirFormVis] = useState("hidden")
    const [newFileName, setNewFileName] = useState("")
    const [fileFormVis, setFileFormVis] = useState("hidden")

    const [optVisIndex, setOptVisIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });



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

    const fetchPageContent = async ( ) => {
        try {
            console.log("user:", username);
            console.log("path:", path);
            const response = await fetch(conns.ConnPrefix + `/api/${username}/${path || ''}`,{
            method:"GET"
          });
          const tempdata = await response.json();
          //setCurrentDirData(tempdata);
          setData(tempdata);
          if(tempdata.status==403){
            navigate(`/noaccess/${path}`)
          }
          if(tempdata.type=="directory"){
          setCurrentDir(tempdata.directory);
          setCurrentDirOwner(tempdata.owner);
          setCurrentFile(null);
          }else if (tempdata.type=="file"){
            setCurrentDir(tempdata.directory);
            setCurrentDirOwner(tempdata.owner);
            setCurrentFile(tempdata.file);
          }

        } catch (err) {
          console.error(err);
        }
      };
    
    //sending login details in the header -- see example from the cornell notes app project!!!
    useEffect(() => { 

        //console.log(user, path)
           
          if(username && path){
            console.log(username,path)
            fetchPageContent(username, path);
          }
    }, [username, path]);    

    //console.log(username)

    //console.log(currentDir)

    const handleCreateFile=async (event)=> {
        event.preventDefault();
        if(newFileName.trim()===""){
            console.log("can't create file with empty name")
            return;
        }
        for( let i=0;i< currentDir.files.length;i++){
            let file = currentDir.files[i].name;
            if(file.toLowerCase().trim() === newFileName.toLowerCase().trim()){
                console.log("can't create two files having the same name")
                return;
            }
        }

        const response = await fetch(conns.ConnPrefix + `/api/${username}/${path || ''}`,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
                name: newFileName.trim().toLowerCase(),
                type:"file",
                content: {},
                parent: currentDir.name,
                owner: username,
        
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
        
        for( let i=0;i< currentDir.directories.length;i++){
            let subDir = currentDir.directories[i].name;
            if(subDir === newDirName){
                console.log("can't create two directories having the same name")
                return;
            }
        }

        const response = await fetch(conns.ConnPrefix + `/api/${username}/${path || ''}`,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
                name: newDirName.toLowerCase(),
                type:"directory",
                parent: currentDir.name,
                owner: username,
        
            }),

        })

        const data = await response.json()
        console.log(data)
        
        console.log("Directory created " + newDirName)

        setNewDirName("")
        setDirFormVis("hidden")

        fetchPageContent();
        
    }


   /* const handleOptionsMenuVis = (index)=>{
        setOptVisIndex(optVisIndex===index ? null: index);
    }*/

    const handleOptionsMenuVis = (index, event) => {
        if (optVisIndex === index) {
          setOptVisIndex(null);
        } else {
          const rect = event.target.getBoundingClientRect();
          let top = rect.top + window.scrollY;
          let left = rect.right + window.scrollX;

          const popupHeight = 96;
          const popupWidth = 128; 

          const viewportHeight = window.innerHeight-30;
          const viewportWidth = window.innerWidth;
          if (top + popupHeight > viewportHeight) {
            console.log('oof');
            top = rect.bottom + window.scrollY - popupHeight; // Render above the button
          }
          else{
            top = rect.top + window.scrollY;
          }
      
          // Adjust position if the popup overflows horizontally
          if (left + popupWidth > viewportWidth) {
            left = rect.left + window.scrollX - popupWidth; // Align to the left
          }
      
          setMenuPosition({ top, left });
      
          setOptVisIndex(index);
        }
      };

    const openDeleteModal = (name, type) => {
        setItemToDelete({ name, type });
        setIsModalVisible(true);
    }
    

    const handleDeletion = async (name, type) =>{
        

        const response = await fetch(conns.ConnPrefix + `/api/${username}/${path || ''}`,{
            method:"DELETE",
            headers: {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({
                name: name,
                type:type,
                parent: currentDir.name,
                owner: username,
        
            }),

        })


        const data = await response.json();
        console.log(data);

        fetchPageContent();

    }

    const closeFile =() =>{
        let tempPath = path.split('-');
        tempPath.pop()

        let newPath = tempPath[0]
        console.log(newPath)
        navigate(`/${newPath}`);

    }

    const navigateToDirectory = (dirID) =>{
        navigate(`/${dirID}`)
    }
   /* const navigateToDirectory = (dirName) => {
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
      };*/

    const navigateToFile = (fileId) => {
        
        let tempPath = path.split('-')
        if(tempPath[tempPath.length-1].startsWith('file:')){
            tempPath.pop()
        }
        let correctedPath = tempPath.join('-');
        console.log(correctedPath)


        const newPath = path ? `${correctedPath}-file:${fileId}` : `file:${fileId}`;
        console.log(newPath);
        navigate(`/${newPath}`);


    }
   
   /* const navigateToFile = (fileName) =>{
        if(!path){
            const newPath = fileName;
            navigate(`/${username}/${newPath}`);   
        }

        let tempPath = path.split('-')
        if(tempPath[tempPath.length-1].startsWith('file:')){
            tempPath.pop()
        }
        let correctedPath = tempPath.join('-');
        console.log(correctedPath)

        const newPath = path ? `${correctedPath}-file:${fileName}` : `file:${fileName}`;
        navigate(`/${username}/${newPath}`);
    }*/

    /*const sample_dir = {
        name: 'root',
        owner: username,
        directories: [{id:1,name:'subdir1'},{id:2,name:'subdir2'},{id:3,name:'subdir3'}],
        files: [{id:1,name:'file1'},{id:2,name:'file2'},{id:3,name:'file3'}],
    }*/

    
    const ToggleFileFormVis =()=>{
        if(fileFormVis.trim().toLowerCase()==="hidden"){
            setFileFormVis("")
            setDirFormVis("hidden")
        }else{
            setFileFormVis("hidden");
        }
    }
    const ToggleDirFormVis =()=>{
        if(dirFormVis.trim().toLowerCase()==="hidden"){
            setDirFormVis("")
            setFileFormVis("hidden")
        }else{
            setDirFormVis("hidden");
        }
    }

    if(!data || data.status==404){return <div><p>Loading...</p></div>}

    //console.log(data)

    return(
        
        <div>

            <div className="flex flex-row py-10 pr-10">
                <div className=" w-1/5 h-99-screen border-r-2 border-black bg-gray-50 pl-10">
                <div>
                <div className='flex flex-row justify-items-start items-center'>
                    {currentDir.name!="root" && <button className='flex items-center' onClick={()=>{navigate(-1)}}><span className="material-symbols-outlined">arrow_back</span></button>}
                    <p title={currentDir.name} className="main-heading text-2xl px-2 truncate text-ellipsis whitespace-nowrap">{currentDir.name}</p>
                    
                </div>
                    <p title={currentDirOwner.username} className="main-heading text-base px-2 truncate text-ellipsis whitespace-nowrap">{currentDirOwner.username}</p>
                    
                    <div className=" text-right px-5">
                        <button className="material-symbols-outlined" onClick={()=>{ToggleFileFormVis();}}>note_add</button>
                        <button className="material-symbols-outlined" onClick={()=>{ToggleDirFormVis();}}>create_new_folder</button>
                    </div>
                     {// Forms to add new directory and forms
                    }
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
                    <hr/>
                    
                    <div className="h-3/4 overflow-y-scroll">
      {/* Directories */}
      {currentDir.directories.map((directory, index) => (
        <div className="flex flex-row hover:bg-slate-100" key={directory.id}>
          <p className="px-3 material-symbols-outlined">folder</p>
          <button
            title={directory.name}
            onClick={() => navigateToDirectory(directory.id)}
            className="w-2/3 text-left px-2 truncate text-ellipsis whitespace-nowrap"
          >
            {directory.name}
          </button>
          <div className="w-1/3 flex flex-row justify-evenly">
            <button
              className="material-symbols-outlined"
              onClick={(e) => handleOptionsMenuVis(index, e)}
            >
              more_vert
            </button>
          </div>
          {/* Popup Menu */}
      
        </div>
      ))}

      {/* Files */}
      {currentDir.files.map((file, index) => (
        <div className="flex flex-row hover:bg-slate-50" key={index + currentDir.directories.length}>
          <p className="px-3 material-symbols-outlined">news</p>
          <button
            title={file.name}
            onClick={() => navigateToFile(file.id)}
            className="w-2/3 text-left px-2 truncate text-ellipsis whitespace-nowrap"
          >
            {file.name}
          </button>
          <div className="w-1/3 flex flex-row justify-evenly">
            <button
              className="material-symbols-outlined"
              onClick={(e) => handleOptionsMenuVis(index + currentDir.directories.length, e)}
            >
              more_vert
            </button>
          </div>
          {/* Popup Menu */}
      <PopupMenu
        isVisible={optVisIndex === index + currentDir.directories.length}
        position={menuPosition}
        options={[
          { label: "Open", action: () => navigateToFile(file.id)},
          { label: "Delete", action: () => openDeleteModal(file.id, "file") },
          { label: "Rename", action: () => console.log("Rename action") },
        ]}
        onClose={() => setOptVisIndex(null)}
      />
        </div>
      ))}

      
    </div>

                   {/* <div className='h-3/4 overflow-y-scroll'>
                    {currentDir.directories.map((directory,index)=>{
                        return(
                            <>
                            <div className="flex flex-row hover:bg-slate-100" key={index}>
                                <p className="px-3 material-symbols-outlined">folder</p>
                                <button title={directory} onClick={() => navigateToDirectory(directory)} className="w-2/3 text-left px-2 truncate text-ellipsis whitespace-nowrap">{directory}</button>
                                <div className="w-1/3 flex flex-row justify-evenly" >
                                    <button className="material-symbols-outlined" onClick={()=>{handleOptionsMenuVis(index)}}>more_vert</button>
                                </div>
                                { index === optVisIndex && (
                                <div className="relative">
                                    <div className="absolute w-32 py-2 bg-white text-center border-2 -right-28 z-50">
                                        <button onClick={()=>{ handleOptionsMenuVis(); navigateToDirectory(directory)}}> Open</button>
                                        <hr/>
                                        <button className='' onClick={()=>openDeleteModal(directory, "directory")}>Delete</button>
                                        <hr/>
                                        <button className=''>Rename</button>
                                    </div>
                                </div>
                                )}
                            </div>
                            <hr/>
                            </>
                            )
                            
                    })}
                    
                    {currentDir.files.map((file, index)=>{
                        return(
                            <>
                            <div className="flex flex-row hover:bg-slate-50" key={index + currentDir.directories.length}>
                                <p className="px-3 material-symbols-outlined">news</p>
                                <button title={file} onClick={()=>navigateToFile(file)} className="w-2/3 text-left px-2 truncate text-ellipsis whitespace-nowrap">{file}</button>
                                <div className="w-1/3 flex flex-row justify-evenly" >
                                <button className="material-symbols-outlined"onClick={()=>{handleOptionsMenuVis(index + currentDir.directories.length)}} >more_vert</button>
                                </div>
                                { index + currentDir.directories.length === optVisIndex && (
                                <div className="relative">
                                    <div className="absolute w-32 py-2 bg-white text-center border-2 -right-28 z-10">
                                        <button onClick={()=>navigateToFile(file)}> Open</button>
                                        <hr/>
                                        <button className='' onClick={()=>openDeleteModal(file, "file")}>Delete</button>
                                        <hr/>
                                        <button className=''>Rename</button>
                                    </div>
                                </div>
                                )}
                            </div>
                            <hr/>
                            </>
                            )
                    })}
                    </div>*/}

                   

                </div>
                
                {currentFile && (
                <div className="w-4/5 px-10 main-heading text-sm border-0 hover:border-0 focus:border-0 h-99-screen border-gray-50 border-b-2">
                    <div className="pt-1 pb-1 mb-5 flex flex-row justify-between border-b text-xl">
                        <h1 title={currentFile.name} className='truncate text-ellipsis whitespace-nowrap'>{currentFile.name}</h1>
                        <div className='flex flex-row gap-10 justify-center align-middle items-center'>
                            <p className='text-sm'>{saveState}</p>
                            <button onClick={closeFile}>X</button>
                        </div>
                    </div>
                    <div className='overflow-y-scroll h-5/6'>
                    <NewTextEditor content={currentFile.content} fileId={currentFile._id}/>
                    </div>
                </div> )}
            </div>


    {
        // For Deletion confirmation
    }

            {isModalVisible && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 shadow-lg">
            <p>Are you sure you want to delete {itemToDelete.name}?</p>
            <div className="flex justify-end mt-4">
                <button className=" border-black border hover:bg-slate-200 px-4 py-2 rounded mr-2" 
                    onClick={() =>  {setIsModalVisible(false); setOptVisIndex();handleDeletion(itemToDelete.name, itemToDelete.type)}}>
                    Yes
                </button>
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => {setIsModalVisible(false); setOptVisIndex()}}>
                    No
                </button>
            </div>
        </div>
    </div>
)}


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
