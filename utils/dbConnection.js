const mongoose =require("mongoose")
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.DB_URI)
        console.log("Connected to Database");
    }
    catch(err){
        console.log("Failed to connect database");
        console.log(err.message)
    }
}
module.exports={connectDB};