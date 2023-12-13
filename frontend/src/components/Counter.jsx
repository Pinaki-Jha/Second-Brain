import { useState } from "react"

function Counter(props){
    const [counter, setCounter] = useState(0)

    function increaseCount(count){
        setCounter(count+1)
    }
    function resetCount(){
        setCounter(0)
    }
    return(
        <div className="w-64 h-72 mx-3 items-center align-middle text-center my-3 flex flex-col border-slate-800 border-x-4 border-y-4 ">
            <h1 className="main-heading text-2xl my-4">{props.name}</h1>
            <p className="text-7xl my-4">{counter}</p>
            <div className="flex flex-row">
                <button className="my-4 mx-4 border-slate-950 border-x-2 border-y-2 rounded-sm py-2 px-3 bg-slate-300" onClick={()=>{increaseCount(counter)}}>Add</button>
                <button className="my-4 mx-4 border-slate-950 border-x-2 border-y-2 rounded-sm py-2 px-3  bg-slate-300" onClick={resetCount}>Reset</button>
            </div>
        </div>
    )

}

export default Counter