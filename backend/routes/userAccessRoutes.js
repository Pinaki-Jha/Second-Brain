const express = require('express')

const router = express.Router();

const User = require("../models/user.model")
const Directory = require("../models/directory.model")
const File = require("../models/file.model")
const Notification = require("../models/notification.model")


//REQUESTING ACCESS FROM OWNER
router.post('/reqacc/:username/:path', async(req,res)=>{
    //console.log("sending access request")
  
    const {username, path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try{
  
      //find the user
      const user = await User.findOne({username:username});
      if (!user){
        return res.json({status:404,user:{},root:{},message:"User not found"})
      }
      //find the current directory and its owner
      let fullPathList = fullPath.split('-file:')
      let currentDirectory = await Directory.findById(fullPathList[0])
  
      const newNotification = new Notification(
        {
          recipient: currentDirectory.owner,
          sender: {id:user._id, name:user.username},
          directory:currentDirectory,
          //file: currentFile,
          sent_date: Date(),
          type:"REQACC",
        }
      );
  
      await newNotification.save();
  
      //console.log("access requested")
  
      return res.json({status:200})
    }catch(err){
      //console.log(err.message)
      return res.json({status:500, message:err.message})
    }
  })
  
//ACCESS GRANTED BY OWNER
router.patch('/reqacc/:username/:path',async(req,res)=>{
    //username of owner
    //path is the id of the notification
    //user id to whom access is to be granted and directory id needed in the header
    //console.log("granting access")
    const {username, path} = req.params;
    try{
  
      const user = await User.findOne({username:username});
      const notification = await Notification.findById(path);
      //console.log("user and notifications found")
      //console.log(user._id)
      //console.log(notification.recipient)
      //console.log(notification.type.toUpperCase())
      if (user._id.equals(notification.recipient) && notification.type.toUpperCase()=='REQACC'){
        //console.log("everything ok here")
        const directory = await Directory.findById(notification.directory);
        //console.log(directory.owner)
        //console.log(user._id)
        if(directory.owner.equals(user._id)){
          //console.log("alright, getting here")
        //directory.access.push({user:notification.sender.id,type:'RW'});
        //await directory.save();
        await Directory.findByIdAndUpdate(
          notification.directory,
          { $addToSet: { access:{user:notification.sender.id,type:"RW" }} },  // `$addToSet` prevents duplicates
          { new: true } // Return the updated document
      );
  
        await Notification.findByIdAndDelete(path);
        //console.log("access granted")
        return res.json({status:200, message:"Access Granted"})
        }
      }
      
      return res.json({status:404, message:"Not Permitted"})
  
  
    }catch(err){
      //console.log(err.message);
      return res.json({status:500, message:err.message})
    }
  
  
})
    
  
//FILE OR DIRECTORY ACCESS CHECK - TO REDIRECT FROM NOACCESS PAGE
router.get('/:username/:path',async(req,res)=>{
    const {username, path} = req.params;
    const fullPath = path + (req.params[0] || '');
    
    try {
      // Find the user
  //      console.log(username)
      const user = await User.findOne({username: username });
      if (!user){
        //console.log("user not found bhai", username)
        return res.json({status:404,directory:{}, message:"User not Found"})}
  
        //console.log("user found", user._id);
        let fullPathList = fullPath.split('-file:')
        let dirID = fullPathList[0];
        
        const currentDirectory = await Directory.findById(dirID);
  
        const userAccessIDs = currentDirectory.access.map(accessobj=>accessobj.user.toString());
  
        if(currentDirectory.owner.equals(user._id) || userAccessIDs.includes(user._id.toString())){
          return res.json({status:200,access:true,message:"user has access to resource"})
        }
        return res.json({status:200,access:false,message:"user does not have access to resource"})
  
  
    }catch(err){
      //console.log(err.message);
      res.json({status:500, access:false, message:err.message})
      }
  
})
  
module.exports = router;
