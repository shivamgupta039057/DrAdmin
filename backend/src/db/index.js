const { DB_NAME } = require("../Constants.js");
const mongoose = require('mongoose');

const ConnectDB = async () => {

    // console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);

    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`/n Mongoose Connected !! DB:Host: ${ConnectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGOOSE CONNECTION ERROR", error);
        process.exit(1);
    }
}

module.exports = ConnectDB