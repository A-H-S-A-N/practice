const { conversationModel } = require("../models/conversation.model");
const { messageModel } = require("../models/message.model");

class MessageClass{
    createMessage=async(req, res)=>{
        try {
            const loginId= req.user._id;
            const {text}=req.body;
            const receiverId= req.params.receiverId;
            let conversation_Exist;
    if(!loginId || !receiverId) return res.status(400).json({message:"User Id missing"})
         conversation_Exist= await conversationModel.findOne({
    members:{$all:[loginId, receiverId]}
    })
    if(!conversation_Exist){
         conversation_Exist=await conversationModel.create({members:[loginId, receiverId]})
        if(!conversation_Exist) return res.status(400).json({message:"Failed to create conversation"})
    }
 const message_send= await messageModel.create({
    text,
    senderId:loginId,   
    conversationId: conversation_Exist._id
 })
 if(!message_send){
    return res.status(400).json({message:"Failed to send message"})
 }
 return res.status(200).json({message:"Messsage sent successfully"})
        } catch (error) {
           console.log(error.message) 
           res.status(500).json({message:"Internal server error {create message}"})
        }
    }
}
const messageClassObj=new MessageClass()
module.exports={
    messageClassObj
}