const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const uri = `${process.env.MONGO_URI}`
        const connectionInstance = await mongoose.connect(uri)
        console.log("MONGODB connection SUCCESSFUL !! DD Host : ", connectionInstance.connection.host)
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

module.exports = connectDB