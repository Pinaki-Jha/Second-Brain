const sharp = require("sharp");

const User = require("../models/user.model")
const Directory = require("../models/directory.model")
const File = require("../models/file.model")


const upload_image_post = async(req,res)=>{
    try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }
  
      // ✅ Compress and convert image to Base64
      const compressedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800 }) // Resize to max width 800px
          .jpeg({ quality: 80 }) // Compress to 80% quality
          .toBuffer();
  
      const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
  
      // ✅ Return Base64-encoded image directly
      res.json({
          success: 1,
          file: { url: base64Image }
      });
  
  } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Server error" });
  }
  
  }

const filecontent_get =async(req,res)=>{
    console.log('hit filecontent get')
    //console.log("file content requested")
    const {username, path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
       //console.log(username)
  
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}
    //console.log("user found")
      
      const parentDirId = fullPath.split('-file:')[0]
      const fileID = fullPath.split('-file:')[1]
      
      let currentDirectory = await Directory.findById(parentDirId);
      let currentFile = await File.findById(fileID);
  
      if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}
  
      //console.log("File found")
  
         //console.log(currentFile)
  
  
          //console.log(req.body.content[0].children)
          //console.log("file sent")
            
          return res.json({status:200,content:currentFile.content, message:"File sent"});
  
  
  
    }catch(err){
      //console.log(err);
      return res.json({status:500,message:"Failed to send file"});
    }
  
    
  }

const filecontent_patch = async(req,res)=>{
  
    const {username, path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
  //      console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}
      
      const parentDirId = fullPath.split('-file:')[0]
      const fileID = fullPath.split('-file:')[1]
      
      let currentDirectory = await Directory.findById(parentDirId);
      let currentFile = await File.findById(fileID);
  
      if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}
  
         //console.log(currentFile)
  
          currentFile.content = req.body.content;
          //console.log(currentFile.content[0].children)
          
          
          await currentFile.save()
  
          //console.log(req.body.content[0].children)
          //console.log("file saved")
            
          return res.json({status:200,message:"File saved"});
  
    }catch(err){
      //console.log(err);
      return res.json({status:500,message:"Failed to send file"});
    }
  
  }


module.exports ={
    upload_image_post,
    filecontent_get,
    filecontent_patch
}