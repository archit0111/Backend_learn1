const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.DATABASE)
.then(()=>console.log("MongoDB connected successfuly"))
.catch(()=>console.log("Error occored in connecting to database"));


const userRoutes = require('./Routes/userRoutes');

app.use('/api/user',userRoutes);



app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port: ${process.env.PORT}`);
})
