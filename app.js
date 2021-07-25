//Import Statements
const express = require('express')
const path = require('path')
const MongoConnection = require('./utils/MongoConnection')
const dotenv = require('dotenv').config()

//Initialize Express App
const app = express()
app.listen(process.env.PORT)
app.use(express.json({ extended: false, limit: '4mb' }))

//MongoDB Connection
MongoConnection()

//Defining API Routes
app.use('/api/account', require('./api/Account'))
app.use('/api/auth', require('./api/Authentication'))
app.use('/api/doccloud', require('./api/Cloud'))

//Production Build Combination with React
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('view/build'))
    app.get('*', (req,res) => { res.sendFile(path.resolve(__dirname, 'view', 'build', 'index.html')) })
}