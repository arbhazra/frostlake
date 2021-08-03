//Import Statements
const mongoose = require('mongoose')

//Project NoSQL Schema
const DocumentSchema = new mongoose.Schema
({
    creator:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title:
    {
        type: String,
        required: true
    },

    content:
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
module.exports = Document = mongoose.model('document', DocumentSchema)