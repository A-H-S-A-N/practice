const express= require("express")
require("dotenv").config()
const cookieParser=require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet");
const { connectDB } = require("./utils/dbConnection");
const { userRouter } = require("./routes/user.route");
const { postRouter } = require("./routes/post.route");
const { commentRouter } = require("./routes/comment.route");
const { messageRouter } = require("./routes/message.route");
const app= express()

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(helmet());
app.use(cors({
   origin:"http://localhost:5173",
   credentials:true
}));
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/message", messageRouter)
app.listen(process.env.PORT, async()=>{
    await connectDB()
    console.log(`Server is running at port ${process.env.PORT}`)
}
)