//Import Statements
const router = require('express').Router()
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const otptool = require('otp-without-db')
const otpgen = require('otp-generator')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const sendmail = require('../mail/SendMail')

//Reading Environment Variables
const JWT_SECRET = process.env.JWT_SECRET
const OTP_KEY = process.env.OTP_KEY

//Sign Up Route - Get OTP
router.post
(
    '/signup/getotp',

    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please provide valid email').isEmail()
    ],

    async(req,res) =>
    {
        const errors = validationResult(req)

        if(!errors.isEmpty())
        {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else
        {
            const { email } = req.body

            try 
            {
                let user = await User.findOne({ email })

                if(user)
                {
                    return res.status(400).json({ msg: 'Account with same email id already exists' })
                }

                else
                {
                    const otp = otpgen.generate(6, { alphabets: false, specialChars: false, upperCase: false }) 
                    const hash = otptool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm="sha256")
                    sendmail(email,otp)
                    return res.status(200).json({ hash, msg: 'Please check OTP in Email' })
                }
            } 
            
            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Sign Up Route - Register
router.post
(
    '/signup/register',

    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please provide valid email').isEmail(),
        check('password', 'Password must be within 8 & 18 chars').isLength(8,18),
        check('otp', 'Invalid OTP format').isLength(6),
        check('hash', 'Invalid Hash').notEmpty(),
        check('region', 'Please Select Region').notEmpty()
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
            let { name, email, password, otp, hash, region } = req.body
            password = await bcrypt.hash(password, 12)

            try 
            {
                let user = await User.findOne({ email })

                if(user)
                {
                    return res.status(400).json({ msg: 'Account With Same Email Address Exists' })
                }

                else
                {
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm='sha256')

                    if(isOTPValid)
                    {
                        user = new User({ name, email, password, region })
                        await user.save()
                        const payload = { id: user.id }
                        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 })
                        return res.status(200).json({ token })
                    }

                    else
                    {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }

                }        
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Export Statement
module.exports = router