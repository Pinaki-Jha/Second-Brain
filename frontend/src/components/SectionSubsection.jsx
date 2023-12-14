import { useRef, useState } from "react"
import Subsection from "./Subsection"
import { decodeToken } from "react-jwt"
import { nanoid } from "nanoid"


function SectionSubsection(props){

    

    //let isLight = true
    const [itemList, setItemList] = useState(props.itemList)
    const [selectedSub, setSelectedSub] = useState(itemList[0]._id)
    const [notifvis, setNotifvis] = useState("")
    const [sectionVis,setSectionVis] = useState("")

    const newSectionRef = useRef()

    const toggleSectionVis=()=>{
        if (sectionVis ==="hidden"){
            setSectionVis("")
        }
        else{
            setSectionVis("hidden")
        }
    }
    





    function handleClick(itemID){
        setSelectedSub(itemID)
        console.log(itemContent)
        const newItemContent = itemList.find(
            (item) => ((item._id === selectedSub) || (item.id === selectedSub))
        )
        
    
    }

    const itemContent = itemList.find(
        (item) => ((item._id === selectedSub) || (item.id === selectedSub))
    )


    const handleAddSubsection = () => {
        console.log("yay")
    }

    async function updateSection(newItemList){
        const token = localStorage.getItem('token')
        const user = decodeToken(token)
        user.itemList = newItemList
        user.projectID = props.projectID
        

        const response = await fetch(('/api/updatesection'+ props.section),{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(user)
        })

        //console.log(response)
        const data = await response.json()
        //console.log(data)

    }

    const removeCat = (id) => {
        const newItemList = itemList.filter(item=>item.id!==id)
        console.log(newItemList)
        setItemList(newItemList)
        updateSection(newItemList)

    }


    const handleAddSection = ()=>{
        const name = newSectionRef.current.value;
        if (name===""){
            console.log("nupe")
        }
        else{
                if(itemList.length>0){
                const newItemList = [...itemList, { id: nanoid(), name:name, content:[] }]; 
                setItemList(newItemList)
                updateSection(newItemList)
            }
                else{
                    const newItemList = [{id: nanoid(), name:name, content:[]}];
                    setItemList(newItemList)
                    updateSection(newItemList)
             }

        newSectionRef.current.value = null

    }}

   /*  const updateData= (id, content)=>{
        //console.log(content)
        setItemList((prevItemList)=>{
            let newItemList = prevItemList.map((Sub)=>{
            if(Sub._id === selectedSub ||Sub.id === selectedSub ){
                //console.log("name", Sub.name)
                let newSubContent =  Sub.content.map(stuff=>{
                    if (stuff._id === id || stuff.id === id){
                        const newStuff =  {heading:content, text:stuff.text, id:stuff.id, _id: stuff._id}
                        return newStuff;
                    }
                    return stuff;
                })

                //console.log(newSubContent)

                let newSub = {name:Sub.name, id:Sub.id, _id:Sub._id, content:newSubContent}

                return newSub;

            }
            return Sub;
        })
        console.log(newItemList)
        return newItemList;
        
    })


        //use itemcontent or selected project



        
    } */
    
    return(
        <div className="">
            <h1 className="bold-heading pt-10 text-5xl pb-2 px-2">{props.heading}</h1>
            <hr className="border-black"/>
            <div className={"flex flex-row my-2 border border-gray-600 " + notifvis}>
                <button className="text-red-500 px-5" onClick={()=>{setNotifvis("hidden")}}>X</button>
                <p className="px-5 text-gray-400">Alert: The content is saved every time the enter key is pressed. Keep this in mind to avoid data loss.</p>
            </div>
           
            <div className="flex flex-row mt-3">
            <div className={"w-1/2 md:w-1/5 ml-3 border-black md:inline-block " + sectionVis}>
                {itemList.map(item=>{
                    return(
                        <>
                        <button id={item._id || item.id} className="block py-2 rounded-sm hover:bg-indigo-50 main-heading w-full" onClick={()=>{handleClick(item._id || item.id)}}>{item.name}</button>
                        <hr className="border-black mx-auto"/>
                        </>
                    )
                })}
                <input className="w-full main-heading text-center py-2 border-b border-black focus:outline-none" ref={newSectionRef} onKeyDown={function(event){if(event.code==="Enter"){handleAddSection();}}} placeholder="new category"/>
            </div>
            
            <div className={"px-1 border-black md:inline-block border-r " + sectionVis}>
                {itemList.map(item=>{
                    return item.id !="0" ?(
                        <>
                        <button id={item._id || item.id} className="block py-2 rounded-sm hover:bg-red-100 bold-heading w-full" onClick={()=>{removeCat(item._id || item.id)}}>x</button>
                        </>
                    ):(<div className="block py-2 rounded-sm main-heading w-full"><br/></div>)
                })}
            
                
            </div>
            
            
            <div className="hover:bg-indigo-50 bold-heading px-1 md:hidden" onClick={()=>{toggleSectionVis()}}>
                <h1 className={(sectionVis==="hidden")?("rotate-90"):("-rotate-90")}>^</h1>
            </div>


            {itemList.map(item=>{
                return item.id===selectedSub?(
                    <Subsection itemList={itemList} projectID={props.projectID} section={props.section} itemContent={item}/>
                ):( <></>)})}
                

            
            
            </div>
            
        </div>
    )

}

export default SectionSubsection

//<input type="text" value={content.heading} onChange={/*(e)=>{handleChange(e.target.value);}*/ console.log("woah")} />