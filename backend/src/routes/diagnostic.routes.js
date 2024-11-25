const express = require("express");
const upload = require("../middlewares/multer.middleware");
const { addDiagnosticControllers, getDiagnosticController, deleteDiagnosticController } = require("../controllers/diagnostic.controllers");
const Router = express.Router();

Router.get("/index",(req,res)=>{
    res.send("index")
});
Router.post("/add", upload.single("diagnosticImages"), addDiagnosticControllers);
Router.get("/list" , getDiagnosticController);
Router.post("/delete" , deleteDiagnosticController);





module.exports = Router;
