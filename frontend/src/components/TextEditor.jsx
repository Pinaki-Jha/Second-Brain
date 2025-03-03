// Import React dependencies.
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Editor, Element, createEditor, Transforms, Text } from 'slate'
import { useJwt, isExpired, decodeToken } from 'react-jwt'
import { useParams } from 'react-router'
import { Slate, Editable, withReact, useSelected, useFocused, } from 'slate-react'
import {withHistory} from 'slate-history'
import {initialValue, Heading1Element, Heading2Element, Heading3Element, Heading4Element, 
  Heading5Element, Heading6Element, DefaultElement } from './SlateInitialValue'
import conns from './BackendConn'
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");



const Leaf = ({ attributes, children, leaf }) => {
  
  let text = leaf.text;
  const selected = useSelected();
  const focused = useFocused();


  if (text !== "" && !(selected && focused)) {
    // headings | bold | italics | crossed out | highlight
    children = text.replace(/(^#{1,6} )|(\*\*(.*?)\*\*)|(\*(.*?)\*)|(~~(.*?)~~)|(==(.*?)==)|(`(.*?)`) /g, (match) => {
      if (match.startsWith("#")) {
        return "";
      }
      else if (match.startsWith("**") && match.endsWith("**")) {     //bold
        return match.slice(2, -2);  
      }
      else if(match.startsWith("*") && match.endsWith("*")){        //italics
        return match.slice(1,-1);
      }
      else if (match.startsWith("~~") && match.endsWith("~~")) {   //crossed out
        return match.slice(2, -2);  
      }
      else if (match.startsWith("==") && match.endsWith("==")){
        return match.slice(2,-2);
      }
      else if (match.startsWith("`")){
        return match.slice(1,-1);
      }
      return match;
    });
  }  
  // Assign the final text to children
  //children = text;
  
  



  return <span {...attributes} 
    className={ 
      (leaf.bold? " font-extrabold ":" ") + 
      (leaf.italic? " italic ": " ") +
      (leaf.crossedOut? " line-through ": " ") + 
      (leaf.highlight? " bg-yellow-100 ":" ") +
      (leaf.code? " bg-gray-100 font-mono px-1 ":" ")
      }>
    {children}
    </span>;
};

