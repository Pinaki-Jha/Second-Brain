function FixedEventsChartBox(props){
    return(
        <div className={"h-6 w-12 border-x-2 border-y-2 border-slate-800 mx-0.5 my-0.5 align-middle items-center" + props.color}>
            <h5 className="text-xs main-heading text-center pt-0.5">{props.content}</h5>
        </div>
    )
}

export default FixedEventsChartBox