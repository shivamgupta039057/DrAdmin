const mongoose = require("mongoose");
const User = require("../models/user.models");  
const Ticket = require("../models/tickets.models"); 

const createTicket = async (req, res) => {
  const { mobileNo, relationship, ticketData } = req.body;

  try {
    let user = await User.findOne({ mobileNo, relationship });

    if (!user) {
      const existingUserWithMobile = await User.findOne({ mobileNo });

      if (existingUserWithMobile) {
        // If mobile number exists but with a different relationship, create a new user
        if (existingUserWithMobile.relationship !== relationship) {
          user = new User({
            username: ticketData.username,
            mobileNo,
            sex: ticketData.sex,
            age: ticketData.age,
            address: ticketData.address,
            relationship,
          });
          await user.save();
        }
      } else {
        user = new User({
          username: ticketData.username,
          mobileNo,
          sex: ticketData.sex,
          age: ticketData.age,
          address: ticketData.address,
          relationship,
        });
        await user.save();
      }
    } else {
      console.log(
        "User already exists with the same mobile number and relationship."
      );
    }

    const newTicket = new Ticket({
      user: user.id,
      ticketDate: ticketData.ticketDate,
      medicineName: ticketData.medicineName,
      DiagnosticName: ticketData.DiagnosticName,
      amount: ticketData.amount,
      note: ticketData.note,
      ticketDescription: ticketData.ticketDescription,
    });

    await newTicket.save();

    res
      .status(200)
      .json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error("Error creating ticket:", error);

    if (error.code === 11000) {
      res.status(400).json({
        message: "Duplicate entry error. This combination of mobileNo and relationship already exists.",
        error: error.keyValue,
      });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};


const checkPatientsEdit = async (req, res) => {
  const { mobileNo, relationship, ticketData } = req.body;

  try {
    if (!mobileNo || !relationship) {
      return res.status(400).json({
        message: "Both mobileNo and relationship are required.",
      });
    }

    const user = await User.findOne({ mobileNo, relationship });

    if (!user) {
      return res.status(404).json({
        message: "User not found with the given mobileNo and relationship.",
      });
    }

    const ticket = await Ticket.findOne({ user: user._id, _id: ticketData.ticketId });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found for the user.",
      });
    }

    ticket.ticketDate = ticketData.ticketDate || ticket.ticketDate;
    ticket.medicineName = ticketData.medicineName || ticket.medicineName;
    ticket.DiagnosticName = ticketData.DiagnosticName || ticket.DiagnosticName;
    ticket.amount = ticketData.amount || ticket.amount;
    ticket.note = ticketData.note || ticket.note;
    ticket.ticketDescription = ticketData.ticketDescription || ticket.ticketDescription;

    await ticket.save();

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



const checkTicket = async (req, res) => {
  const { mobileNo , relationship } = req.body;
 
 try{
  if (!mobileNo || !relationship) {
    console.error("Both mobile number and relationship are required.");
    return;
  }
  const newUserData = {
    mobileNo,
     relationship
  }
  
  const user = await User.findOne({ mobileNo: mobileNo, relationship: relationship });

   if(user){
    res.status(200).json({ message: "User Already Exist", ticket: user });
   }
   else{
    res.status(400).json({ message: "User Not  Exist", ticket: "" ,newUserData  });
   }
 }catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server error", error: error.message });
}
};

const checkPatientsTickets = async (req, res) => {
  const {
    _id, 
    search = '', 
    sortBy = 'createdAt', 
    sortOrder = 'desc', 
    page = 1, 
    perPage = 10,
  } = req.query;

  try {
    const validSortBy = sortBy && sortBy.trim() ? sortBy : 'createdAt';

    const searchQuery = search
      ? { note : { $regex: search, $options: 'i' } }
      : {};

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const itemsPerPage = Math.max(parseInt(perPage, 10) || 10, 1);

    const sort = { [validSortBy]: sortOrder === 'asc' ? 1 : -1 };

    const totalItems = await Ticket.countDocuments({
      ...searchQuery,
      user: new mongoose.Types.ObjectId(_id),
    });

    if (totalItems === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No tickets found',
        data: [],
        pagination: {
          totalItems: 0,
          currentPage: pageNumber,
          totalPages: 0,
          itemsPerPage,
        },
      });
    }

    const tickets = await Ticket.aggregate([
      { 
        $match: {
          user: new mongoose.Types.ObjectId(_id),
          ...searchQuery,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                username: 1,
                mobileNo: 1,
                sex: 1,
                age: 1,
                address: 1,
              },
            },
          ],
          as: 'result',
        },
      },
      { $unwind: '$result' },
      {
        $project: {
          ticketDate: 1,
          medicineName: 1,
          DiagnosticName: 1,
          amount: 1,
          note: 1,
          ticketDescription: 1,
          username: '$result.username',
          mobileNo: '$result.mobileNo',
          sex: '$result.sex',
          age: '$result.age',
          address: '$result.address',
        },
      },
      { $sort: sort },
      { $skip: (pageNumber - 1) * itemsPerPage },
      { $limit: itemsPerPage },
    ]);

    if (tickets.length > 0) {
      res.status(200).json({
        message: 'Tickets fetched successfully',
        data: tickets,
        pagination: {
          totalItems,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalItems / itemsPerPage),
          itemsPerPage,
        },
      });
    } else {
      res.status(404).json({ message: 'No tickets found for the given user' });
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const checkPatientsDelete = async (req, res) => {
  try {
      const { id } = req.body;

      if (!id) {
          return res.status(400).json({
              status: 400,
              message: "User ID is required",
          });
      }
      const deletedTicket = await Ticket.findByIdAndDelete(id);

      if (!deletedTicket) {
          return res.status(404).json({
              status: 404,
              message: "Ticket not found",
          });
      }

      return res.status(200).json({
          status: 200,
          message: "Ticket deleted successfully",
          data: deletedTicket,
      });
  } catch (error) {
      console.error("Error deleting medicine:", error);
      return res.status(500).json({
          status: 500,
          message: "Internal server error",
          error: error.message,
      });
  }
};




module.exports = { createTicket  , checkTicket , checkPatientsTickets , checkPatientsDelete , checkPatientsEdit};
