const getHandleUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
          }
        
          // Generate a file URL for the uploaded file
          const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        return res.status(200).json({
            status: 200,
            message: "file uploaded successfully",
            data: fileUrl,
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

module.exports = {  getHandleUpload };