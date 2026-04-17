import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

const callfornewToken = async()=>{
    try{
        alert("inside calling reftok");
        const res = await fetch("http://localhost:8080/api/user/refreshToken",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "refreshToken":`${localStorage.getItem("refreshToken")}`
            }
        });
        const data = await res.json();
        if(!res.ok){
            alert("Session expired, Login again!");
            return res.ok;
        }else{
            localStorage.setItem("token",data.token);
            return res.ok;
        }
        }catch(e){
            alert("Error occered in refresh token!!");
        }
}



function Dashboard(){
    const [name,setName]= useState("");
    const navigate = useNavigate();
    const handelclick  = async()=>{
       try{
        const res = await fetch("http://localhost:8080/api/user/adminPanel",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${localStorage.getItem("token")}`
            }
        });
        if(!res.ok){
            const res = await callfornewToken();
            if(res){
                navigate('/adminPanel');
            }
        }else{
            navigate('/adminPanel');
        }
       }catch(e){
        alert("Please login as admin!!");
       }
    }

    const handelSubmit = async(e)=>{
        e.preventDefault();
        try{
            alert(name);
            const updateName = async()=>{
                const res = await fetch('http://localhost:8080/api/user/dashboard',{
                    method : "PATCH",
                    headers : {
                        "Content-Type":"application/json",
                        "authorization":`Bearer ${localStorage.getItem("token")}`
                    },
                    body : JSON.stringify({name:name}),
                });
                alert("....... updating name");
                return res
            }
            const res = await updateName();
            if(!res.ok){
                const res = await callfornewToken();
                if(res){
                   const res = await updateName();
                   if(res.ok){
                    alert("Name updated Successfully!! After regenaration of token!!");
                   }
                }
            }else{
                alert("Name updated Successfully!!");
            }
        }catch(e){
            alert("Error in updating name",e);
        }
    }


    return(
        <>
        <div className="bg-blue-500 h-15 text-4xl mb-10 pl-10">Dashboard</div>
        <button className="bg-blue-500 rounded-xl p-2" onClick={handelclick}>Switch mode</button>
        <form onSubmit={handelSubmit}>
            <input type="text" placeholder='Enter your name....' className='border p-2' onChange={(e)=>setName(e.target.value)} />
            <button type='submit' className='p-2 bg-blue-500 text-white'>Change my name</button>
        </form>
        </>
    )
}


export default Dashboard;