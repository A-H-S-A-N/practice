const mongoose =require("mongoose")

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likes:[
        {type:mongoose.Schema.Types.ObjectId, ref:"User"}
    ],
    comment:[
        {
        type:mongoose.Schema.Types.ObjectId, ref:"Comment",
        }
    ],
    likesCount:{
        type:Number,
        default:0
    }
})
const post= mongoose.model("Post", postSchema)
module.exports={
    post
}

