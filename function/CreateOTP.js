//Create OTP function
const createOtp = () =>
{
    const otp = (Math.random() * Math.pow(10, 10)).toString().slice(0,6)
    return otp
}

//Export Statement
module.exports = createOtp