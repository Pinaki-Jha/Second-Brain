const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require("../models/user.model")

const check_username_post = async(req,res)=>{
    //console.log("checking username availability")
    try{
      const {username} = req.body;
      const userExists = await User.findOne({ username });
  
      res.json({ available: !userExists });
    } catch (error) {
      console.error("Error checking username availability:", error);
      res.status(500).json({ message: "Error checking username availability" });
    }
    
}
const register_post = async (req,res)=>{
    try{        
        const newPassword = await bcrypt.hash(req.body.password,10)
        await User.create({
            username : req.body.username,
            email : req.body.email,
            password : newPassword,
        })
         

        const user = await User.findOne({email: req.body.email})
        
        const rootDirectory = new Directory({
            name: 'root',
            owner: user._id,
            directories: [],
            files: [],
          });
      
          await rootDirectory.save();


//        console.log(req.body)
        return res.json({status:"ok", message:"Registration Successful. Please Log In.", color:"text-blue-500"})
    }catch(err){
       // console.log(err)
        return res.json({status:"error", message: "A user with that Email or username already exists", color:"text-red-500"})
    }
    
}
const login_post = async (req, res) =>{
    try{
    const user = await User.findOne({email: req.body.email})
    if(!user){return res.json({status:"not ok",user:false,message:"No user with that email registered"})}
    const isPassValid = await bcrypt.compare(req.body.password, user.password)

    if(isPassValid){
        const token = jwt.sign({
            id: user._id,
            username : user.username,
            email : user.email,
        }, "secret123", {expiresIn:'1d'})

        return res.json({status:"ok", user:token, message:"login successful"})
    }
    else{
        return res.json({status:"not ok",user:false, message: "Please check your password."})
    }
}catch(err){
    //console.log(err);
    return res.json({status:"error", user:false, message:"Unexpected Error. Please Try again."})
}
}

module.exports = {
    check_username_post,
    register_post,
    login_post    
}