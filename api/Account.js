//Import Statements
const express = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const auth = require('../middlewares/auth')
const User = require('../models/User')
const Document = require('../models/Document')
const router = express.Router()

//Account Storage Route
router.get
(
    '/storage',

    auth,

    async(req,res) =>
    {
        try 
        {
            const documentCount = await Document.find({ creator: req.id }).select('-content').countDocuments()
            return res.status(200).json({ documentCount })
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server error' })
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
        check('password', 'Password must be within 8 & 18 chars').isLength(8,18),
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
                return res.status(200).json({ msg: 'Profile updated' })
            }
            
            catch(error)
            {
                return res.status(500).json({ msg: 'Server error' })
            }
        }
    }
)

//Close Account Route
router.post
(
    '/close', 

    auth, 

    [
        check('password', 'Password must not Be empty').notEmpty()
    ],

    async(req,res)=> 
    {

        try 
        {
            let { password } = req.body
            const user = await User.findById(req.id)
    
            if(user)
            {
                const isPasswordMatching = await bcrypt.compare(password, user.password)
                
                if(isPasswordMatching)
                {
                    await Document.deleteMany({ creator: req.id })
                    await User.findByIdAndDelete(req.id)
                    return res.status(200).json({ msg: 'Account close success' })
                }
    
                else
                {
                    return res.status(401).json({ msg: 'Invalid password' })
                }
            }
    
            else
            {
                return res.status(401).json({ msg: 'Invalid password' })
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