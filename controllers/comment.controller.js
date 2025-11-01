const { Comments } = require("../models/Comment.model");
const { post } = require("../models/post.model");

class CommentClass{
    create=async(req, res)=>{
        try {
            const loginId=req.user._id;
            const postId=req.params.postId;
            const {text}= req.body;
            if(!loginId || !postId || !text){
                return res.status(400).json({message:"Required fields missing"})
            }
            
            const commentAdded=await Comments.create({loginId, postId, text});
            if(!commentAdded){
                return res.status(400).json({message:"Failed to add comment"})
            }
                await post.updateOne({_id:postId}, {$addToSet:{comment:commentAdded._id}})
                await res.status(201).json({message:"Comment added successfully"})
        } catch (error) {
         console.log(error.message  )   
         res.status(500).json({message:"Internal server error {comment}"})
        }   
    }
    delete=async(req, res)=>{
        try {
           const commentId=req.params.commentId;
           const loginId=req.user._id;
           if(!commentId){
            return res.status(400).json({message:"Comment Id is missing"});
           }
           const commentFound= await Comments.findById(commentId);
           if(!commentFound){
            return res.status(404).json({message:"Comment not found"});
           }
           if(!commentFound.loginId.equals(loginId)){
            return res.status(403).json({message:"You can only delete your own comments"})
           }
           const commentDeleted = await Comments.findByIdAndDelete(commentId);
           if(!commentDeleted){
            return res.status(400).json({message:"Failed to delete comment"})
           }
           await post.updateOne({_id:commentDeleted.postId}, {$pull:{comment:commentId}})
           return res.status(200).json({message:"Comment deleted successfully"})
        } catch (error) {
          console.log(error)  
          res.status(500).json({message:"Internal server error {delete comment} "})
        }
    }
    update=async(req, res)=>{
        try {
            const loginId=req.user._id;
            const {text}=req.body;
            if(!text) return res.status(400).json({message:"Please write new comment to update"});
            const commentId=req.params.commentId;
            if(!commentId){
               return res.status(400).json({message:"Comment Id is missing"});
            }
            const commentFound= await Comments.findById(commentId);
            if(!commentFound) return res.status(404).json({message:"No comment found to update."})
            if(!commentFound.loginId.equals(loginId)) return res.status(403).json({message:"You can update your comments only"});
            await Comments.updateOne({_id:commentId}, {$set:{text:text}})
            res.status(200).json({message:"Comment updated successfully"})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({message:"Internal server error {update user}"})
        }
    }
}
const commentClassObj= new CommentClass()
module.exports={
    commentClassObj
}