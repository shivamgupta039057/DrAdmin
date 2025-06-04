const express = require("express");
const { addMedicineControllers, getMedicinesController, deleteMedicineController, updateMedicineController } = require("../controllers/medicine.controllers");
const upload = require("../middlewares/multer.middleware");
const Router = express.Router();

Router.get("/index",(req,res)=>{
    res.send("index")
});

Router.post("/add", upload.single("medicineImages"), addMedicineControllers);
Router.get("/list" , getMedicinesController);
Router.post("/delete" , deleteMedicineController);
Router.post("/update/:id", upload.single("medicineImages"), updateMedicineController);






module.exports = Router;
