const mongoose = require('mongoose');

const dbConnect = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected.');
    } catch (error) {
        console.log('Error Connecting MONGO_DB',error.message);
    }
}

module.exports = dbConnect;