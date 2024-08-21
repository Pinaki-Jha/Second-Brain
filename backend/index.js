const express = require('express');
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("./models/user.model")
const Directory = require("./models/directory.model")
const File = require("./models/file.model")
const bcrypt = require("bcryptjs")
require("dotenv").config();



const app = express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

mongoose.connect(process.env.MONGODB_URI)



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


        console.log(req.body)
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


//to create a file or directory
app.post('/api/:username/:path',async(req,res)=>{

    const { username,path} = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
      console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}

  
      // Split the path and find the directory
      const pathParts = fullPath.split('-'); 
      console.log(pathParts)
      let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    
      //don't wanna get the directory if it has been deleted. Add checks for that later.
      for (let i=1;i<pathParts.length;i++) {
        part = pathParts[i]
        currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
      }

      console.log(currentDirectory.name);
      console.log(req.body);
      if(req.body.type=="file"){
        const newFile = new File({
          name:req.body.name,
          content:" ",
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

app.get('/api/:username/:path*', async (req, res) => {
    const { username, path } = req.params;
    const fullPath = path + (req.params[0] || '');
  
    try {
      // Find the user
      console.log(username)
      const user = await User.findOne({username: username });
      if (!user){return res.json({status:404,directory:{}, message:"User not Found"})}

  
      // Split the path and find the directory
      const pathParts = fullPath.split('-'); 
      let lastPart = pathParts[pathParts.length - 1];
      console.log(lastPart)

      let currentDirectory = await Directory.findOne({ name: 'root', owner: user._id });
    
      //don't wanna get the directory if it has been deleted. Add checks for that later.
      for (let i=1;i<pathParts.length - 1;i++) {
        part = pathParts[i]
        currentDirectory = await Directory.findOne({ name: part, parent: currentDirectory._id, owner: user._id });
        if (!currentDirectory) return res.json({ status:404, directory:{},message: 'Directory not found' });
      }

      if(pathParts.length>1){
        if(lastPart.startsWith('file:')){
          console.log("is a file")
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






app.use('*',  (req, res) => {
    res.sendFile((__dirname+ '/dist/index.html'));
});
    



app.listen(process.env.PORT || 3000, ()=>{
    console.log("server started on port 3000")
})