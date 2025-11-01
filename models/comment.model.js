const mongoose =require("mongoose")
const commentSchema= new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    loginId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true
    },
    postId:{
       type:mongoose.Schema.Types.ObjectId, 
       ref:"Post",
       required:true
    }
},{timestamps:true})
const Comments= mongoose.model("Comment", commentSchema)
module.exports={
    Comments
}