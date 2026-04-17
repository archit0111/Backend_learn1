const { createJwt } = require("../Middelwares/jwtCreation");
const {schema}= require('../Utils/validation');
const bcrypt = require('bcrypt')
const User = require("../Model/User");
const jwt = require('jsonwebtoken');
const {generateNewToken} = require('../Middelwares/authentication');
const {OAuth2Client} = require('google-auth-library');
const {sendWelcomeMail} = require('../Controller/emailControler');


exports.signup =  async (req,res)=>{
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
};

exports.login = async(req,res)=>{
    console.log("Frontend Talking to backend.... in login",req.body);
    try{
        let user = await User.findOne({email : req.body.email});
        if(!user){
            console.log("Frontend Talking to");
            return res.status(400).json({message:"No user exist!!"});
        }
        let passwordCheck = await bcrypt.compare(req.body.password,user.password);
        if(passwordCheck){
            console.log("Successfully logged in!!");
            createJwt(user,res);
        }else{
            return res.status(401).json({message:"Wrong password! please try again"});
        }
    }catch(e){
        return res.status(400).json({message:"something went wrong!!"});
    }
};


exports.dashboard = async (req, res)=>{
    console.log("Dashboard after jwt verification...");
    try{
        const nameSchema = schema.extract('name');
        const joiRes = nameSchema.validate(req.body.name);
        if(joiRes.error){
            return res.status(401).json({message:`${joiRes.error}`});
        }
        const updatedName = req.body.name;
        console.log(updatedName);
        const updatedUser = await User.findByIdAndUpdate(req.user.userId,
        {name:updatedName},
        {returnDocument:'after'}
    );  
    return res.status(200).json({message:"Name changed successfully!!",user:updatedUser});
    }catch(e){
        console.log(e);
        return res.status(500).json({message:"Error occoured in updating name"});
    }
};



exports.adminPanel = async(req,res)=>{
    res.status(200).json({message:"You have access of adminPanel"});
};

//for refreshToken verification

exports.refreshToken = async(req,res)=>{
    console.log("RefreshToken jwt verification...");
    const refreshToken = req.headers["refreshtoken"];
    if(!refreshToken){
        return res.status(403).json("Refresh token not provided");
    }
    try{
        const decodedData = await jwt.verify(refreshToken,"RefreshSecret");
        const user = await User.findById(decodedData.userId);
        if(!user||user.refreshToken !== refreshToken){
            return res.status(401).json({message:"Token Expired, Login again!!"});
        }
        const newToken = await generateNewToken(user);
        return  res.status(200).json({message:"Refresh token generated successfully!!", token:newToken});
    }catch(e){
        return res.status(403).json("Refresh Token Invalid!! or Expired!!");
    }
};

exports.googleLogin = async(req,res)=>{
    const credentials = req.body.token;
    if(!credentials){
        return res.status(401).json({message:"Google token not found!"});
    }
    try{
        const client = new OAuth2Client('272382616790-l9u3oismb1bhjhm1mq8649f4tper5d31.apps.googleusercontent.com');
        console.log("Google token verification!!");
        const ticket = await client.verifyIdToken({
            idToken : credentials,
            audience:'272382616790-l9u3oismb1bhjhm1mq8649f4tper5d31.apps.googleusercontent.com'
        });
        const{email,name} = ticket.getPayload();
        console.log("Google token verification!!",name,email);
        let user = await User.findOne({email:email});
        if(!user){
            const password = Math.random().toString(36).slice(-8)+"Aa1!";
            await sendWelcomeMail(name,email,password);
            let encryptedPassword = await bcrypt.hash(password, 12);
            user = {
                name: name,
                email:email,
                password : encryptedPassword,
                role:'user'
            };
            await User.create(user);
        }else{
            return res.status(201).json({message:"User exist already! Please login..."});
        }
        try{
            createJwt(user,res);
        }catch(e){
            return res.end(JSON.stringify({message:"Error Occred in creation!!"}))
        }

    }catch(e){
        console.error("Outer Catch Error:", e.message);
        res.status(401).json({message:"Invalid google token!!"});
    }
}