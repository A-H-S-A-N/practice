const jwt = require("jsonwebtoken");
const generateToken= (payLoad)=>{
    try{
        const token= jwt.sign(payLoad, process.env.SECRET, {expiresIn:"1d"})
        return token
    }catch(err){
        console.log(err)
        return null
    }
}
module.exports={
    generateToken
}