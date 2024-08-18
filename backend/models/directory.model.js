/*
User
    id
    username
    email
    password
    directories: [root + other directories they have access to]  (?)
*/

/*directory
    id
    name
    created_by
    accessibility
    update log
    delete log
    contents
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const directorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Directory" },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  access:[{ type: Schema.Types.ObjectId, ref: "User"}],
  last_updated: {type:Date},
  deleted: {type:Date},
  directories: [{ type: Schema.Types.ObjectId, ref: "Directory" }],
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

const Directory = mongoose.model("Directory", directorySchema);

module.exports = Directory;
