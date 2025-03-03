const express = require('express');
const { Server } = require("socket.io");
const http = require("http")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("./models/user.model")
const Directory = require("./models/directory.model")
const File = require("./models/file.model")
const Notification = require("./models/notification.model")
const bcrypt = require("bcryptjs")
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");




const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "http://localhost:5173",
    methods:["GET","POST","PATCH","DELETE"]
  }
});

io.on("connection", (socket) => {
  //--console.log("A user connected:", socket.id);

  const fileContents = {}; // ✅ Stores latest file contents in-memory (Temporary fix)

// When a user joins a file, send the latest content
socket.on("joinFile", (fileId) => {
    socket.join(fileId);
    //--console.log(`User ${socket.id} joined file: ${fileId}`);

    if (fileContents[fileId]) {
        socket.emit("updateFile", fileContents[fileId]); // ✅ Send latest content
    }
});

// When a user updates a file, store it and broadcast it
socket.on("fileUpdate", ({ fileId, diffs }) => {
    //--console.log(`File ${fileId} updated. Broadcasting new content.`);
    
    fileContents[fileId] = diffs; // ✅ Store latest content

    //--console.log(diffs)

    // Send the updated content to all users in the same file (except sender)
    socket.to(fileId).emit("updateFile", diffs);
});
  socket.on("disconnect", () => {
      //--console.log("User disconnected:", socket.id);
  });
});



//middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// ✅ Serve uploaded images

mongoose.connect(process.env.MONGODB_URI)

//LOGIN AND REGISTRATION
app.post('/api/check-username', async(req,res)=>{
  //console.log("checking username availability")
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
       // console.log(err)
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
    //console.log(err);
    return res.json({status:"error", user:false, message:"Unexpected Error. Please Try again."})
}
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  console.log("trying to upload file");
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      // ✅ Compress and save image
      console.log("uploading file...")
      const compressedBuffer = await sharp(req.file.buffer)
          .resize({ width: 800 }) // Resize to max width 800px
          .jpeg({ quality: 80 }) // Compress to 80% quality
          .toBuffer();

      const fileName = `compressed_${Date.now()}.jpeg`;
      const filePath = path.join(__dirname, "../backend/uploads", fileName);
      fs.writeFileSync(filePath, compressedBuffer);

      // ✅ Return the image URL
      console.log("image upload successful");
      res.json({
        success: 1, 
        file: {
            url: `http://localhost:3000/uploads/${fileName}` // ✅ Full URL required
        }
    });
  } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/delete-image", async (req, res) => {
  try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "No URL provided" });

      // ✅ Extract filename from the URL
      const fileName = path.basename(url);
      const filePath = path.join(__dirname, "../backend/uploads", fileName);

      // ✅ Check if file exists before deleting
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // ✅ Delete the file
          console.log("✅ Deleted image:", filePath);
          return res.json({ success: true, message: "Image deleted successfully" });
      } else {
          console.log("❌ Image not found:", filePath);
          return res.status(404).json({ error: "File not found" });
      }
  } catch (err) {
      console.error("❌ Error deleting image:", err);
      return res.status(500).json({ error: "Server error" });
  }
});



// GET CONTENTS OF THE FILE
app.get('/api/filecontent/:username/:path',async(req,res)=>{
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

  
})

// SAVE THE CONTENTS OF THE FILE
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
        //console.log(currentFile.content[0].children)
        
        
        await currentFile.save()

        //console.log(req.body.content[0].children)
        //console.log("file saved")
          
        return res.json({status:200,message:"File saved"});

  }catch(err){
    //console.log(err);
    return res.json({status:500,message:"Failed to send file"});
  }

})


//GET ALL NOTIFICATIONS FOR A USER
app.get('/api/notifications/:username',async(req,res)=>{
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

//REQUESTING ACCESS FROM OWNER
app.post('/api/reqacc/:username/:path', async(req,res)=>{
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
app.patch('/api/reqacc/:username/:path',async(req,res)=>{
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
//NOTIFICATION DELETED
app.delete('/api/notifications/:username/:path',async(req,res)=>{
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
  

//FILE OR DIRECTORY ACCESS CHECK - TO REDIRECT FROM NOACCESS PAGE
app.get('/api/access/:username/:path',async(req,res)=>{
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


app.get('/api/homeinfo/:username', async(req,res)=>{
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

//FILE OR DIRECTORY CREATION - FUNCTIONAL 
app.post('/api/:username/:path',async(req,res)=>{
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



//app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ Serve static files with CORP & CORS headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // ✅ Allows cross-origin access
      res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Allows CORS
      res.setHeader("Content-Type", "image/jpeg"); // ✅ Ensures correct MIME type
  }
}));



/*app.use('*',  (req, res) => {
    res.sendFile((__dirname+ '/dist/index.html'));
});*/
    



server.listen(process.env.PORT || 3000, ()=>{
    console.log("server started on port 3000")
})



//679d9f5eeac388a35086bce3-file:679d9f82eac388a35086bcf9