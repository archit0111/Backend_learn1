const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    refreshToken:String,
    role : {type : String, default : "user"}
})

const User = mongoose.model('user',dataSchema);

module.exports = User;