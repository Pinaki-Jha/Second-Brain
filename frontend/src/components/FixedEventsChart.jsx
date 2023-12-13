import FixedEventsChartRow from "./FixedEventsChartRow"
import FixedEventsChartBox from "./FixedEventsChartBox"
function FixedEventsChart(props){

    const chartDataList = [ {day:"Sunday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]},
                            {day:"Monday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]},
                            {day:"Tuesday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]},
                            {day:"Wednesday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]},
                            {day:"Thursday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]},
                            {day:"Friday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]},
                            {day:"Saturday",data:[{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"},{hour:"0-1",color:"bg-slate-300"}]}
                            
                      ]
    
    const chartData = chartDataList[new Date().getDay()]
    

    return(

       <div className="flex flex-col mt-5 border-slate-800 border-x-4 border-y-4 py-3 pr-4">
            <div>
                <h1 className="main-heading text-2xl text-center">Chart-Fixed Events</h1>
            </div>                    
            <div className="w-1/4 mx-2">
                <h1 className="text-center main-heading bg-slate-900 text-white">{chartData.day}</h1>
            
            
            <div className = " my-1.5 grid grid-cols-6">
                {chartData.data.map(data=>{
                    return(
                        <div className={"h-6 w-12 border-x-2 border-y-2 border-slate-800 mx-0.5 my-0.5 align-middle items-center " + data.color}>
                            <h5 className="text-xs main-heading text-center pt-0.5">{data.hour}</h5>
                        </div>
                    )

                })}
            </div>
            </div>
            
            
            
        </div>  




    )
    
    /* return(
        <div className="flex flex-col mt-5 border-slate-800 border-x-4 border-y-4 py-3 pr-4">
            <div>
                <h1 className="main-heading text-2xl text-center">Chart-Fixed Events</h1>
            </div>   

            <div className="flex flex-row my-1.5">
                        <div className="h-6 w-24 mx-1 pl-1">
                        </div>
            
                        {hours.map(hour=>{
                            return(
                                <FixedEventsChartBox content={hour}/>
                            )
                        
                        })}
                    </div>
            {colorList.map(day=>{
                return(
                    <div className="flex flex-row my-1.5">
                        <div className="h-6 w-24 mx-1 pl-1">
                            <h5 className="main-heading text-sm">{day.day}</h5>
                        </div>
            
                        {day.colors.map(color=>{
                            return(
                                <FixedEventsChartBox color={color}/>
                            )
                        
                        })}
                    </div>
                   
                )
            })}
            
        </div>
    )
 */
}

export default FixedEventsChart