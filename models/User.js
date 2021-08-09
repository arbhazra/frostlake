//Import Statements
const mongoose = require('mongoose')

//User NoSQL Schema
const UserSchema = new mongoose.Schema
({
    name:
    {
        type: String,
        required: true
    },

    email:
    {
        type: String,
        required: true,
        unique: true
    },

    password:
    {
        type: String,
        required: true
    },

    date:
    {
        type: Date,
        default: Date.now
    }
})


//EXPORT STATEMENTS
module.exports = User = mongoose.model('user', UserSchema)