const express = require("express");
const { createTicket , checkTicket, checkPatientsTickets, checkPatientsDelete, checkPatientsEdit } = require("../controllers/ticket.controllers");
const upload = require("../middlewares/multer.middleware");
const { getHandleUpload } = require("../controllers/uploadController");
const Router = express.Router();



Router.post('/get', upload.single('file'), getHandleUpload);



module.exports = Router;
