import { useRef, useState } from "react";
import { decodeToken } from "react-jwt";

function SectionContent(props){

    const content = props.content;
    
    const [heading, setHeading] = useState(content.heading)
    const [text, setText] = useState(content.text)
    const [row, setRow] = useState(content.row)

    const headingRef = useRef()
    const textRef = useRef()

    //update values for every 20 or so change in words? And whenever the user presses enter. Simple and easy.

    async function updateContent(){
        console.log("updating")

        const token = localStorage.getItem('token')
        const user = decodeToken(token)

        const projectID = props.projectID
        const parentID = props.parentid
        const contentID = content.id
        const newHeading = headingRef.current.value;
        const newText = textRef.current.value;
        const request = {...user, heading:newHeading, text:newText, projectID:projectID, id:contentID, parentid:parentID, row:row}
        //console.log(request)


        const response = await fetch(('http://localhost:3000/api/updatesection'+ props.section +"updatecontent"),{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(request)
        })



    }

    const resetContent =() =>{
        if (text.length ==0){
            setRow(1)
        }
    }




    return(
        <div key={content._id || content.id} className="">
            <div className= "flex flex-row justify-content">
                    <input ref={headingRef} className="text-2xl main-heading pt-3 px-4 focus:outline-none w-full" type="text" placeholder="new heading" value={heading} onChange={(e)=>{setHeading(e.target.value)}} onKeyDown={(e)=>{if(e.code==="Enter"){updateContent();}}}/>

            </div>
                    <textarea rows={String((text.length/115)+ row) } ref={textRef} className="pb-3 px-6 main-heading focus:outline-none w-full resize-none" type="text" placeholder="new text" value={text} onChange={(e)=>{setText(e.target.value); if((text.length)%120===0){updateContent();}}} onKeyDown={(e)=>{if(e.code==="Enter"){setRow(row+1); updateContent();}else if(e.code=="Backspace"){resetContent();if((text.length)%120===0){updateContent();}}}}></textarea>
        </div>
                    
    )
}

export default SectionContent