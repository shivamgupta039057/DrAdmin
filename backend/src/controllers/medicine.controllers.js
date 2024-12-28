const Medicine = require("../models/medicine.models.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const addMedicineControllers = async (req, res) => {
    try {
        const { medicineName , medicineStock , medicineManufacturerDate , medicineExpiryDate} = req.body;
        // const fullPath = req.file?.path;
        // if (!fullPath) {
        //     return res.status(400).json({ message: "Image file is required" });
        // }
        // const newImageUrl = await uploadOnCloudinary(fullPath);
        // const medicineImages = newImageUrl.url
        let medicineImages = null; // Default value if no image is uploaded

if (req.file?.path) {
    // If an image is uploaded, process it
    const fullPath = req.file.path;
    try {
        const newImageUrl = await uploadOnCloudinary(fullPath);
        medicineImages = newImageUrl.url; // Assign the uploaded image URL
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}
        

        if (!medicineName) {
            return res.status(400).json({ message: "Medicine name is required" });
        }
        if (!medicineStock) {
            return res.status(400).json({ message: "Medicine stock is required" });
        }
        if (!medicineManufacturerDate) {
            return res.status(400).json({ message: "Medicine manufacturer date is required" });
        }
        if (!medicineExpiryDate) {
            return res.status(400).json({ message: "Medicine expiry date is required" });
        } 
        
        const newMedicine = new Medicine({
            medicineName,
            medicineImages,
            medicineStock,
            medicineManufacturerDate,
            medicineExpiryDate

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
            perPage = 10 ,
            flag
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const itemsPerPage = parseInt(perPage, 10);
        const showAllData = parseInt(flag) === 0;


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

        // let sort = {
        //     createdAt : -1
        // };
        
        // if (sortBy && sortOrder) {
        //     sort[sortBy] = sortOrder === 'asc' ? 1 : -1; 
        // }
        const validSortFields = ['medicineName', 'medicineStock', 'medicineManufacturerDate' , 'medicineExpiryDate , createdAt' ]; // Replace with your schema fields
        const normalizedSortOrder = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
        let sort = {};
        
        if (validSortFields.includes(sortBy)) {
            sort[sortBy] = normalizedSortOrder;
        } else {
            sort['createdAt'] = -1; // Default sort
        }
        
        console.log("Sort Object:", sort);
                

        // const medicines = await Medicine.find(query)
        //     .sort(sort)
        //     .skip((pageNumber - 1) * itemsPerPage)
        //     .limit(itemsPerPage);
        let medicines;
        if (showAllData) {
            medicines = await Medicine.find(query).sort(sort);
        } else {
            medicines = await Medicine.find(query)
                .sort(sort)
                .skip((pageNumber - 1) * itemsPerPage)
                .limit(itemsPerPage);
        }

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

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "Medicine ID is required",
            });
        }

        const deletedMedicine = await Medicine.findByIdAndDelete(id);

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




module.exports = { addMedicineControllers , getMedicinesController , deleteMedicineController };
