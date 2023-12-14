import axios from "axios"
import { useEffect, useState } from "react";
//import quote from "inspirational-quotes"



function Quote(){

    const quotesAPIRoute = "https://api.quotable.io/random";                         //MIGHT SWITCH TO THIS WHEN I'M 
                                                                                    // DOING THE BACKEND!

    const [quote , setQuote] = useState("");

    useEffect(()=>{
        async function getQuote(){
            try{
                const quoteDataRaw = await axios.get(quotesAPIRoute);
                const quoteData = quoteDataRaw.data.content;
                setQuote(quoteData);

            }catch(error){
                console.log(error);
            }
        }
        getQuote();
    },[])


    return(
        <div className="px-10 py-3 my-3 mx-2 flex h-96 text-center items-center">
            <h1 className="main-heading text-xl md:text-3xl text-center align-middle">{'"' + quote + '"'}</h1>
        </div>
    )


}

export default Quote