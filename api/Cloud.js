//Import Statements
const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../middlewares/auth')
const Project = require('../models/Project')
const Document = require('../models/Document')
const router = express.Router()

//Create Project Route
router.post
(
    '/project/create', 

    auth,

    [
        check('title', 'Title must be within 3 & 8 chars').isLength(3,8)
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
            const { title } = req.body

            try 
            {
                const count = await Project.find({ creator: req.id }).countDocuments()
                
                if(count < 10)
                {
                    let project = new Project({ creator: req.id, title })
                    await project.save()
                    return res.status(200).json({ project })  
                }

                else
                {
                    return res.status(400).json({ msg: 'Project Storage Full' })   
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Error Creating Project' })
            }
        }
    }
)

//Project Inventory Route
router.get
(
    '/project/inventory', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const projects = await Project.find({ creator: req.id }).sort({ date: -1 })
            return res.status(200).json(projects)
        } 
        
        catch (error) 
        {
            return res.status(500).json({ msg: 'Server Error' })
        }
        
    }
)

//View Project Route
router.get
(
    '/project/inventory/viewone/:id', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const project = await Project.findById(req.params.id)
            const documents = await Document.find({ project: req.params.id })

            if(project.creator.toString() === req.id)
            {
                return res.status(200).json({ project, documents })
            }
            
            else
            {
                return res.status(401).json({ msg: 'Access Denied' })
            }
        }
         
        catch (error) 
        {
            return res.status(404).json({ msg: 'Project Not Found' })
        }
        
    }
)

//Delete Project Route
router.delete
(
    '/project/inventory/viewone/:id/deleteproject', 

    auth, 
    
    async (req, res) => 
    {
        try 
        {
            const project = await Project.findById(req.params.id)

            if(req.id == project.creator)
            {
                await project.remove()
                return res.status(200).json({ msg: 'Project Deleted' })
            }

            else
            {
                return res.status(400).json({ msg: 'Project Deletion Failed' })
            }
        } 
        
        catch (err) 
        {
            return res.status(500).send({ msg: 'Server Error' })
        }
    }
)

//Create Document Route
router.post
(
    '/project/inventory/viewone/:id/docs/create',

    auth,

    [
        check('name', 'Name Must Not Be Empty').notEmpty(),
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
            const { name, content, project } = req.body

            try 
            {
                const count = await Document.find({ creator: req.id }).countDocuments()
                
                if(count < 100)
                {
                    let document = new Document({ creator: req.id, project, name, content })
                    await document.save()
                    return res.status(200).json({ msg: 'Document Uploaded' })  
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

//View Document Route
router.get
(
    '/project/inventory/viewone/:id/docs/:docid', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const document = await Document.findById(req.params.docid)
            
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
            return res.status(404).json({ msg: 'Project Not Found' })
        }
        
    }
)

//Update Document Route
router.post
(
    '/project/inventory/viewone/:id/docs/:docid/update',

    auth,

    [
        check('name', 'Name Must Not Be Empty').notEmpty(),
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
            const { name, content } = req.body

            try 
            {
                await Document.findByIdAndUpdate(req.params.docid, { name, content })
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
    '/project/inventory/viewone/:id/docs/:docid/delete',

    auth,

    async(req, res) =>
    {
        try 
        {
            await Document.findByIdAndDelete(req.params.docid)
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