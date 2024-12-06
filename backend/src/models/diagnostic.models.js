const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiagnosticSchema = new Schema({
    diagnosticName: {
        type: String,
        require : true
    },
    diagnosticImages: {
        type: String,
        require : false
    },
    TestAmount: {
        type : String,
        require : true
    }
}, { timestamps: true });

const Diagnostic = mongoose.model("Diagnostic", DiagnosticSchema);
module.exports = Diagnostic;
