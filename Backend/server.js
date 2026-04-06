const express = require('express');
const cors = require('cors');
const joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//joi working

const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required()
})

//mongoose working

mongoose.connect(process.env.DATABASE)
.then(()=>console.log("MongoDB connected successfuly"))
.catch(()=>console.log("Error occored in connecting to database"));

const dataSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String  
})

const User = mongoose.model('user',dataSchema);



app.post('/Signup', async (req,res)=>{
    console.log("Frontend Talking to backend....",req.body);
    const joiRes = schema.validate(req.body);
    if(joiRes.error){
        return res.status(400).json({message : `${joiRes.error.details[0].message}`});
    }
    try{
        let encryptedPassword = await bcrypt.hash(req.body.password, 12);
        req.body.password = encryptedPassword;
        const newUser = await User.create(req.body);
        // console.log(newUser);
    }catch(e){
        return res.end(JSON.stringify({message:"Error occured in creating user: "+e})) 
    }
    res.status(200).json({message:"Data Recived Succssesfuly...."});
})



app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port: ${process.env.PORT}`);
})
