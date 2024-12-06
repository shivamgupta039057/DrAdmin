const { log } = require("console");
const multer = require("multer");
const path = require("path");
// require()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,path.join(__dirname,'../../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
});

module.exports = upload;
