const User = require("../models/user.models")
const getPatients = async (req, res) => {
    try {
        const { 
            search = '', 
            sortBy = 'createdAt', 
            sortOrder = 'desc', 
            page = 1, 
            perPage = 10 
        } = req.query;

        const query = search
            ? { mobileNo: { $regex: search, $options: 'i' } } 
            : {};

        const pageNumber = parseInt(page, 10);
        const itemsPerPage = parseInt(perPage, 10);

        const sort = {};
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1; 
        }

        const totalItems = await User.countDocuments(query);

        if (totalItems === 0) {
            return res.status(404).json({
                status: 404,
                message: "No users found",
                data: [],
                pagination: {
                    totalItems: 0,
                    currentPage: pageNumber,
                    totalPages: 0,
                    itemsPerPage,
                },
            });
        }

        const Patients = await User.find(query)
            .sort(sort)
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage);

        return res.status(200).json({
            status: 200,
            message: "Patients fetched successfully",
            data: Patients,
            pagination: {
                totalItems,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                itemsPerPage,
            },
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const deleteUserController = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required",
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User deleted successfully",
            data: deletedUser,
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


module.exports = {  getPatients , deleteUserController };