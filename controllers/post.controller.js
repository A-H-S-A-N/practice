const { post } = require("../models/post.model");

class PostClass{
    create=async(req,res)=>{
        try {
            const author= req.user._id;
            const {caption, image}=req.body;
            if(!caption || !image){
                return res.status(400).json({title:"Incomplete request", message:"Please enter complete detail and try again"})
            }
           const postCreated= await post.create({caption, image, author})
       return res.status(201).json({postCreated})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({message:"Internal server error (create Post)"})
        }
    }
    findAllPosts=async (req, res)=>{
        try {
            const posts= await post.find().populate({path:"author", select:"username text  email profileImage"}).populate({path:"comment", select:"text",options:{sort:{createdAt:-1}}, populate:{path:"loginId", select:"username profileImage email"}}).sort({createdAt:-1});
            if(posts && posts.length>0 ) return res.json({posts})
            else{
           return res.status(404).json({message:"No post found"})
            }
            
        } catch (error) { 
            console.log(error)
            res.status(500).json({message:"Internal server error (get all post)"})
        }
    }
    delete =async(req, res)=>{
        try{
        const postId= req.params.id;
        const loginId=req.user._id
        console.log("author", loginId)
        if(!postId){
            return res.status(404).json({message:"post id is required to delete it."})
        }
        const postFound= await post.findOne({_id: postId});
        if(!postFound){
            res.status(404).json({message:"No post found"})
        }
        if(!postFound.author.equals(loginId)){
             return res.status(400).json({message:"You can only delete your own posts"})
        }
        const deleted= await post.findOneAndDelete({_id: postId, author:loginId});
        if(!deleted){
           return res.status(400).json({message:"Failed to delete post"})
        }
        return res.status(200).json({message:"Post deleted successfully!"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error {delete post}"})
    }
}
 selectedUserPost=async (req, res)=>{
    try {
        const id=req.params.id;
        if(!id) return res.status(404).json({message:"Id is missing"});
        const posts=await post.find({author:id}).populate({path:"author", select:"username profileImage"}).populate({path:"comment", select: "text loginId",populate:{path:"loginId", select:"username profileImage"}});
         if(!posts) return res.status(404).json({message:"No post found with this Id"})
      return res.status(200).json({posts})
    } catch (error) {
       console.log(error) 
       res.status(500).json({message:"Failed to get selected user Posts"})
    }
 }
 like=async(req, res)=>{
    try {
        const id= req.params.id;
        const loginId= req.user._id;
        const postfound= await post.findOne({_id:id});
        if(!postfound){
            return res.status(404).json({message:"No post found"})
        }
        if(postfound.likes.includes(loginId)){
           await post.updateOne({_id:id}, {$pull:{likes:loginId}, $inc:{likesCount:-1}})
            return res.status(200).json({message:"Post dislike"})
        }
        else{
            await post.updateOne({_id:id}, {$addToSet:{likes:loginId}, $inc:{likesCount:1}})
            return res.status(200).json({message:"Post liked"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error {like post}"})
    }
 }
}
const PostClassObj= new PostClass()
module.exports={
    PostClassObj
}