const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiagnosticSchema = new Schema({
    diagnosticName: {
        type: String,
    },
    diagnosticImages: {
        type: String,
    },
}, { timestamps: true });

const Diagnostic = mongoose.model("Diagnostic", DiagnosticSchema);
module.exports = Diagnostic;
