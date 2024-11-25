const Medicine = require("../models/medicine.models.js");

const addMedicineControllers = async (req, res) => {
    try {
        const { medicineName } = req.body;
        const fullPath = req.file?.path;
        const medicineImages = fullPath ? `uploads/${req.file.filename}` : null;

        console.log("medicineImages", medicineImages);

        if (!medicineName) {
            return res.status(400).json({ message: "Medicine name is required" });
        }

        if (!medicineImages) {
            return res.status(400).json({ message: "Medicine image is required" });
        }

        
        
        // Create a new medicine entry
        const newMedicine = new Medicine({
            medicineName,
            medicineImages,
        });

        await newMedicine.save();

        return res.status(201).json({
            status: 201,
            message: "Medicine added successfully",
            data: newMedicine,
        });
    } catch (error) {
        console.error("Error adding medicine:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getMedicinesController = async (req, res) => {
    try {
        const { 
            search = '', 
            sortBy = 'createdAt', 
            sortOrder = 'desc', 
            page = 1, 
            perPage = 10 
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const itemsPerPage = parseInt(perPage, 10);

        let query = {};
        if (search) {
            query.medicineName = { $regex: search, $options: 'i' }; 
        }

        const totalItems = await Medicine.countDocuments(query);

        if (totalItems === 0) {
            return res.status(404).json({
                status: 404,
                message: "No medicines found",
                data: [],
                pagination: {
                    totalItems: 0,
                    currentPage: pageNumber,
                    totalPages: 0,
                    itemsPerPage,
                },
            });
        }

        let sort = {
            createdAt : -1
        };
        console.log("sortsortsortsort" , sort);
        
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1; 
        }

        const medicines = await Medicine.find(query)
            .sort(sort)
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage);

        return res.status(200).json({
            status: 200,
            message: "Medicines retrieved successfully",
            data: medicines,
            pagination: {
                totalItems,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                itemsPerPage,
            },
        });
    } catch (error) {
        console.error("Error fetching medicines:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};


const deleteMedicineController = async (req, res) => {
    try {
        const { id } = req.body;

        // Validate that the ID is provided
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "Medicine ID is required",
            });
        }

        // Find and delete the document
        const deletedMedicine = await Medicine.findByIdAndDelete(id);

        // If no document is found to delete
        if (!deletedMedicine) {
            return res.status(404).json({
                status: 404,
                message: "Medicine not found",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Medicine deleted successfully",
            data: deletedMedicine,
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



// const deleteMedicineController = async (req , res) => {
//     const { id } = req.body;

//     console.log("idid" , id);
    
// }


module.exports = { addMedicineControllers , getMedicinesController , deleteMedicineController };
