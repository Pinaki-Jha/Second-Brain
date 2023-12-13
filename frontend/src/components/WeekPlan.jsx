function WeekPlan(props){
    
    return (
        <div className="inline-block my-3 mx-3 border-slate-800 border-x-4 border-y-4 h-96 w-96">
        <div className='h-96 w-96'>
            <img src ={props.img} className="absolute h-96 w-96 -z-10 pr-2 pb-2"/>
            <h1 className='text-slate-50 px-5 py-5 main-heading text-2xl'>{props.day}</h1>
            <p className="text-slate-50 pl-6 py-3 pr-20">{props.content}</p>
        </div>
        </div>
    )

}

export default WeekPlan