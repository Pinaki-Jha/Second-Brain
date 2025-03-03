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
import * as jsonpatch from "fast-json-patch"; // ✅ Import diffing library
import ImageTool from "@editorjs/image";


// ✅ Initialize WebSocket connection
const socket = io("http://localhost:3000");

const NewTextEditor = () => {
    const editorRef = useRef(null);
    const [value, setValue] = useState([]);
    const [username, setUsername] = useState("");
    const { path } = useParams();
    const isUpdatingRef = useRef(false); // ✅ Prevents infinite loop

    const previousStateRef = useRef(null); // ✅ Stores last saved state


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
                    editorRef.current.render(data.content[0] || { blocks: [] });
                }

                setValue(data.content);
                previousStateRef.current = data.content || { blocks: [] };
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
                    /* image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: "http://localhost:3000/api/upload-image", // ✅ Image upload endpoint
                            },
                            field: "image", // ✅ The field name for file uploads
                            types: "image/*", // ✅ Restrict file types to images only
                        },
                    }, */
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: "http://localhost:3000/api/upload-image",
                            },
                            field: "image",
                            types: "image/*",
                            additionalRequestHeaders: {
                                "Access-Control-Allow-Origin": "*", // ✅ Ensures CORS issues are avoided
                            },
                            onUpload(response) {
                                console.log("✅ Image upload response:", response);
                            },
                            onUploadError(error) {
                                console.error("❌ Image upload failed:", error);
                            },
                            actions: [
                                {
                                    icon: '<svg>...</svg>', // ✅ Default trash icon (or customize)
                                    title: "Delete Image",
                                    action: (block) => {
                                        const imageUrl = block.data.file?.url;
                                        if (!imageUrl) return;
            
                                        console.log("Deleting image from backend:", imageUrl);
            
                                        fetch("http://localhost:5000/api/delete-image", {
                                            method: "DELETE",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ url: imageUrl }),
                                        })
                                        .then((res) => res.json())
                                        .then((data) => console.log("Image delete response:", data))
                                        .catch((err) => console.error("Error deleting image:", err));
            
                                        // ✅ Remove block from Editor.js
                                        editorRef.blocks.delete(block.id);
                                    }
                                }
                            ]
                        },
                    },
                },
                 
                /*onReady: () => {
                    console.log("Editor is ready!");
                
                    const editorContainer = document.querySelector("#editorjs");
                
                    if (!editorContainer) {
                        console.error("Editor container not found!");
                        return;
                    }
                
                    // ✅ Create a MutationObserver
                    const observer = new MutationObserver((mutationsList) => {
                        mutationsList.forEach((mutation) => {
                            // ✅ Detect deleted images
                            mutation.removedNodes.forEach((node) => {
                                if (node.nodeType === 1 && node.querySelector("img")) {
                                    const deletedImage = node.querySelector("img");
                                    const imageUrl = deletedImage.getAttribute("src");
                
                                    if (imageUrl) {
                                        console.log("Image deleted:", imageUrl);
                
                                        // ✅ Send delete request to backend
                                        fetch("http://localhost:3000/api/delete-image", {
                                            method: "DELETE",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ url: imageUrl }),
                                        })
                                        .then((res) => res.json())
                                        .then((data) => console.log("Image delete response:", data))
                                        .catch((err) => console.error("Error deleting image:", err));
                                    }
                                }
                            });
                        });
                    });
                
                    // ✅ Start observing changes in the editor container
                    observer.observe(editorContainer, { childList: true, subtree: true });
                },*/
                
                /*onReady: () => {
                    console.log("Editor is ready!");
                
                    const editorContainer = document.querySelector("#editorjs"); // ✅ The Editor.js container
                
                    if (!editorContainer) {
                        console.error("Editor container not found!");
                        return;
                    }
                
                    // ✅ Create a MutationObserver
                    const observer = new MutationObserver((mutationsList) => {
                        mutationsList.forEach((mutation) => {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1 && node.querySelector("img")) { // ✅ Detect images
                                    console.log("New image detected:", node);
                
                                    // ✅ Wrap image inside a resizable container
                                    node.querySelectorAll("img").forEach((img) => {
                                        if (!img.parentElement.classList.contains("resizable-container")) {
                                            const wrapper = document.createElement("div");
                                            wrapper.classList.add("resizable-container");
                                            img.parentNode.insertBefore(wrapper, img);
                                            wrapper.appendChild(img);
                                            console.log("Image wrapped inside resizable container!");
                                        }
                                    });
                                }
                            });
                        });
                    });
                
                    // ✅ Start observing changes in the editor container
                    observer.observe(editorContainer, { childList: true, subtree: true });
                },*/
                onChange: async () => {

                    //--- for saving content and websocket wizardry
                    if (isUpdatingRef.current) return; // ✅ Prevent infinite loops
                    
                    const savedData = await editorRef.current.save();
                    setValue(savedData);
    
                    // ✅ Compute the diff (patch)
                    if (previousStateRef.current) {
                        const patch = jsonpatch.compare(previousStateRef.current, savedData);
                        if (patch.length > 0) {
                            console.log("Detected changes:", patch);
                            socket.emit("fileUpdate", { fileId: path, diffs:patch }); // ✅ Send only the changes
                        }
                    }
    
                    previousStateRef.current = savedData; // ✅ Store current state for next diff comparison


                    //for images
                        

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
        socket.on("updateFile", (patch) => {
            console.log("Received update from WebSocket:", patch);
    
            if (!previousStateRef.current || !previousStateRef.current.blocks) {
                console.warn("Previous state is undefined. Initializing...");
                previousStateRef.current = value || { time: Date.now(), blocks: [] };
            }
            try {
                // ✅ Apply the patch to previous state
                const updatedContent = jsonpatch.applyPatch(previousStateRef.current, patch).newDocument;
    
                console.log("Updated content after applying patch:", updatedContent);
    
                isUpdatingRef.current = true; // ✅ Prevent triggering `onChange`
                
                if (editorRef.current) {
                    editorRef.current.render(updatedContent);
                }
    
                setValue(updatedContent);
                previousStateRef.current = updatedContent; // ✅ Store latest state
                isUpdatingRef.current = false;
    
            } catch (err) {
                console.error("Error applying patch:", err);
            }
        });
    
        return () => {
            socket.off("updateFile");
        };
    }, []);

     useEffect(() => {
        const handleAutoSave = async () => {
            console.log('Attempting backend save');
    
            if (!value || !username || !path) return;
    
            try {
                await fetch(conns.ConnPrefix + `/api/filecontent/${username}/${path || ''}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: value, // ✅ Sends updated content
                    }),
                });
    
            } catch (err) {
                console.error("Error saving file:", err);
            }
        };
    
        const delayDebounceFn = setTimeout(() => {
            handleAutoSave();
        }, 5000); // ✅ Auto-save every 5 seconds
    
        return () => clearTimeout(delayDebounceFn);
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