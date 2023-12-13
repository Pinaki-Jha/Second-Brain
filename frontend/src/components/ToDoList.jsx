import { useRef, useState } from "react";

function ToDoList(props){
    
  const [todos, setTodos] = useState([ ])  //An array of todos and a method to set the vales inside it using the usestate hook.
  const toDoNameRef = useRef()             //using the useRef hook to get access to the input value in the form into a variable. 

  
  
  function toggleTodo(id){
    let newTodos = [...todos];
    const todo= newTodos.find(todo => todo.id===id)
    todo.complete = !todo.complete;
    setTodos(newTodos)
  }
  //Have to add Storage functionality using MongoDB and Mongoose

  function handleAddToDo(){                   //function to handle adding to-dos to the list   
    const name = toDoNameRef.current.value;   
    if(name===""){              //prevent addition of empty strings as todos
      return;
    }
    setTodos(prevTodos => {     //add this todo to the list of prev todos as an object with id randomly generated)
      return[...prevTodos,{id:Math.random(),name:name,completed:false}];   //might look up an npm library for random id generated later
    })
    console.log(todos)
    toDoNameRef.current.value= null;

  }

//function to clear all todos
  function handleClearToDo(){
    const newTodos = todos.filter(todo =>!todo.complete);

    setTodos(newTodos)
  }

  let isLight = true;


    return(
        <div className="inline-block my-3 mx-3 border-slate-800 border-x-4 border-y-4 w-96 h-96">
            <h1 className="px-5 py-5 text-2xl main-heading">TO-DO</h1> 
            <button className="border-slate-950 border-x-2 border-y-2 rounded-sm mx-4 p-1 bg-slate-300" onClick={handleClearToDo}>Clear Completed</button>
            {todos.map(task=>{
                function handleChange(){
                    toggleTodo(task.id)
                }

                isLight = !isLight;
                
                return isLight?(
                <>
                <label className="block px-3 bg-slate-300 w-92">
                    <input type="checkbox" className="pr-2" checked={task.complete} onClick={handleChange}/>
                    <>{task.name}</>
                    <hr/>

                </label>
                </>):(
                    <>
                    <label className="block px-3 bg-slate-200">
                        <input type="checkbox" className = "pr-2" checked={task.complete} onClick={handleChange}/>
                        <>{task.name}</>
                        <hr/>
    
                    </label>
                    </>
  
                )
            })}
            <div>
        <input className= "mx-4 align-text-bottom border-slate-300 border-x-2 border-y-2" type="text" ref={toDoNameRef} onKeyDown = {function(event){if(event.code==="Enter"){handleAddToDo();}}} ></input>
        <button onClick={handleAddToDo}>Add</button>
         
      </div>

        </div>
    )
}

export default ToDoList;


