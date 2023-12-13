//DOESN'T MATTER ANYMORE, REMOVE
import FixedEventsChartBox from "./FixedEventsChartBox"

function FixedEventsChartRow(props){
    const colorList = ["bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800","bg-slate-800"]
    console.log(props.colorList)
    return(
        <div className="flex flex-row my-1.5">
            <div className="h-6 w-24 mx-1 pl-1">
                <h5 className="main-heading text-sm">{props.day}</h5>
            </div>

            {colorList.map(color=>{
                return(
                    <FixedEventsChartBox color={color}/>
                )
            
            })}
        </div>
       
    )
}

export default FixedEventsChartRow