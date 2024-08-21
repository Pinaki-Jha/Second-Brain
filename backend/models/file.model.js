/*file
    Id
    Name
    Created By
    Parent Directory(?)
    Backlinks
    Accessibility
    Delete Log
    Update Log
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: { type: String, required: true },
  content: {type:String},
  parent: { type: Schema.Types.ObjectId, ref: "Directory",required:true},
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  access:[{ type: Schema.Types.ObjectId, ref: "User"}],
  last_updated: {type:Date},
  deleted: {type:Date},
},{collection : 'file-data'});

const File = mongoose.model("File", fileSchema);

module.exports = File;
