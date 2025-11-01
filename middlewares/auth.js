const jwt =require("jsonwebtoken")
const auth=(req, res, next)=>{
    try{
        const token= req.cookies.token;
        if(!token){
         console.log("No token found")
           return res.status(401).json({message:"Unauthorized user"})
        }
        const decoded = jwt.verify(token, process.env.SECRET)
     console.log("Before user decoded")
       req.user=decoded
       console.log("After user decoded")
       next()

    }catch(err){
        console.error(err)
    return res.status(401).json({ message: "Invalid or expired token" });

    }
 }
 module.exports={
    auth
 }