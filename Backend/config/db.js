const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB succesfully connected")
    }
    catch(error){
        console.log('Error connecting to MongoDB');
    }
}

// we can this function to connect the DB
module.exports = connectDB;
