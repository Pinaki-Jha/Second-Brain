import { nanoid } from "nanoid"
import { useRef, useState, useEffect } from "react"
import { decodeToken } from "react-jwt"
import { useNavigate } from "react-router"

function ToDo(){

    const [todoList,setTodoList] = useState()
    const newTodoRef = useRef()

    const history = useNavigate()


    async function getTodos(){
        const token = localStorage.getItem('token')
        const user = decodeToken(token)
        const response = await fetch('http://localhost:3000/api/gettodo',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(user)
        })

        //console.log(response)
        const data = await response.json()
        //console.log(data)
        const todoList = data.todo
        //console.log(todoList)
        setTodoList(todoList)
        


    }
    
    
    useEffect(()=>{
        getTodos()    
    },[])

    async function updateTodos(newtodolist){
        //console.log("hey")

        const token = localStorage.getItem('token')
        const user = decodeToken(token)
        user.toDoList = newtodolist

        const response = await fetch('http://localhost:3000/api/updatetodo',{
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

    const toggleTodoCompletion = id =>{
        
        let newTodoList = [...todoList]
        const todo = newTodoList.find(todo => todo._id ===id || todo.id === id)
        todo.completed = !todo.completed
        setTodoList(newTodoList)
        //console.log(todoList)
        updateTodos(newTodoList)

    }

    const handleRemoveToDo = () =>{
        const newTodoList = todoList.filter(todo =>!todo.completed);
        setTodoList(newTodoList)
        //console.log(todoList)
        updateTodos(newTodoList)
    }

    const handleAddToDo = ()=>{
        //console.log("add todo works")
        const name = newTodoRef.current.value;
        if (name===""){
            return;
        }
        else{
            const id = nanoid()
            if(todoList.length>0){
                const newTodoList = [...todoList,{ id: id, name: name, completed: false},];
                console.log(newTodoList)
                setTodoList(newTodoList)
                updateTodos(newTodoList);
            }
            else{
                const newTodoList = [{id: id, name: name, completed: false}];    
                setTodoList(newTodoList)
                updateTodos(newTodoList);
                }
            


              //console.log("todo list",todoList)  
            //console.log(todoList)
            newTodoRef.current.value = null;
            
            return id;
            
        }
    }

    return(
        <div>
            <h1 className="bold-heading text-5xl my-3 pt-3 text-center md:text-left md:mx-20">ToDo List</h1>
            <hr className="mx-20 md:w-11/12 border-black"/>

            <div className="md:w-1/2 my-10 md:mx-6 mx-4 main-heading px-2 border-l border-black">

            {todoList ? (

                todoList.map(todo=>{
                    const handleClick=()=>{
                        toggleTodoCompletion(todo._id || todo.id)
                        //console.log("clicked " + todo.name + "!")
                    }
                    return(
                    <label key={todo._id || todo.id} className="block hover:bg-indigo-50 pt-2" onClick={handleClick}>
                        <p className={todo.completed? ("line-through mx-1"):("mx-1")}>{todo.name}</p>
                        <hr className="border-black"/>
    
                    </label>
                   
                    )
                })
            ):(
                <></>
            )
            }

            

            <input className="border-b w-full pt-4 mb-4 border-black focus:outline-none"  ref={newTodoRef} placeholder="Add a new task..." onKeyDown={function(event){if (event.code ==="Enter"){handleAddToDo();}}} type ="text"/>
            <button className = "hover:bg-red-100" onClick={()=>{handleRemoveToDo()}}>Clear Completed Tasks</button>
            </div>

            

        </div>
    )
}

export default ToDo