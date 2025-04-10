const express = require('express')

const router = express.Router();
const User = require("../models/user.model")
const Notification = require("../models/notification.model")


//GET ALL NOTIFICATIONS FOR A USER
router.get('/:username',async(req,res)=>{
    //console.log("notifs requested")
    const { username } = req.params;
    //console.log(username);
    try{
      const user = await User.findOne({username:username})
      if(!user){
        //console.log("user not found")
        return res.json({status:404, user:{},notifications:[], message:"User not found"});
      }
      //console.log("user found")
  
      const userNotifs = await Notification.find({recipient:user._id});
      
      //console.log( "notifications found and sent")
      //console.log(userNotifs)
      return res.json({status:200,notifications:userNotifs, message:"Success"})
    }catch(err){
      //console.log(err.message)
      return res.json({status:500, message:err.message})
    }
  })
  
//NOTIFICATION DELETED
router.delete('/:username/:path',async(req,res)=>{
    //username of the owner (receiver of the notification)
    //path is the id of the notification
    const { username, path } = req.params;
    try{
      const user = await User.findOne({username:username});
      //console.log(path)
      const notification = await Notification.findByIdAndDelete(path);
  
      return res.json({status:200, message:"notification deleted successfully."})
  
    }catch(err){
      //console.log("error deleting the notification", err.message)
      return res.json({status:500, message:err.message})
  
    }
    
  })
  
module.exports = router;