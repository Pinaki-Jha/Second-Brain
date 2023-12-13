import { Link } from "react-router-dom"

function ErrorPage(){
    return(
        <div className="text-center main-heading">
            <h1 className="py-2 bold-heading text-5xl">404 Page Not Found</h1>
            <hr className="md:w-5/12 w-8/12 border-black mx-auto"/>
            <p>There seems to be an error.</p>
            <Link to="/">Back to Home</Link>
        </div>
    )
}

export default ErrorPage