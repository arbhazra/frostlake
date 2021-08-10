//Import Statements
const express = require('express')
const auth = require('../middlewares/auth')
const User = require('../models/User')
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
                return res.status(200).json({ user })
            }

            else
            {
                return res.status(401).json({ msg: 'Unauthorized' })
            }
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server error' })
        }
    }
)

//Export Statement
module.exports = router