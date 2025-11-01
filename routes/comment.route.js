const express= require("express")
const { commentClassObj } = require("../controllers/comment.controller")
const { auth } = require("../middlewares/auth")
const commentRouter= express.Router()

commentRouter.post("/:postId/create",auth, commentClassObj.create);
commentRouter.delete("/:commentId/delete",auth, commentClassObj.delete)
commentRouter.put("/:commentId/update",auth, commentClassObj.update)
module.exports={
    commentRouter
}