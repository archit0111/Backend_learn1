const { createJwt } = require("../Middelwares/jwtCreation");
const {schema}= require('../Utils/validation');
const bcrypt = require('bcrypt')
const User = require("../Model/User");


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