const TextEditor = ({content,fileId}) => {

  const editor = useMemo(()=>withHistory(withReact(createEditor())),[]);

  const [value, setValue] = useState(initialValue)
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {path} = useParams()

  useEffect(()=>{
    const token = localStorage.getItem("token");
    console.log("yay")
    if(token){
        console.log("yay2")
        const user = decodeToken(token)
        if (!user){
            localStorage.removeItem("token")
        }
        else{
            setUsername(user.username)
            console.log(user.username)
        }
    }
},[path])


const lastOpsRef = useRef([]); // ✅ Move useRef outside of useEffect



  const renderElement = useCallback(props=>{
    let text = props.element.children[0].text
    //console.log(text)
    if (text.startsWith("# ")){
      return <Heading1Element {...props}/>
    }else if (text.startsWith("## ")){
      return <Heading2Element {...props}/> 
    }else if (text.startsWith("### ")){
      return <Heading3Element {...props}/> 
    }else if (text.startsWith("#### ")){
      return <Heading4Element {...props}/> 
    }else if (text.startsWith("##### ")){
      return <Heading5Element {...props}/> 
    }else if (text.startsWith("###### ")){
      return <Heading6Element {...props}/> 
    }else{
      return <DefaultElement {...props}/>
    }

  
  },[])


  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);


  const decorate = useCallback(([node,path])=>{
    const ranges =[];

    if(Text.isText(node)){

      const {text} = node;
      const boldPattern = /\*\*(.*?)\*\*/g;
      const italicPattern = /\*(.*?)\*/g;
      const crossedOutPattern = /~~(.*?)~~/g;
      const highlightPattern = /==(.*?)==/g;
      const codePattern = /`(.*?)`/g;
      let match;

      while ((match = boldPattern.exec(text))!==null){
        const start = match.index;
        const end = match.index + match[0].length;

        ranges.push({
          anchor:{ path, offset:start},
          focus: { path, offset:end},
          bold: true,
          hiddenMarks: {start,end},
        })
      }

      while((match = italicPattern.exec(text))!==null){
        const start = match.index;
        const end = match.index + match[0].length;

        ranges.push({
          anchor:{path,offset:start},
          focus:{path,offset:end},
          italic:true,
          hiddenMarks:{start,end},
        })
      }

      while ((match = crossedOutPattern.exec(text))!==null){
        const start = match.index;
        const end = match.index + match[0].length;

        ranges.push({
          anchor:{ path, offset:start},
          focus: { path, offset:end},
          crossedOut: true,
          hiddenMarks: {start,end},
        })
      }

      while ((match = highlightPattern.exec(text))!==null){
        const start = match.index;
        const end = match.index + match[0].length;

        ranges.push({
          anchor:{ path, offset:start},
          focus: { path, offset:end},
          highlight: true,
          hiddenMarks: {start,end},
        })
      }

      while ((match = codePattern.exec(text))!==null){
        const start = match.index;
        const end = match.index + match[0].length;

        ranges.push({
          anchor:{ path, offset:start},
          focus: { path, offset:end},
          code: true,
          hiddenMarks: {start,end},
        })
      }


    }

    return ranges;
  },[])


  /* useEffect(()=>{

    const handleGetFile = async() => {
      try{

        setValue(null);
        
        const response = await fetch(conns.ConnPrefix + `/api/filecontent/${username}/${path ||''}`,{
          method:"GET",
      });
        const data = await response.json();
        setValue(data.content);

        

      }catch(err){console.log(err)}
    };

    handleGetFile();
  },[path,username])
 */
  /*const handleChange = (newValue) => {
    const operations = editor.operations
        .filter(op => op.type !== "set_selection") // Ignore cursor movements
        .map(({ type, path, offset, text, position }) => ({
            type, path, offset, text, position
        })); // Extract necessary fields
    console.log(operations.length)    
    if (operations.length > 0) {
        socket.emit("textChange", { fileId, operations });
    }

    setValue(newValue);
};*/

/* useEffect(() => {
  if (!fileId) return;

  socket.emit("joinFile", fileId);

  socket.on("updateFile", (newContent) => {
      console.log("Received new file content:", newContent);
      setValue(newContent); // Update editor content
  });

  return () => {
      socket.off("updateFile");
      socket.disconnect();
  };
}, [fileId]);
 */
const handleChange = (newValue) => {
  setValue(newValue); // Update local state
  socket.emit("fileUpdate", { fileId, content: newValue }); // Send full file
};


  useEffect(()=>{

    const handleAutoSave= async () =>{
      try{
        //console.log(user + path)
        setIsSaving(true);
        const response = await fetch(conns.ConnPrefix +  `/api/filecontent/${username}/${path || ''}`,{
          method:"PATCH",
          headers:{"Content-Type":"application/json",},
          body:JSON.stringify({
            content:value,
          })
        })
       

 //       const data = await response.json()
 //       console.log(data)
  
      }catch(err){
//        console.log("oops")
        console.log(err)
      }
    }


    const delayDebounceFn = setTimeout(()=>{
      handleAutoSave();
    },2000)

    return()=>clearTimeout(delayDebounceFn);

  },[value])

  
  if(!value){return <div><p>Loading...</p></div>}
  return (

      <div>
      <Slate editor={editor}  initialValue={value} onChange={ (value) => {handleChange(value);}}>
        <Editable 
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          decorate = {decorate}
          onKeyDown={event=>{
            if(event.key==="h" && event.altKey){
              event.preventDefault();
              const [match] = Editor.nodes(editor,{match:n=>n.type=='heading-1',})
              Transforms.setNodes(
                editor,
                {type: match ? "paragraph": "heading-1"},
                {match: n=>Element.isElement(n) && Editor.isBlock(editor,n)}
              )
            }
          }}
          className='focus:outline-none'/>
      </Slate>
      </div>
    )
  }


export default TextEditor