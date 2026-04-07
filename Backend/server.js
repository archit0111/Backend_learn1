const express = require('express');
const cors = require('cors');
const joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const {verifyUser} = require('./Middelwares/authentication');
const {createJwt} = require('./Middelwares/jwtCreation');

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
    password:String,
    role : {type : String, default : "user"}
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
        createJwt(newUser,res);
        // console.log(newUser);
    }catch(e){
        return res.end(JSON.stringify({message:"Error occured in creating user: "+e})) 
    }
})


app.post('/login', async(req,res)=>{
    console.log("Frontend Talking to backend.... in login",req.body);
    try{
        let user = await User.findOne({email : req.body.email});
        console.log(user);
        if(!user){
            return res.status(400).json({message:"No user exist!!"});
        }
        let passwordCheck = await bcrypt.compare(req.body.password,user.password);
        if(passwordCheck){
            console.log("Successfully logged in!!");
            createJwt(user,res);
        }
    }catch(e){
        return res.status(400).json({message:"something went wrong!!"});
    }
    return res.status(400).json({message:"Password mismathed!! please try again!"});
})


// app.get('/Dasboard', verifyUser, async (req, res)=>{
//     console.log("Dashboard after jwt verification...");
// })


app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port: ${process.env.PORT}`);
})
