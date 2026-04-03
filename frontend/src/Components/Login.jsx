import { useState } from "react"

function Login(){
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

    

    
    return(
        <>
        <div className="bg-blue-500 h-15 text-4xl mb-10 pl-10">Login</div>
        <div className="bg-blue-200 h-9/12 w-1/2 place-self-center">
        <div className="p-5 place-self-center">
            <form action="/">
            <label htmlFor="email">Email:</label>
            <input type="email" placeholder="Enter your mail" className="border p-1 block " onChange={(e)=>setEmail(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input type="password" placeholder="Create Password...." className="border p-1 block " onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit" className="bg-green-500 rounded-xl text-white p-2 mt-5" >Submit</button>
            </form>
        </div>
        </div>
        <div>{password+email}</div>
        </>
    )
}

export default Login