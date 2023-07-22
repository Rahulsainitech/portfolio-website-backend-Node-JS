const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const Authenticate = require('../middleware/authenticate')


// using try catch
// .post((req,res)=>{
// const {name,email,phone,work,password,cpassword}= req.body;
// if(!name || !email || !phone || !work || !password || !cpassword){
//     res.status(422).json({"error":"please filled the field properly"})
// }
// User.findOne({email:email})
// .then((UserExist)=>{
//     if(UserExist){
//         res.status(422).json({"error":"User Already exist"})
//     }
//     else{
//         const user = new User({name,email,phone,work,password,cpassword})
//     user.save().then(()=>{
//         res.status(201).json({"Message":"user registerd successfully"})
//     }).catch(()=>res.status(500).json({"error":"registred failed"}))
//     }

// }).catch((error)=>console.log(error))

// })

router.post("/register", async(req, res) => {

    const { name, email, password, cpassword } = req.body;
    console.log(name,email,password,cpassword)
    if (!name || !email || !password || !cpassword) {
        res.status(422).json({ "error": "please filled the field properly" })
    }
    
        try {
            const UserExist = await User.findOne({ email: email })
            if (UserExist) {
                res.status(423).json({ "error": "User Already exist" })
            } else if (password != cpassword) {
                res.status(424).json({ "error": "password is not matched" })
            }
            else {
                const user = new User({ name, email,password, cpassword })
                const data = await user.save()
                console.log(data)
                res.status(201).json({ "Message": "user registerd successfully" })
            }
        } catch (error) {
            console.log(error)
            res.json({ "error": error })
        
    }

})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("password and email is:",email, password)

        if (!email || !password) {
            res.status(400).json({ "error": "invalid login" })
        }
        const UserLogin = await User.findOne({ email: email })
        if (UserLogin) {
            const token = await UserLogin.generateAuthToken();
                console.log(token)
                res.cookie('jsonwebtoken', token, {
                    expires: new Date(Date.now() + 2500000)
                })
            const isMatch = await bcrypt.compare(password, UserLogin.password)
            if (isMatch) {
                res.status(201).json({ "message": "you are logged In" })
                
                // console.log("cookie value is",coookie)

            } else {
                res.status(400).json({ "error": "invalid creditionals" })
            }
        } else {
            res.status(400).json({ "error": "invalid creditionals" })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({"error":"Invalid creditionals"})
    }

})
router.get('/logout',(req,res)=>{
    res.clearCookie('jsonwebtoken',{path:'/'})
    res.status(201).send("logout successfully")
})
 router.get('/about',Authenticate,(req,res)=>{
     res.status(200).send(req.rootUser)
 })
 router.get('/getdata',Authenticate,(req,res)=>{
    res.status(200).send(req.rootUser)
})
router.get('/getalldata',async(req,res)=>{
    try {
        const data = await User.find()
        if (data){
            console.log(data)
            res.status(200).send(data)
        }
    } catch (error) {
        res.status(404).json({"error":error})        
    }
      
})

router.post('/contact',Authenticate,async(req,res)=>{
    try {
        const {name,email,message}= req.body;
        console.log(name,email,message)
        if( !email || !message){
            console.log("error in contact form")
            return res.status(400).json({error:"plzz fill all the field properly"})
        }
        const userContact = await  User.findOne({_id:req.userID})
        if (userContact){
            const userMessage = await userContact.addMessage(name,email,message)
            await userContact.save()
            res.status(201).json({message:"user contact successfully"})
        }
    } catch (error) {
       console.log(error) 
       res.status(400).json({error:"plzz fill all the field properly"})

    }
})
module.exports = router;