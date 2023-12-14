import { useRef, useState } from "react";
import SectionContent from "./SectionContent";
import { decodeToken } from "react-jwt";
import { nanoid } from "nanoid";

function Subsection(props){
    

    const [itemContent, setItemContent] = useState(props.itemContent);
    const newHeadingRef = useRef();
    const newTextRef = useRef();

    //console.log(props.itemList)

    //console.log(itemContent)

    async function updateItemContent(itemList, toUpdateItemContent){
        //console.log("yay")
        const token = localStorage.getItem('token')
        const user = decodeToken(token)

        const newItemList = itemList.map(item=>{
            if (item.id ===toUpdateItemContent.id){
                //console.log("it is", itemContent)
                item.content = toUpdateItemContent.content;
                return item
            }
            return item
        })
        //console.log(newItemList)

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
        //const data = await response.json()
        //console.log(data)

    }
    
  

    const handleAddSubsection = ()=>{
        const id = nanoid()
        let toUpdateItemContent= {id:itemContent.id, name:itemContent.name, content:[...itemContent.content, {id:id, heading:"",text:"",row:1}]}

        //let newItemContent = itemContent
        //newItemContent.content = [...newItemContent.content,{heading:"",text:""}]
        //console.log(newItemContent)
        setItemContent(prevItemContent=>{
            let newItemContent= {id:prevItemContent.id, name:prevItemContent.name, content:[...prevItemContent.content, {id:id, heading:"",text:"",row:1}]}
            return newItemContent
        })
        updateItemContent(props.itemList, toUpdateItemContent);


    }

    
    
    return(
        <div className="w-4/5 mx-3 border-slate-800 ">
                <h1 className="main-heading pt-4 text-3xl pb-2 px-2" >{itemContent.name}</h1>
                <hr className="border-black"/>
                {itemContent.content.map(content=>{
                    console.log("yay")

                    
                    //function handleChange(data){
                        //updateData(content._id || content.id, data)
                    //}
                    return(
                        <SectionContent projectID={props.projectID} section={props.section} parentid={itemContent.id} content={content}/>
                        )
                })}
                <div>
                        <button onClick={handleAddSubsection}>Add Section</button>
                        
                        <br/>
                </div>
               
            </div>
    )
}

export default Subsection;

//<input className="w-full px-4 border-b border-black focus:outline-none" ref={newHeadingRef} placeholder="heading"/>
//<textarea  rows='10' className="w-full px-6 border-b h-auto min-h-fit border-black outline-none focus:outline-none" ref={newTextRef} placeholder="text"></textarea>
                        