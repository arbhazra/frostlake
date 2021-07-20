//Import Statements
const express = require('express')
const { check, validationResult } = require('express-validator')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const auth = require('../middlewares/auth')
const Project = require('../models/Project')
const router = express.Router()

//New Project Route
router.post
(
    '/new', 

    auth,

    [
        check('title', 'Title must be within 3 & 8 chars').isLength(3,8),
        check('description', 'Description is required').notEmpty(),
        check('link', 'Link must be an URL').isURL()
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
            const { title, description, link } = req.body
            const accesstoken = uuidv4()

            try 
            {
                const count = await Project.find({ creator: req.id }).count()
                
                if(count < 100)
                {
                    let project = new Project({ creator: req.id, title, description, link, accesstoken })
                    await project.save()
                    return res.status(200).json({ msg: 'Project Created' })  
                }

                else
                {
                    return res.status(400).json({ msg: 'Account Storage Full' })   
                }
            } 

            catch (error) 
            {
                console.log(error)
                return res.status(500).json({ msg: 'Error Creating Project' })
            }
        }
    }
)

//Library Route
router.get
(
    '/library', 

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
    '/view/:id', 

    auth, 

    async(req,res)=> 
    {
        try 
        {
            const project = await Project.findById(req.params.id)

            if(project.creator.toString() === req.id)
            {
                return res.status(200).json(project)
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

//Update Project Route
router.post
(
    '/update/:id', 

    auth, 

    [
        check('title', 'Title must be within 3 & 8 chars').isLength(3,8),
        check('description', 'Description is required').notEmpty(),
        check('link', 'Link is required').notEmpty()
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
            try
            {
                const { title, description, link } = req.body
                await Project.findByIdAndUpdate(req.params.id, { title, description, link })
                return res.status(200).json({ msg: 'Project Updated' })
            }
            
            catch(error)
            {
                return res.status(500).json({ msg: 'Error Updating Project' })
            }
        }
    }
)

//Delete Project Route
router.delete
(
    '/delete/:id', 

    auth, 
    
    async (req, res) => 
    {
        try 
        {
            const project = await Project.findById(req.params.id)
            await project.remove()
            return res.status(200).json({ msg: 'Project Deleted' })
        } 
        
        catch (err) 
        {
            return res.status(500).send({ msg: 'Server Error' })
        }
    }
)

//Search Project Route
router.post
(
    '/search',  

    auth,

    [
        check('id', 'Id is required').notEmpty(),
        check('accesstoken', 'Access token is required').notEmpty()
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
            const { id, accesstoken } = req.body
            
            try 
            {
                const _id = mongoose.Types.ObjectId(id)
                const project = await Project.findOne({ _id, accesstoken })
    
                if(project)
                {
                    return res.status(200).json(project)
                }
    
                else
                {
                    return res.status(404).json({ msg: 'Invalid Details' })
                }
            }
             
            catch (error) 
            {
                return res.status(404).json({ msg: 'Invalid Details' })
            } 
        }
    }
)

//Export Statement
module.exports = router