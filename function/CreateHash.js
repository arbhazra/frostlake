//Import Statements
const bcrypt = require('bcryptjs')

//Create Hash Function
const createHash = async(normalString) =>
{
    try 
    {
        const hashedString = await bcrypt.hash(normalString, 12)
        return hashedString
    } 
    
    catch (error) 
    {
        throw error
    }
}

//Export Statement
module.exports = createHash