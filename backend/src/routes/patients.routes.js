const express = require("express");
const { getPatients, deleteUserController } = require("../controllers/patients.controllers");
const Router = express.Router();


Router.get("/get", getPatients);
Router.post("/delete" , deleteUserController);


module.exports = Router;
