const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next)=>{
    const token = req.headers["authorization"];
    if(!token){
        return res.status(403).json({message:"Token not provided!!"});
    }
    try{
        const actualToken = token.split(" ")[1];
        const decodedData = jwt.verify(actualToken,"abcd");
    
        if(decodedData.role !== "admin"){
            return res.status(401).json({message:"Access denied! Admin access only!"});
        }
        req.user = decodedData;
        next();
    }catch(e){
        return res.status(401).json({message:"Invalid or expired token!!"})
    }
}

module.exports = {verifyUser}