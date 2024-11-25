const { log } = require("console");
const multer = require("multer");
const path = require("path");
// require()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file,'---file');
        
        cb(null,path.join(__dirname,'../../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
console.log("storagestorage" , storage);


const upload = multer({
    storage,
});

module.exports = upload;
