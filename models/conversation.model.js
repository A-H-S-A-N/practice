const mongoose=require("mongoose")

const coversationSchema=new mongoose.Schema({
    members:[
        {type:mongoose.Schema.Types.ObjectId, 
       ref:"User"}
    ]
},{timestamps:true})
const conversationModel=mongoose.model("Conversation", coversationSchema)
module.exports={
    conversationModel
}