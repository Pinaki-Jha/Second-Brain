const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("./models/user.model")
const Directory = require("./models/directory.model")
const File = require("./models/file.model")
const Notification = require("./models/notification.model")
const bcrypt = require("bcryptjs")
require("dotenv").config();



const app = express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

mongoose.connect(process.env.MONGODB_URI)

//LOGIN AND REGISTRATION
app.post('/api/check-username', async(req,res)=>{
  console.log("checking username availability")
  try{
    const {username} = req.body;
    const userExists = await User.findOne({ username });

    res.json({ available: !userExists });
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ message: "Error checking username availability" });
  }
  
})

app.post('/api/register', async (req,res)=>{
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
        console.log(err)
        return res.json({status:"error", message: "A user with that Email or username already exists", color:"text-red-500"})
    }
    
})


app.post('/api/login', async (req, res) =>{
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
    console.log(err);
    return res.json({status:"error", user:false, message:"Unexpected Error. Please Try again."})
}
})

// GET CONTENTS OF THE FILE
app.get('/api/filecontent/:username/:path',async(req,res)=>{
  console.log("file content requested")
  const {username, path} = req.params;
  const fullPath = path + (req.params[0] || '');

  try {
    // Find the user
     console.log(username)

    const user = await User.findOne({username: username });
    if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}
  console.log("user found")
    
    const parentDirId = fullPath.split('-file:')[0]
    const fileID = fullPath.split('-file:')[1]
    
    let currentDirectory = await Directory.findById(parentDirId);
    let currentFile = await File.findById(fileID);

    if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}

    console.log("File found")

       //console.log(currentFile)


        //console.log(req.body.content[0].children)
        console.log("file sent")
          
        return res.json({status:200,content:currentFile.content, message:"File sent"});



  }catch(err){
    console.log(err);
    return res.json({status:500,message:"Failed to send file"});
  }

  
})

/*
app.get('/api/filecontent/:username/:path',async(req,res)=>{
  //console.log("yay");

  const { username, path } = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
      //console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}

  
      // Split the path and find the directory
      const pathParts = fullPath.split('-'); 
      let lastPart = pathParts[pathParts.length - 1];
      //console.log(lastPart)

      let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    
      //don't wanna get the directory if it has been deleted. Add checks for that later.
      for (let i=1;i<pathParts.length - 1;i++) {
        part = pathParts[i]
        currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
      }

        lastPart = lastPart.replace('file:', '');
        
        let currentFile = await File.findOne({name:lastPart, parent:currentDirectory._id, owner:user._id});
        if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}


       //console.log(currentFile)


        //console.log(req.body.content[0].children)
        console.log("file sent")
          
        return res.json({status:200,content:currentFile.content, message:"File sent"});

        
      
    }catch(err)
    {console.log(err);
    return res.json({status:500,message:"Failed to send file"})};
    

  

})
*/
app.patch('/api/filecontent/:username/:path',async(req,res)=>{

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
        console.log(currentFile.content[0].children)
        
        
        await currentFile.save()

        //console.log(req.body.content[0].children)
        console.log("file saved")
          
        return res.json({status:200,message:"File saved"});

  }catch(err){
    console.log(err);
    return res.json({status:500,message:"Failed to send file"});
  }

})
/*
app.patch('/api/filecontent/:username/:path',async(req,res)=>{
  //console.log("yay");

  const { username, path } = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
      //console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}

  
      // Split the path and find the directory
      const pathParts = fullPath.split('-'); 
      let lastPart = pathParts[pathParts.length - 1];
     // console.log(lastPart)

      let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    
      //don't wanna get the directory if it has been deleted. Add checks for that later.
      for (let i=1;i<pathParts.length - 1;i++) {
        part = pathParts[i]
        currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
      }

        lastPart = lastPart.replace('file:', '');
        
        let currentFile = await File.findOne({name:lastPart, parent:currentDirectory._id, owner:user._id});
        if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}

       //console.log(currentFile)

        currentFile.content = req.body.content;
        console.log(currentFile.content[0].children)
        
        
        await currentFile.save()

        //console.log(req.body.content[0].children)
        console.log("file saved")
          
        return res.json({status:200,message:"File saved"});

        
      
    }catch(err)
    {console.log(err)}
    

  

})
    */

