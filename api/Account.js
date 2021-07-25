//Import Statements
const express = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const auth = require('../middlewares/auth')
const User = require('../models/User')
const Project = require('../models/Project')
const Document = require('../models/Document')
const router = express.Router()

//Dashboard Route
router.get
(
    '/dashboard', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const user = await User.findById(req.id).select('-password')
        
            if(user)
            {
                const projectCount = await Project.find({ creator: req.id }).countDocuments()
                const documentCount = await Document.find({ creator: req.id }).countDocuments()
                return res.status(200).json({ user, projectCount, documentCount })
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

//Update Account Route
router.post
(
    '/update', 

    auth, 

    [
        check('name', 'Name is required').notEmpty(),
        check('password', 'Password must be within 8 & 18 chars').isLength(8,18)
    ],

    async(req,res)=> 
    {
        const errors = validationResult(req)

        if(!errors.isEmpty())
        {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else
        {
            let { name, password } = req.body
            password = await bcrypt.hash(password, 12)
            
            try
            {
                await User.findByIdAndUpdate(req.id, { name, password })
                return res.status(200).json({ msg: 'Profile Updated' })
            }
            
            catch(error)
            {
                return res.status(500).json({ msg: 'Server Error' })
            }
        }
    }
)

//Close Account Route
router.post
(
    '/close', 

    auth, 

    async(req,res)=> 
    {
        let { password } = req.body
        const user = await User.findById(req.id)

        if(user)
        {
            const isPasswordMatching = await bcrypt.compare(password, user.password)
            
            if(isPasswordMatching)
            {
                await Project.deleteMany({ creator: req.id })
                await Document.deleteMany({ creator: req.id })
                await User.findByIdAndDelete(req.id)
                return res.status(200).json({ msg: 'Account Close Success' })
            }

            else
            {
                return res.status(401).json({ msg: 'Invalid Password' })
            }
        }

        else
        {
            return res.status(401).json({ msg: 'Invalid Password' })
        }
    }
)

//Export Statement
module.exports = router