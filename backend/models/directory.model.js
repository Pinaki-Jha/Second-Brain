
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
  directories: [{type:String}],
  files: [{type:String}],
  //directories: [{ id: {type: Schema.Types.ObjectId, ref: "Directory"},name:{type:String} }],
  //files: [{ id:{type: Schema.Types.ObjectId, ref: "File"},name:{type:String}}],
},
/*{
  unique: true,
  partialFilterExpression: {
    $or: [
      { parent: { $exists: false } }, // Root directories
      { parent: { $exists: true } }   // Subdirectories
    ]
  }
},
*/
{collection : 'directory-data'});

//directorySchema.index({ name: 1, parent: 1, owner: 1 }, { unique: true });


const Directory = mongoose.model("Directory", directorySchema);

module.exports = Directory;