app.get('/api/homeinfo/:username', async(req,res)=>{
  const {username} = req.params;
  try{
    console.log(username)
    const user = await User.findOne({username:username});
    if (!user){
      console.log("user not found behen");
      return res.json({status:404,user:{},root:{},message:"User not found"})}
    console.log("user found")

    const rootDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    console.log("directory found");
    return res.json({status:200,user:user,root:rootDirectory,message:"Success"})
  }catch(err){
    console.log(err.message);
    res.json({status:500, user:{}, root:{},message:err.message});
  }
})

//FILE OR DIRECTORY CREATION - FUNCTIONAL 
app.post('/api/:username/:path',async(req,res)=>{
  const {username, path} = req.params;
  const fullPath = path + (req.params[0] || '');

  try {
    // Find the user
//      console.log(username)
    const user = await User.findOne({username: username });
    if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}
    
    console.log("user found")

    const parentDirId = fullPath.split('-file:')[0]
    let currentDirectory = await Directory.findById(parentDirId);
    console.log("parent directory found")
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
/*
app.post('/api/:username/:path',async(req,res)=>{

    const { username,path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
//      console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}

  
      // Split the path and find the directory
      const pathParts = fullPath.split('-'); 
 //     console.log(pathParts)
      if(pathParts[pathParts.length -1].startsWith("file:")){
        pathParts.pop()
      }
      let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    
      //don't wanna get the directory if it has been deleted. Add checks for that later.
      for (let i=1;i<pathParts.length;i++) {
        part = pathParts[i]
        currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
      }

   //   console.log(currentDirectory.name);
    //  console.log(req.body);
      if(req.body.type=="file"){
        const newFile = new File({
          name:req.body.name,
          content:req.body.content,
          parent:currentDirectory._id,
          owner: user._id
        })

        await newFile.save();

        currentDirectory.files.push(req.body.name);

        await currentDirectory.save();

        res.json({status:200,message:"file created"})
      }
      else if(req.body.type=="directory"){

        const newDir = new Directory({
          name:req.body.name,
          parent:currentDirectory._id,
          owner: user._id
        })

        await newDir.save();

        currentDirectory.directories.push(req.body.name);

        await currentDirectory.save();
        res.json({status:200,message:"directory created"})

      }

    
    }catch (err) {
        console.log(err);
      res.json({status:500, directory:{},message:err.message});
    }
  

})
*/

//FILE OR DIRECTORY DELETION
app.delete('/api/:username/:path',async(req,res)=>{
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
/*app.delete('/api/:username/:path',async(req,res)=>{

    const { username,path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
     // console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}

  
      // Split the path and find the directory
      const pathParts = fullPath.split('-'); 
      //console.log(pathParts)
      if(pathParts[pathParts.length-1].startsWith("file:")){
        pathParts.pop()
      }
      let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    
      //don't wanna get the directory if it has been deleted. Add checks for that later.
      for (let i=1;i<pathParts.length;i++) {
        part = pathParts[i]
        currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
      }

      if(req.body.type==="file"){
        const fileToDelete = await File.findOne({name:req.body.name,parent:currentDirectory._id,owner:user._id})
        fileToDelete.deleted = new Date();
        currentDirectory.files = currentDirectory.files.filter(file => file != req.body.name);
        await currentDirectory.save();
        await fileToDelete.save();
        //console.log("done!")
      }
      else if(req.body.type==="directory"){
        const dirToDelete = await Directory.findOne({name:req.body.name,parent:currentDirectory._id,owner:user._id})
        dirToDelete.deleted = new Date();
        currentDirectory.directories = currentDirectory.directories.filter(directory => directory != req.body.name);
        await currentDirectory.save();
        await dirToDelete.save();
      //  console.log("done")
      }

      return res.json({status:200, message:"deletion successful"})

    }catch(err){

      console.log(err)
      return res.json({status:500, message:err.message})
    }

    

})*/

//FILE OR DIRECTORY FETCHING - FUNCTIONAL
app.get('/api/:username/:path*', async (req, res) => {
  const {username, path} = req.params;
  const fullPath = path + (req.params[0] || '');
  //console.log("path:" || path);
  //console.log(",username:" || username);
  try {
    // Find the user
//      console.log(username)
    const user = await User.findOne({username: username });
    if (!user){
      console.log("user not found bhai", username)
      return res.json({status:404,directory:{}, message:"User not Found"})}

    console.log("user found", user._id);
    let fullPathList = fullPath.split('-file:')
    let lastPart = fullPathList.pop();
    
    if(fullPath.includes('-file:')){
      //file logic here
      console.log("type is file")
      let currentFile = await File.findById(lastPart);
      let currentDirectory = await Directory.findById(fullPathList[0])
      console.log("file and directory found")

      //get owner name 
      let fileOwner = await User.findById(currentDirectory.owner);
      
      //accessibility check
      let userAccessIDs = currentDirectory.access.map(accessobj=>accessobj.user)
      if(currentDirectory.owner.equals(user._id) || userAccessIDs.includes(user._id)){
      if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}
      return res.json({status:200,directory:currentDirectory,owner:fileOwner, file:currentFile,type:"file",message:"File sent"});
      }else{
        return res.json({status:403, directory:{},owner:{},file:{}, type:"file", message:"no access"})

      }
    }else{
      //directory logic here
      console.log("type is directory:",lastPart)
      let currentDirectory = await Directory.findById(lastPart);
      if (!currentDirectory){
        console.log("directory not found")
        return res.json({ status:404, directory:{},message: 'Directory not found' })};
      console.log("directory found ", lastPart)

      //get owner name 
      let dirOwner = await User.findById(currentDirectory.owner);
      
      //accessibility check
      let userAccessIDs = currentDirectory.access.map(accessobj=>accessobj.user)
      if(currentDirectory.owner.equals(user._id) || userAccessIDs.includes(user._id)){
      return res.json({status:200,directory:currentDirectory,owner:dirOwner, type:"directory",message:"Directory sent"});
      }else{
        return res.json({status:403, directory:{},owner:{}, type:"directory", message:"no access"})
      }
    }
    
  }catch(err){
    console.log(err.message);
    res.json({status:500, directory:{},message:err.message});
  }
})

/*app.get('/api/:username/:path*', async (req, res) => {
  const { username, path } = req.params;
  const fullPath = path + (req.params[0] || '');

  try {
    // Find the user
    //console.log(username)
    const user = await User.findOne({username: username });
    if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}


    // Split the path and find the directory
    const pathParts = fullPath.split('-'); 
    let lastPart = pathParts[pathParts.length - 1];
    //console.log(lastPart)

    let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
  
    //don't wanna get the directory if it has been deleted. Add checks for that later.
    for (let i=1;i<pathParts.length - 1;i++) {
      part = pathParts[i]
      currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
      if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
    }

    if(pathParts.length>1){
      if(lastPart.startsWith('file:')){
       // console.log("is a file")
        lastPart = lastPart.replace('file:', '');
        let currentFile = await File.findOne({name:lastPart, parent:currentDirectory._id, owner:user._id});
        if(!currentFile){return res.json({status:404,directory:{},file:{},message:'File not found'})}
        return res.json({status:200,directory:currentDirectory, file:currentFile,type:"file",message:"File sent"});

      }
      else{
        currentDirectory = await Directory.findOne({ name: lastPart, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
        return res.json({status:200,directory:currentDirectory,type:"directory",message:"Directory sent"});

    }
  }

  return res.json({status:200,directory:currentDirectory,type:"directory",message:"Directory sent"});



  } catch (err) {
      console.log(err);
      res.json({status:500, directory:{},message:err.message});
  }
});
*/



app.use('*',  (req, res) => {
    res.sendFile((__dirname+ '/dist/index.html'));
});
    



app.listen(process.env.PORT || 3000, ()=>{
    console.log("server started on port 3000")
})



//679d9f5eeac388a35086bce3-file:679d9f82eac388a35086bcf9