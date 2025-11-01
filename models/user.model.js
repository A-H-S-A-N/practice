    const mongoose=require("mongoose")

    const userSchema = new mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim: true
        },
        password:{
            type:String,
            required:true,
        },
        profileImage:{
            type:String,
            default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
        },
        followers:[
            {type:mongoose.Schema.Types.ObjectId, ref:"User"}
        ],
        following:[
            {type:mongoose.Schema.Types.ObjectId, ref:"User"}
        ],
        gender:{
            type:String,
            enum:["Male", "Female", "Others", ""],
            default:""
        },
        bio:{
            type:String,
            default:""
        },
          followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
        bookmark:[
            {type:mongoose.Schema.Types.ObjectId, ref:"Post"}
        ]
    },  { timestamps: true })
    const User = mongoose.model("User", userSchema)
    module.exports={
        User
    }