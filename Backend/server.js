const express = require('express');
const cors = require('cors');
const joi = require('joi');
const port = 8080;

const app = express();
app.use(cors());
app.use(express.json());

//joi working

const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required()
})

app.post('/Signup',(req,res)=>{
    console.log("Frontend Talking to backend....",req.body);
    const joiRes = schema.validate(req.body);
    if(joiRes.error){
        return res.status(400).json(joiRes.error.details[0].message);
    }
    res.status(200).json({messsage:"Data Recived Succssesfuly...."});
})
app.listen(port,()=>{
    console.log(`Server is listening on port: ${port}`);
})
