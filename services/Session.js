//Import Statements
const express = require('express')
const auth = require('../middlewares/auth')
const User = require('../models/User')
const Document = require('../models/Document')
const router = express.Router()

//Session Service Route
router.get
(
    '/getactiveuser', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const user = await User.findById(req.id).select('-password')
        
            if(user)
            {
                const documentCount = await Document.find({ creator: req.id }).select('-content').countDocuments()
                return res.status(200).json({ user, documentCount })
            }

            else
            {
                return res.status(401).json({ msg: 'Unauthorized' })
            }
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server Error' })
        }
    }
)

//Export Statement
module.exports = router