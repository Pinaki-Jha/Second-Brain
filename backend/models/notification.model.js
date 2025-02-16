/*
notification
id
recipient (user)
sender (user) (?)
message
sent date
type (grant access/accept access/etc)
action (?) --NOT NEEDED
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sender:{ id:{type: Schema.Types.ObjectId, ref: "User", required: true},name:{type:String}},
  directory:{type:Schema.Types.ObjectId, ref:"Directory"},
  file:{type:Schema.Types.ObjectId, ref:"File"},
  sent_date:{type:Date},
  type:{type:String},
  deleted: {type:Date},
},

{collection : 'directory-data'});



const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
