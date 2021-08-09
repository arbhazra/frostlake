//Import Statements
const express = require('express')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const auth = require('../middlewares/auth')
const Document = require('../models/Document')
const router = express.Router()
const dotenv = require('dotenv').config()

//Reading Environment Variables
const JWT_SECRET = process.env.JWT_SECRET

//Create Document Route
router.post
(
    '/create',

    auth,

    [
        check('title', 'Title must not be empty').notEmpty(),
        check('content', 'Content must not be empty').notEmpty(),
        check('privacy', 'Privacy field can not be empty').notEmpty()
    ],

    async(req, res) =>
    {
        const errors = validationResult(req)

        if(!errors.isEmpty())
        {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else
        {
            const { title, content, privacy } = req.body

            try 
            {
                const count = await Document.find({ creator: req.id }).countDocuments()
                
                if(count < 100)
                {
                    let document = new Document({ creator: req.id, title, content, privacy })
                    await document.save()
                    return res.status(200).json({ msg: 'Document Created' })  
                }

                else
                {
                    return res.status(400).json({ msg: 'Document Storage Full' })   
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Error Creating Document' })
            }
        }
    }
)

//Document Library Route
router.get
(
    '/library', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const documents = await Document.find({ creator: req.id }).select('-content').sort({ date: -1 })
            return res.status(200).json(documents)
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server Error' })
        }
        
    }
)

//Save Document Route
router.get
(
    '/save/:id', 

    async(req,res)=> 
    {
        try 
        {
            const token = req.header('x-auth-token')
            const document = await Document.findById(req.params.id)

            if(document.privacy == 'private')
            {
                const decoded = jwt.verify(token, JWT_SECRET) 
                
                if(decoded.id == document.creator)
                {
                    return res.status(200).json({ document })
                }

                else
                {
                    return res.status(404).json({ msg: 'No Access' })
                }
            }

            else
            {
                return res.status(200).json({ document })
            }
        }
         
        catch (error) 
        {
            return res.status(404).json({ msg: 'No Access' })
        }
        
    }
)

//Delete Document Route
router.delete
(
    '/delete/:id',

    auth,

    async(req, res) =>
    {
        try 
        {
            await Document.findByIdAndDelete(req.params.id)
            return res.status(200).json({ msg: 'Document Deleted' })
        } 

        catch (error) 
        {
            return res.status(500).json({ msg: 'Error Deleting Document' })
        }
    }
)

//Export Statement
module.exports = router