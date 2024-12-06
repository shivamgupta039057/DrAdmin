// const Medicine = require("../models/medicine.models.js");
const Diagnostic = require("../models/diagnostic.models.js");

const addDiagnosticControllers = async (req, res) => {
    try {
        const { diagnosticName , TestAmount } = req.body;
        const fullPath = req.file?.path;        
        const diagnosticImages = fullPath ? `uploads/${req.file.filename}` : null;

        if (!diagnosticName) {
            return res.status(400).json({ message: "diagnostic  name is required" });
        }
        if (!TestAmount) {
            return res.status(400).json({ message: "Amount is required" });
        }

        
        
        const newMedicine = new Diagnostic({
            diagnosticName,
            diagnosticImages,
            TestAmount
        });

        await newMedicine.save();

        return res.status(201).json({
            status: 201,
            message: "Diagnostic added successfully",
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

const getDiagnosticController = async (req, res) => {
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
            query.diagnosticName = { $regex: search, $options: 'i' }; 
        }

        const totalItems = await Diagnostic.countDocuments(query);

        if (totalItems === 0) {
            return res.status(404).json({
                status: 404,
                message: "No Diagnostic found",
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
        
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1; 
        }

        const medicines = await Diagnostic.find(query)
            .sort(sort)
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage);

        return res.status(200).json({
            status: 200,
            message: "Diagnostic retrieved successfully",
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


const deleteDiagnosticController = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "Diagnostic ID is required",
            });
        }

        const deletedMedicine = await Diagnostic.findByIdAndDelete(id);

        if (!deletedMedicine) {
            return res.status(404).json({
                status: 404,
                message: "Diagnostic not found",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Diagnostic deleted successfully",
            data: deletedMedicine,
        });
    } catch (error) {
        console.error("Error deleting Diagnostic:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = { addDiagnosticControllers , getDiagnosticController , deleteDiagnosticController };
