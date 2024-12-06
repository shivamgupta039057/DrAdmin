const express = require("express");
const { createTicket , checkTicket, checkPatientsTickets, checkPatientsDelete, checkPatientsEdit } = require("../controllers/ticket.controllers");
const Router = express.Router();

Router.get("/index",(req,res)=>{
    res.send("index")
});
Router.post("/add", createTicket);
Router.post("/check", checkTicket);
Router.get("/checkPatientsTickets" , checkPatientsTickets);
Router.post("/delete" , checkPatientsDelete);
Router.post("/edit" , checkPatientsEdit);




module.exports = Router;
