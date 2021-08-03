//Import Statements
const express = require('express')
const path = require('path')
const Connection = require('./utils/Connection')
const dotenv = require('dotenv').config()

//Initialize Express App
const app = express()
app.listen(process.env.PORT)
app.use(express.json({ extended: false, limit: '4mb' }))

//MongoDB Connection
Connection()

//Defining API Routes
app.use('/api/account', require('./api/Account'))
app.use('/api/identity', require('./api/Identity'))
app.use('/api/document', require('./api/Document'))

//Production Build Combination with React
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('view/build'))
    app.get('*', (req,res) => { res.sendFile(path.resolve(__dirname, 'view', 'build', 'index.html')) })
}