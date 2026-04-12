const jwt = require('jsonwebtoken');


function createJwt(user,res){
    const token = jwt.sign(
    {userId : user._id , role : user.role},
    "abcd",
    {expiresIn : "1min"}
    )
    const refreshToken = jwt.sign(
        {userId:user._id},
        "RefreshSecret",
        {expiresIn:"7d"}
    )
    user.refreshToken = refreshToken;
    user.save();
    return res.status(200).json({message:"login successfuly!", token:token, refreshToken:refreshToken});
}

module.exports = {createJwt}