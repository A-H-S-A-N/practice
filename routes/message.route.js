const express= require("express")
const { messageClassObj } = require("../controllers/message.controller")
const { auth } = require("../middlewares/auth")
const messageRouter= express.Router()
messageRouter.post("/:receiverId/send", auth,messageClassObj.createMessage)
module.exports={
    messageRouter
}