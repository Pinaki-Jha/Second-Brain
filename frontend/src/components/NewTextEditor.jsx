import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import CustomHeader from "./editorComponents/customHeader";
import { useParams } from "react-router";
import conns from "./BackendConn";
import { decodeToken } from "react-jwt";
import { debounce } from "lodash";
import { io } from "socket.io-client";


// ✅ Initialize WebSocket connection
const socket = io("http://localhost:3000");

const NewTextEditor = () => {
    const editorRef = useRef(null);
    const [value, setValue] = useState([]);
    const [username, setUsername] = useState("");
    const { path } = useParams();
    const isUpdatingRef = useRef(false); // ✅ Prevents infinite loop

    // ✅ Decode user token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = decodeToken(token);
            if (!user) localStorage.removeItem("token");
            else setUsername(user.username);
        }
    }, [path]);

    // ✅ Fetch file content & join WebSocket room
    useEffect(() => {
        const handleGetFile = async () => {
            try {
                setValue(null);
                console.log("Fetching file...");

                const response = await fetch(conns.ConnPrefix + `/api/filecontent/${username}/${path || ''}`, {
                    method: "GET",
                });

                const data = await response.json();
                console.log("Fetched content:", data.content);
                
                if (editorRef.current) {
                    await editorRef.current.isReady;
                    editorRef.current.render(data.content || { blocks: [] });
                }

                setValue(data.content);
                socket.emit("joinFile", path); // ✅ Join WebSocket room

            } catch (err) {
                console.error("Error fetching file:", err);
            }
        };

        handleGetFile();
    }, [path, username]);

    // ✅ Initialize Editor.js with WebSocket integration
    useEffect(() => {
        if (!editorRef.current) {
            editorRef.current = new EditorJS({
                holder: "editorjs",
                tools: {
                    header: {
                        class: CustomHeader,
                        inlineToolbar: true,
                        config: {
                            placeholder: "Enter a heading",
                            levels: [1, 2, 3, 4, 5, 6],
                            defaultLevel: 1,
                        }
                    },
                    list: List,
                    paragraph: Paragraph,
                },
                onChange: async () => {
                    if (isUpdatingRef.current) return; // ✅ Prevent self-triggered updates
                    const savedData = await editorRef.current.save();
                    console.log("Local change detected:", savedData);
                    setValue(savedData);
                    socket.emit("fileUpdate", { fileId: path, content: savedData }); // ✅ Send updates to WebSocket
                }
            });
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    // ✅ Handle incoming WebSocket updates
    useEffect(() => {
        socket.on("updateFile", (newContent) => {
            console.log("Received update from WebSocket:", newContent);

            // ✅ Prevent applying already applied changes
            if (JSON.stringify(newContent) === JSON.stringify(value)) {
                console.log("Skipping redundant update...");
                return;
            }

            isUpdatingRef.current = true; // ✅ Prevent triggering `onChange`
            if (editorRef.current) {
                editorRef.current.render(newContent);
            }
            setValue(newContent);
            isUpdatingRef.current = false;
        });

        return () => {
            socket.off("updateFile");
        };
    }, [value]);

    return (
        <div>
            <div id="editorjs" className="border w-full"></div>
        </div>
    );
};

export default NewTextEditor;




/*import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import CustomHeader from "./editorComponents/customHeader";
import { useParams } from "react-router";
import conns from "./BackendConn";
import { decodeToken } from "react-jwt";
import { debounce } from "lodash";


const NewTextEditor = () => {
    
    const editorRef = useRef(null);

    const [value, setValue] = useState([])
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
    

    
    useEffect(() => {
        const editor = new EditorJS({
            holder: "editorjs",
            autofocus: true,
            tools: {
                paragraph: Paragraph,
                header: {
                    class: CustomHeader,
                    inlineToolbar: true,
                    config: {
                        placeholder: "Enter a heading",
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 1,
                    },
                },
                list: { class: List, inlineToolbar: true },
                marker: Marker,
                inlineCode: InlineCode,
            },
            data: {
                time: new Date().getTime(),
                blocks: [{ type: "paragraph", data: { text: "" } }], // ✅ Ensure valid default structure
            },
            onChange: debounce(async () => {
                if (editorRef.current) {
                    const savedData = await editorRef.current.save();
                    console.log("saved")
                    console.log(savedData);
                    // ✅ Validate saved data structure before updating state
                    if (!savedData || !savedData.blocks || !Array.isArray(savedData.blocks)) {
                        console.error("Invalid data saved:", savedData);
                        return;
                    }
            
                    //setValue(savedData);
                }
            }, 1000)
            
        });
    
        editorRef.current = editor;
    
        return () => {
            //editor.destroy();
        };
    }, []);
    

    useEffect(() => {
        const handleGetFile = async () => {
            try {
                setValue(null); // Clear existing content
    
                const response = await fetch(conns.ConnPrefix + `/api/filecontent/${username}/${path || ''}`, {
                    method: "GET",
                });
    
                const data = await response.json();
                setValue(data.content);
    
                // ✅ Load data into Editor.js if instance is initialized
                if (editorRef.current) {
                    await editorRef.current.isReady; // Wait for Editor.js to be ready
                    editorRef.current.render(data.content || { blocks: [] });
                }
    
            } catch (err) {
                console.log(err);
            }
        };
    
        handleGetFile();
    }, [path, username]);
       

      useEffect(() => {
        const handleAutoSave = async () => {
            if (!value || !username || !path) return;
    
            console.log("saving to backend")
            try {
                setIsSaving(true);
                await fetch(conns.ConnPrefix + `/api/filecontent/${username}/${path || ''}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: value, // ✅ Sends updated content
                    }),
                });
    
            } catch (err) {
                console.error("Error saving file:", err);
            } finally {
                setIsSaving(false);
            }
        };
    
        const delayDebounceFn = setTimeout(() => {
            handleAutoSave();
        }, 2000); // ✅ Auto-save every 2 seconds
    
        return () => clearTimeout(delayDebounceFn);
    }, [value]);
    

    return <div id="editorjs" className="focus:outline-none"></div>;
};

export default NewTextEditor;
*/