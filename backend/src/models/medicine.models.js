const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
    medicineName: {
        type: String,
        required: true,
    },
    medicineImages: {
        type: String,
        required: false,
    },
    medicineStock: {
        type: String,
        required: true,
    },
    medicineManufacturerDate: {
        type: String,
        required: true,
    },
    medicineExpiryDate: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Medicine = mongoose.model("Medicine", MedicineSchema);
module.exports = Medicine;
