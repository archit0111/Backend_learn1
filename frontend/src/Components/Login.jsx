import { useState } from "react"
import {useNavigate} from 'react-router-dom'

function Login(){
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const navigate = useNavigate();

    const handelSubmit = async(e)=>{
        e.preventDefault();
        const inputByUser = {email,password}

        try{
            const res = await fetch("http://localhost:8080/api/user/login",{
                method: "POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(inputByUser)
            })
            const data = await res.json();
            console.log(data);
            if(res.ok){
                localStorage.setItem("token",data.token);
                localStorage.setItem("refreshToken",data.refreshToken);
                navigate('/dashboard');
            }else{
                alert(data.message);
            }
        }catch(e){
            console.log("Error occered in login request!!");
        }
    }

    
    return(
        <>
        <div className="bg-blue-500 h-15 text-4xl mb-10 pl-10">Login</div>
        <div className="bg-blue-200 h-9/12 w-1/2 place-self-center">
        <div className="p-5 place-self-center">
            <form onSubmit={handelSubmit}>
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