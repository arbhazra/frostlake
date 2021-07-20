//Import Statements
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const dotenv = require('dotenv').config()

//Reading Environment Variables
const JWT_SECRET = process.env.JWT_SECRET

//Authentication Checking Middleware
module.exports = async function(req,res,next) 
{
    const token = req.header('x-auth-token')
    
    if(!token)
    {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    else
    {
        try
        {
            const decoded = jwt.verify(token, JWT_SECRET) 
            req.id = decoded.id
            const user = await User.findById(decoded.id)

            if(user)
            {
                next()
            }

            else
            {
                return res.status(401).json({ msg: 'Invalid User' })
            }    
        }

        catch(error)
        {
            return res.status(401).json({ msg: 'Invalid Token' })
        }
    }
}