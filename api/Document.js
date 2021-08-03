//Import Statements
const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../middlewares/auth')
const Document = require('../models/Document')
const router = express.Router()

//Create Document Route
router.post
(
    '/create',

    auth,

    [
        check('title', 'Title Must Not Be Empty').notEmpty(),
        check('content', 'Content Must Not Be Empty').notEmpty()
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
            const { title, content } = req.body

            try 
            {
                const count = await Document.find({ creator: req.id }).countDocuments()
                
                if(count < 100)
                {
                    let document = new Document({ creator: req.id, title, content })
                    await document.save()
                    return res.status(200).json(document)  
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
            const documents = await Document.find({ creator: req.id }).sort({ date: -1 })
            return res.status(200).json(documents)
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server Error' })
        }
        
    }
)

//View Document Route
router.get
(
    '/view/:id', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const document = await Document.findById(req.params.id)
            
            if(document.creator.toString() === req.id)
            {
                return res.status(200).json({ document })
            }
            
            else
            {
                return res.status(401).json({ msg: 'Access Denied' })
            }
        }
         
        catch (error) 
        {
            return res.status(404).json({ msg: 'Document Not Found' })
        }
        
    }
)

//Update Document Route
router.post
(
    '/update/:id',

    auth,

    [
        check('title', 'Title Must Not Be Empty').notEmpty(),
        check('content', 'Content Must Not Be Empty').notEmpty()
    ],

    async(req, res) =>
    {
        const errors = validationResult(req)
        console.log(req.body)

        if(!errors.isEmpty())
        {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else
        {
            const { title, content } = req.body

            try 
            {
                await Document.findByIdAndUpdate(req.params.id, { title, content })
                return res.status(200).json({ msg: 'Document Updated' })
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Error Creating Document' })
            }
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