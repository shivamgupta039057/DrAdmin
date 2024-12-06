const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema(

  {
    user:{
      type : mongoose.Types.ObjectId
    },
    ticketDate: {
      type: String,
      required: true,
    },
    medicineName: {
      type: [String],
      required: true,
    },
    DiagnosticName: {
      type: [String],
      required: true,
    },
    amount: {
      type: Number,
      required: true,  
    },
    note: {
      type: String,  
    },
    ticketDescription: {
      type: String,  
      required: true,  
    },
  },
  {
    timestamps: true, 
  }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
