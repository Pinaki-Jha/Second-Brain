const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ✅ Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/api/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: 0, error: "No file uploaded" });
        }

        // ✅ Compress and save image
        const compressedBuffer = await sharp(req.file.buffer)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toBuffer();

        const fileName = `compressed_${Date.now()}.jpeg`;
        const filePath = path.join(__dirname, "../uploads", fileName);
        fs.writeFileSync(filePath, compressedBuffer);

        // ✅ Return correct response format
        res.json({ 
            success: 1, 
            file: { url: `http://localhost:3000/uploads/${fileName}` } 
        });

    } catch (err) {
        console.error("Image upload error:", err);
        res.status(500).json({ success: 0, error: "Server error" });
    }
});




module.exports = router;
