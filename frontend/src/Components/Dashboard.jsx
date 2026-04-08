import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

function Dashboard(){
    const [name,setName]= useState();
    const navigate = useNavigate();
    function handelclick(){
        navigate('/adminPanal');
    }

    const handelSubmit = async(e)=>{
        e.preventDefault();
        try{
            console.log("Starting verification!!!!!!");
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
            <input type="text" placeholder='Enter your name....' className='border p-2' onChange={(e)=>setName(e.value)} />
            <button type='submit' className='p-2 bg-blue-500 text-white'>Change my name</button>
        </form>
        </>
    )
}


export default Dashboard;