//Import Statements
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv').config()

//Reading Environment Variables
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const MAILER_UN = process.env.MAILER_UN

//OAuth2 Setup
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

//Sendmail function
async function sendmail(email, otp)
{
    try 
    {
        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport
        ({
            service: 'gmail',

            auth: 
            {
                type: 'OAuth2',
                user: MAILER_UN,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        let subject = 'Frostlake Team'
        let content = `${ otp } is your verification code for Frostlake. Please do not share the code with anyone.`
        await transporter.sendMail({ from: MAILER_UN, to: email, subject: subject, html: content }) 
    } 
    
    catch (error) 
    {
        throw error    
    }
}

//Export Statement
module.exports = sendmail