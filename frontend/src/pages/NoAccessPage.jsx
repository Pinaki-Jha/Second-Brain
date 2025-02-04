import { useState } from "react";
import { Link } from "react-router-dom";

function NoAccessPage(){

    const [requestSent, setRequestSent] = useState(false);

    const sendAccessRequest = () =>{
        setRequestSent(true);
    }
    return(
        <div className="w-11/12 mx-auto main-heading">
            <div className="flex flex-col py-10 px-5 bg-gray-200">
                {requestSent?
                <>
                <h1 className="text-lg bold-heading">Request Sent</h1>
                <h1>Your Request has been sent successfully to the resource owner</h1>
                </>
                :
                <>
                <h1 className="text-lg bold-heading"> Access Denied</h1>
                <p> You do not have access to the requested resource.</p>
                <button className="inline w-2/12 border-black border my-3 py-1 px-2 bg-white hover:bg-gray-100 focus:bg-gray-100" onClick={()=>{sendAccessRequest()}}> Request Access</button>
                </>
                }
                <Link to='/' className="text-sm underline">Back to Homepage</Link>
                
                
                
            </div>
        </div>
    )
}


export default NoAccessPage;