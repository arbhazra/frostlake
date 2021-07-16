//Import Statements
const bcrypt = require('bcryptjs')

//Compare Password function
const compareHash = async(normalString, hashedString) =>
{
    try 
    {
        const isCorrect = await bcrypt.compare(normalString, hashedString)
        return isCorrect
    } 
    
    catch (error) 
    {
        throw error
    }
}

//Export Statement
module.exports = compareHash