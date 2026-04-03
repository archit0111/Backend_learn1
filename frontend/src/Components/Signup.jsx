import { useState } from "react";

function Signup(){
    const [name,setName]= useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

    const handelSubmit= async (e)=>{
        e.preventDefault();
        const userData = {name,email,password};
        console.log(userData);

        try{
            const res = await fetch("http://localhost:8080/Signup",{
                method: "POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(userData)
            });
            const data = await res.JSON;
            console.log(`res is comming: ${data}`);
        }catch(e){
            console.log("Error occred in sending data....",e)
        }
    }

    
    return(
        <>
        <div className="bg-blue-500 h-15 text-4xl mb-10 pl-10">Signup</div>
        <div className="bg-blue-200 h-9/12 w-1/2 place-self-center">
        <div className="p-5 place-self-center">
            <form onSubmit={handelSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter your name" className="border p-1 block " onChange={(e)=>setName(e.target.value)} />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your mail" className="border p-1 block " onChange={(e)=>setEmail(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" placeholder="Create Password...." className="border p-1 block " onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit" className="bg-green-500 rounded-xl text-white p-2 mt-5">Submit</button>
            </form>
        </div>
        </div>
        <div>{name+password+email}</div>
        </>
    )
}

export default Signup