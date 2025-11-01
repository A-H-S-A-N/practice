const mongoose=require("mongoose")
const messageSchema= new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
},
senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
text:{
    type:String,
    required:true
}
})
const messageModel= mongoose.model("Message", messageSchema)
module.exports={
    messageModel
}   