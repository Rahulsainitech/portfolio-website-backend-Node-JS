const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const Authenticate = async(req,res,next)=>{
    try {
        const token = req.cookies.jsonwebtoken;
        // console.log("my token is ",token)
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY)
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token})
        if (!rootUser){
            throw new Error("User not found")
        }
        else{
            req.token = token;
            req.rootUser = rootUser;
            req.userID = rootUser._id;
            next();
        }
    } catch (error) {
        res.status(401).send('Unauthorized :No token provide')
        console.log(error)
    }
}
module.exports = Authenticate;