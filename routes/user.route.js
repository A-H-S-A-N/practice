 const express= require("express")
 const {auth} =require("../middlewares/auth.js")
const { UserClassObj } = require("../controllers/user.controller")

 const userRouter= express.Router()
 userRouter.post("/register", UserClassObj.register);
 userRouter.post("/login", UserClassObj.login);
 userRouter.get("/logout", UserClassObj.logout);
 userRouter.get("/me", auth, UserClassObj.getMyProfile)
userRouter.get("/profile/:id",auth,  UserClassObj.getOtherUserProfile);
userRouter.get("/suggested/accounts",auth, UserClassObj.getSuggestedAccounts)
userRouter.get("/followOrUnfollow/:id", auth ,UserClassObj.followOrUnfollow)
userRouter.post("/bookmarked/:postId", auth ,UserClassObj.bookMark)
userRouter.get("/", UserClassObj.getAllUsers)
 module.exports={
    userRouter
 } 