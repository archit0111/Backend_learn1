import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

function Dashboard(){
    const [name,setName]= useState("");
    const navigate = useNavigate();
    const handelclick  = async()=>{
       try{
        const res = await fetch("http://localhost:8080/adminPanel",{
            method:"GET",
            headers:{
                "Content-Type":"aplication/json",
                "authorization":`Bearer ${localStorage.token}`
            }
        });
        if(res.status == 403){
            try{
                const res = await fetch("http://localhost:8080/refreshToken",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "refreshToken":`${localStorage.refreshToken}`
                    }
                })
                if(res.ok){
                    navigate('/adminPanel');
                }
            }catch(e){
                alert("Session expired, Login again!");
            }
        }
        if(res.ok){
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
            const res = await fetch('http://localhost:8080/dashboard',{
                method : "PATCH",
                headers : {
                    "Content-Type":"application/json",
                    "authorization":`Bearer ${localStorage.token}`
                },
                body : JSON.stringify({name:name}),
            });
        }catch(e){
            alert("Error in updating name");
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