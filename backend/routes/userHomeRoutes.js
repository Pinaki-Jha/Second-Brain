const express = require('express')

const router = express.Router();

const User = require("../models/user.model")
const Directory = require("../models/directory.model")


router.get('/homeinfo/:username', async(req,res)=>{
    const {username} = req.params;
    try{
      //console.log(username)
      const user = await User.findOne({username:username});
      if (!user){
        //console.log("user not found behen");
        return res.json({status:404,user:{},root:{},message:"User not found"})}
      //console.log("user found")
  
      const rootDirectory = await Directory.findOne({ name: 'root', owner: user._id });
      //console.log("directory found");
      return res.json({status:200,user:user,root:rootDirectory,message:"Success"})
    }catch(err){
      //console.log(err.message);
      res.json({status:500, user:{}, root:{},message:err.message});
    }
  })
  

module.exports = router;