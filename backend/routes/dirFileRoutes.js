const express = require('express')

const router = express.Router();

const User = require("../models/user.model")
const Directory = require("../models/directory.model")
const File = require("../models/file.model")




//FILE OR DIRECTORY CREATION - FUNCTIONAL 
router.post('/:username/:path',async(req,res)=>{
    const {username, path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
  //      console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}
      
      //console.log("user found")
  
      const parentDirId = fullPath.split('-file:')[0]
      let currentDirectory = await Directory.findById(parentDirId);
      //console.log("parent directory found")
      //console.log(req.body)
      
      if(req.body.type=="file"){
        const newFile = new File({
          name:req.body.name,
          content:req.body.content,
          parent:currentDirectory._id,
          owner: user._id
        })
  
        await newFile.save();
        console.log("file created and saved")
  
        const theNewFile = await File.findOne({name:req.body.name, parent:currentDirectory._id, owner:user._id});
        console.log("file found")
  
        currentDirectory.files.push({id: theNewFile._id, name: theNewFile.name});
        await currentDirectory.save();
        console.log("file added to parent")
  
        res.json({status:200,message:"file created"})
      }
      else if(req.body.type=="directory"){
  
        const newDir = new Directory({
          name:req.body.name,
          parent:currentDirectory._id,
          owner: user._id
        })
  
        await newDir.save();
        console.log("directory created and saved")
  
        const theNewDir = await Directory.findOne({ name:req.body.name, parent: currentDirectory._id, owner: user._id })
        console.log("directory found")
        
        console.log(theNewDir)
        currentDirectory.directories.push({id: theNewDir._id, name:theNewDir.name});
        console.log("directory added to parent")
  
  
        await currentDirectory.save();
        res.json({status:200,message:"directory created"})
      }
  
  
    
    }catch(err){
      console.log(err);
    }
  
  })
  
//FILE OR DIRECTORY DELETION 
router.delete('/:username/:path',async(req,res)=>{
  const {username, path} = req.params;
  const fullPath = path + (req.params[0] || '');

  try {
    // Find the user
//      console.log(username)
    const user = await User.findOne({username: username });
    if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}
    
    const parentDirId = fullPath.split('-file:')[0]

    let currentDirectory = await Directory.findById(parentDirId);


    if(req.body.type==="file"){
      const fileToDelete = await File.findById(req.body.idToDelete)
      //const fileToDelete = await File.findOne({name:req.body.name,parent:currentDirectory._id,owner:user._id})
      fileToDelete.deleted = new Date();
      currentDirectory.files = currentDirectory.files.filter(file => file.id != req.body.idToDelete);
      await currentDirectory.save();
      await fileToDelete.save();
      //console.log("done!")
    }
    else if(req.body.type==="directory"){
      const dirToDelete = await Directory.findById(req.body.idToDelete)
      //const dirToDelete = await Directory.findOne({name:req.body.name,parent:currentDirectory._id,owner:user._id})
      dirToDelete.deleted = new Date();
      currentDirectory.directories = currentDirectory.directories.filter(directory => directory.id != req.body.idToDelete);
      await currentDirectory.save();
      await dirToDelete.save();
    //  console.log("done")
    }

    return res.json({status:200, message:"deletion successful"})

  }catch(err){
    console.log(err);
    return res.json({status:500, message:err.message})
  }

})

//FILE OR DIRECTORY FETCHING - FUNCTIONAL
router.get('/:username/:path*', async (req, res) => {
  const {username, path} = req.params;
  const fullPath = path + (req.params[0] || '');
  //console.log("path:" || path);
  //console.log(",username:" || username);
  try {
    // Find the user
//      console.log(username)
    const user = await User.findOne({username: username });
    if (!user){
      //console.log("user not found bhai", username)
      return res.json({status:404,directory:{}, message:"User not Found"})}

    //console.log("user found", user._id);
    let fullPathList = fullPath.split('-file:')
    let lastPart = fullPathList.pop();
    
    if(fullPath.includes('-file:')){
      //file logic here
      //console.log("type is file")
      let currentFile = await File.findById(lastPart);
      let currentDirectory = await Directory.findById(fullPathList[0])
      //console.log("file and directory found")

      //get owner name 
      let fileOwner = await User.findById(currentDirectory.owner);
      
      //accessibility check
      let userAccessIDs = currentDirectory.access.map(accessobj=>accessobj.user.toString())
      //console.log(userAccessIDs)
      //console.log(user.username)
      if(currentDirectory.owner.equals(user._id) || userAccessIDs.includes(user._id.toString())){
      if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}
      return res.json({status:200,directory:currentDirectory,owner:fileOwner, file:currentFile,type:"file",message:"File sent"});
      }else{
        return res.json({status:403, directory:{},owner:{},file:{}, type:"file", message:"no access"})

      }
    }else{
      //directory logic here
      //console.log("type is directory:",lastPart)
      let currentDirectory = await Directory.findById(lastPart);
      if (!currentDirectory){
        //console.log("directory not found")
        return res.json({ status:404, directory:{},message: 'Directory not found' })};
      //console.log("directory found ", lastPart)

      //get owner name 
      let dirOwner = await User.findById(currentDirectory.owner);
      
      //accessibility check
      let userAccessIDs = currentDirectory.access.map(accessobj=>accessobj.user.toString())
      //console.log(userAccessIDs)
      //console.log(user.username)
      if(currentDirectory.owner.equals(user._id) || userAccessIDs.includes(user._id.toString())){
      return res.json({status:200,directory:currentDirectory,owner:dirOwner, type:"directory",message:"Directory sent"});
      }else{
        return res.json({status:403, directory:{},owner:{}, type:"directory", message:"no access"})
      }
    }
    
  }catch(err){
    //console.log(err.message);
    res.json({status:500, directory:{},message:err.message});
  }
})




module.exports = router;
