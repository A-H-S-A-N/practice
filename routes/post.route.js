const express =require("express")
const { PostClassObj } = require("../controllers/post.controller");
const { auth } = require("../middlewares/auth");

const postRouter= express.Router()

postRouter.post("/create",auth, PostClassObj.create);
postRouter.delete("/:id/delete", auth, PostClassObj.delete);
postRouter.get("/:id/like", auth, PostClassObj.like)
postRouter.get("/", PostClassObj.findAllPosts)
postRouter.get("/:id", PostClassObj.selectedUserPost)
module.exports={ postRouter}