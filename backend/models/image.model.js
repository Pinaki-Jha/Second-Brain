const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    data: { type: String, required: true } // ✅ Stores Base64 image data
});

module.exports = mongoose.model("Image", ImageSchema);