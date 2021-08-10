//Import Statements
const router = require('express').Router()
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const otptool = require('otp-without-db')
const otpgen = require('otp-generator')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const sendmail = require('../functions/SendMail')

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
                    const hash = otptool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm='sha256')
                    sendmail(email,otp)
                    return res.status(200).json({ hash, msg: 'Please check OTP in email' })
                }
            } 
            
            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection error' })
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
            let { name, email, password, otp, hash } = req.body
            password = await bcrypt.hash(password, 12)

            try 
            {
                let user = await User.findOne({ email })

                if(user)
                {
                    return res.status(400).json({ msg: 'Account with same email id already exists' })
                }

                else
                {
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm='sha256')

                    if(isOTPValid)
                    {
                        user = new User({ name, email, password })
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
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Sign In Route - Get OTP
router.post
(
    '/signin/getotp', 

    [
        check('email', 'Please provide valid email').isEmail(),
        check('password', 'Password is required').notEmpty(),
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
            let { email, password } = req.body

            try 
            {
                let user = await User.findOne({ email })

                if(!user)
                {
                    return res.status(401).json({ msg: 'Invalid credentials' })
                }

                else
                {
                    const isPasswordMatching = await bcrypt.compare(password, user.password)

                    if(isPasswordMatching)
                    {
                        const otp = otpgen.generate(6, { alphabets: false, specialChars: false, upperCase: false }) 
                        const hash = otptool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm='sha256')
                        sendmail(email, otp)
                        return res.status(200).json({ hash, msg: 'Please check OTP in email' })
                    }

                    else
                    {
                        return res.status(401).json({ msg: 'Invalid credentials' })
                    }
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Sign In Route - Login
router.post
(
    '/signin/login',

    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').notEmpty(),
        check('otp', 'OTP must be a 6 digit number').isLength(6),
        check('hash', 'Invalid hash').notEmpty()
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
            let { email, password, otp, hash } = req.body

            try 
            {
                let user = await User.findOne({ email })

                if(!user)
                {
                    return res.status(401).json({ msg: 'Invalid credentials' })
                }

                else
                {
                    const isPasswordMatching = await bcrypt.compare(password, user.password)
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm='sha256')
                    
                    if(isPasswordMatching)
                    {
                        if(isOTPValid)
                        {
                            const payload = { id: user.id }
                            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 })
                            return res.status(200).json({ token })
                        }
    
                        else
                        {
                            return res.status(400).json({ msg: 'Invalid OTP' })
                        }
                    }

                    else
                    {
                        return res.status(401).json({ msg: 'Invalid credentials' })
                    }
                }
            } 
            
            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Password Reset Route - Get OTP
router.post
(
    '/pwreset/getotp',

    [
        check('email', 'Email is required').notEmpty(),
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
            const { email } = req.body
            
            try 
            {
                let user = await User.findOne({ email })

                if(!user)
                {
                    return res.status(400).json({ msg: 'Account does not exist' })
                }

                else
                {
                    const otp = otpgen.generate(6, { alphabets: false, specialChars: false, upperCase: false }) 
                    const hash = otptool.createNewOTP(email, otp, key=OTP_KEY, expiresAfter=3, algorithm='sha256')
                    sendmail(email,otp)
                    return res.status(200).json({ hash, msg: 'Please check OTP in email' })
                }
            } 

            catch (error) 
            {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Password Reset Route - Reset & Login
router.post
(
    '/pwreset/reset', 

    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password must be within 8 & 18 chars').isLength(8,18),
        check('otp', 'OTP must be a 6 digit number').isLength(6),
        check('hash', 'Invalid hash').notEmpty()
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
            let { email, password, otp, hash } = req.body
            password = await bcrypt.hash(password, 12)
            
            try 
            {
                let user = await User.findOne({ email })

                if(!user)
                {
                    return res.status(400).json({ msg: 'Account does not exist' })
                }

                else
                {
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key=OTP_KEY, algorithm='sha256')

                    if(isOTPValid)
                    {
                        const filter = { email: email }
                        const update = { password: password }
                        await User.findOneAndUpdate(filter, update)
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
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Export Statement
module.exports = router