const jwt = require('jsonwebtoken');


function createJwt(user,res){
    const token = jwt.sign(
    {userId : user._id , role : user.role},
    "abcd",
    {expiresIn : "10min"}
    )

    return res.status(200).json({message:"login successfuly!", token:token});
}

module.exports = {createJwt}