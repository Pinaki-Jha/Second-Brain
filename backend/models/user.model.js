/*
User
    id
    username
    email
    password
    directories: [root + other directories they have access to]  (?)
*/


const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-z0-9_-]+$/,},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    content: [],
},{collection : 'user-data'})


const User = mongoose.model("UserData",userSchema)

module.exports = User

