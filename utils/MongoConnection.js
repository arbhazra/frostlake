//Import Statements
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

//Reading Environment Variables
const MONGO_URI = process.env.MONGO_URI

//Mongo DB Connection Method
const MongoConnection = async() =>
{
    try 
    {
        await mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
        console.log('Mongo DB Connected')
    } 
    
    catch (error) 
    {
        console.log('Mongo Connection Error')
    }
}

//Export Statement
module.exports = MongoConnection