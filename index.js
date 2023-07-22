const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors')
const cookieparser = require('cookie-parser');
const app =express();
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
// 2 add dynmic port
const Port =  process.env.PORT || 5000;
require('./db/conn')
app.use(cors())
app.use(cookieparser());
app.use(express.json())
// adding router 
app.use(require('./router/auth'))
// 3 step Heroku App
if(process.env.NODE_ENV == 'production'){
    app.use(express.static("client/build"))
    const path = require("path");
    app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
} 



app.listen(Port,()=>{
    console.log(`I am listening bro on ${Port}`)
})