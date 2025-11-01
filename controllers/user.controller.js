const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
class UserClass{
    register= async(req, res)=>{
        try {
            const {username, email, password}=req.body;
            if(!username || !email || !password){
               return res.status(400).json({message:"Incomplete fields, please enter all fields and try again."})
            }
            const userExist= await User.findOne({email});
            if(userExist){
                return res.status(409).json({message:"User already exist with this email"})
            }   
            const hashedPassword= await bcrypt.hash(password, 10);
             const user= await User.create({username, email, password:hashedPassword});
            const token = generateToken({_id: user._id})

            res.status(201).cookie("token", token,{httpOnly:true, sameSite:"strict", secure: process.env.NODE_ENV === "production",  maxAge: 24 * 60 * 60 * 1000 }).json({message:"Account created successfully",  user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    }})
            
        } catch (error) {
           console.log(error) 
           res.status(500).json({message:"Internal server error (register user)"})
        }
    }

    login = async (req, res)=>{
        try{
            console.log("Login request received")
const {email, password}= req.body;
if(!email || !password){
   return res.status(400).json({message:"Incomplete detail, please enter complete details and try again."})
}
const user= await User.findOne({email});
if(!user){
   return res.status(400).json({message:"Email or Password is incorrect"});
}
const isCorrectPassword= await bcrypt.compare(password, user.password);
if(!isCorrectPassword){
       return res.status(400).json({message:"Email or Password is incorrect"});
}
const token= generateToken({_id:user._id});
res.status(200).cookie("token", token,{
    httpOnly:true,
    sameSite:"strict",
    maxAge:24*60*60*1000,
    secure: process.env.NODE_ENV === "production"
}).json({message:"Login successfull", user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        profileImage:user.profileImage,
                         following:user.following,
                         followers:user.followers
                    }, token})
        }catch(err){
             console.log(err)
             res.status(500).json({message:"Internal server error (login user)"})
        }
    }

    logout = async(_, res)=>{
        try{
            res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      }).json({message:"Logout successfully"})
        }catch(err){
            console.log(err)
            res.status(500).json({message:"Internal server error (logout user)"})
        }
    }
getOtherUserProfile=async(req,res)=>{
    
    try {
        const userId= req.params.id;
        if(!userId){
           return res.status(400).json({message:"User id is requried in get by profile"})
        }
       const user = await User.findById(userId).lean()
        if(!user){
           return res.status(404).json({message:`No user is found with this is id ${userId}`})
        }
        res.status(200).json({data:{
            username:user.username,
            profileImage:user.profileImage,
            followers:user.followers?.length || 0,
            following:user.following?.length || 0,
            bio:user.bio,

        }})
    } catch (error) {
      console.error("Error in getOtherUserProfile:", error);
        res.status(500).json({message:"Internal server error (get profile)"})
    }
}
getMyProfile=async(req, res)=>{
    try {
        const id= req.user._id;
        const user =await User.findById(id).select("-password");
        if(!user) return res.status(404).json({message:"User not found", });
        res.status(200).json({message:"Profile found", user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        profileImage:user.profileImage,
                         following:user.following,
                         followers:user.followers
                    }})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

getSuggestedAccounts= async(req, res)=>{
    console.log("Function call")
    try{
        const loginUser = req.user;
        if(!loginUser) return res.status(400).json({message:"No logged in user found"})
const users= await User.find({_id:{$ne:loginUser._id}}).select("username profileImage followersCount followingCount following followers").lean()
        res.status(200).json({users})
    }
    catch(err){
        console.log(`Error in getSuggestedAccounts ${err.message}`);
                res.status(500).json({message:"Internal server error (getSuggestedAccounts)"})

    }
}
followOrUnfollow=async(req, res)=>{
    try{
const loginUserId=req.user._id;
const followUserId=req.params.id;
if(!followUserId || !loginUserId){
    return res.status(400).json({message:"User id looks missing"})
}
if(followUserId == loginUserId){
         return res.status(400).json({message:"You can not follow yourself"})
}
const loginUser= await User.findById(loginUserId);
if(loginUser.following.includes(followUserId)){
   await Promise.all([
User.updateOne( { _id: loginUserId }, {$pull:{following:followUserId}, $inc:{followingCount: -1}}),
User.updateOne( { _id: followUserId }, {$pull:{followers:loginUserId}, $inc:{followersCount: -1}})
    ])

return res.status(200).json({message:"Unfollowed successfully"})
}
else{
    await Promise.all([
User.updateOne({ _id: loginUserId }, {$addToSet:{following:followUserId}, $inc:{followingCount: 1} }),
User.updateOne({ _id: followUserId }, {$addToSet:{followers:loginUserId}, $inc:{followersCount: 1}})
     ])
return res.status(200).json({message:"followed successfully"})

}
    }catch(err){
        console.log(`Error in followOrUnfollow ${err.message}`);
        res.status(500).json({message:"Internal server error (followOrUnfollow)"})
    }
}
 bookMark=async(req, res)=>{
    try {
        const loginId=req.user._id;
        const postId=req.params.postId;
        if(!loginId) return res.status(400).json({message:"login Id required"})
      if(!postId) return res.status(400).json({message:"post id is missing"});
      const loginUser= await User.findById(loginId);
      if(!loginUser){
        return res.status(400).json({message:"No user found"});
      }
      if(!loginUser.bookmark.includes(postId)){
       await User.updateOne({_id:loginId},{$addToSet:{bookmark:postId}})
       res.status(200).json({message:"Bookmarked successfully"})
      }
      else{
       await User.updateOne({_id:loginId},{$pull:{bookmark:postId}})
       res.status(200).json({message:"Bookmarked remove"})
      }
    } catch (error) {
       console.log(error.message) 
       res.status(500).json({message:"Internal server error {bookmark post}"})
    }
 }
getAllUsers=async(_, res)=>{
    try {
        const users = await User.find().select("username email profileImage");
        if(!users || users.length == 0) return res.status(404).json({message:"No users found"});
        console.log("Backend replied")
        return res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message:"Internal server error (get all users)"})
    }
}
}
const UserClassObj= new UserClass()
module.exports={
    UserClassObj
}