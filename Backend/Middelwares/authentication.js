const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next)=>{
    const token = req.headers["authorization"];
    if(!token){
        return res.status(403).json({message:"Token not provided!!"});
    }
    try{
        const actualToken = token.split(" ")[1];
        const decodedData = jwt.verify(actualToken,"abcd");
        req.user = decodedData;
        console.log("Inside JWT checker and data is: ",decodedData);
        next();
    }catch(e){
        return res.status(401).json({message:"Invalid or expired token!!"})
    }
}

const verifyAdmin = async (req,res,next)=>{
    const token = req.headers["authorization"];
    if(!token){
        return res.status(403).json({message:"Token not provided!!"});
    }
    try{
        const actualToken = token.split(" ")[1];
        const decodedData = jwt.verify(actualToken,"abcd");
        req.user = decodedData;
        console.log(decodedData);
        console.log("Inside verify admin");
        console.log(req.user.role);
        if(req.user.role == "admin"){
            next();
        }else{
            return res.status(401).json({message:"Access denied. Login as admin to get access!!"})
        }
    }catch(e){
        return res.status(401).json({message:"Invalid or expired token!!"});
    }
}

module.exports = {verifyUser , verifyAdmin}