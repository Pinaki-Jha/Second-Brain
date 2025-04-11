const express = require('express');
const { Server } = require("socket.io");
const http = require("http")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config();


const userAuthRoutes = require('./routes/userAuthRoutes')
const dirFileRoutes = require('./routes/dirFileRoutes')
const fileContentRoutes = require('./routes/fileContentRoutes')
const userAccessRoutes = require('./routes/userAccessRoutes')
const userNotificationRoutes = require('./routes/userNotificationRoutes')
const userHomeRoutes =  require('./routes/userHomeRoutes')


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

mongoose.connect(process.env.MONGODB_URI)


//LOGIN AND REGISTRATION
app.use('/api/auth',userAuthRoutes)



//HOMEPAGE ROUTE
app.use('/api/home',userHomeRoutes)

//USER ACCESS RELATED
app.use('/api/access',userAccessRoutes)

//NOTIFICATIONS RELATED
app.use('/api/notifications',userNotificationRoutes)

//FILECONTENT RELATED
app.use('/api/filecontent',fileContentRoutes)

//ANYTHING FILE OR DIRECTORY RELATED
app.use('/api/dirfile',dirFileRoutes)



/*app.use('*',  (req, res) => {
    res.sendFile((__dirname+ '/dist/index.html'));
});*/
    



server.listen(process.env.PORT || 3000, ()=>{
    console.log("server started on port 3000")
})



