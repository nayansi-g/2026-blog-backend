const express = require("express")
const app = express()
app.use(express.json())
const cors = require("cors")
app.use(cors("dev"))
const port = process.env.PORT || 8000
const authenticatedUser = require("./authentication/auth")
const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/comment.route")

const connection = require("./connection/connection")
connection();

// app.use("/fast-response", (req, res)=>{
//     res.json("Fast Response")
// })

// app.use("/slow-response",  async (req, res)=>{
//     let count = 150000;
//      for(let i = 0; i <= count; i++){
//         fs.readFileSync("./new.txt")
//      };
//     res.json("Response")
// })

app.use("/uploads", express.static("uploads"));
app.use("/user", userRouter)
// app.get("/" , (req,res)=>{
//     res.send("this is my first app")
// });
app.use("/posts", postRouter)
app.use("/comments", commentRouter)

app.listen(port,(err)=>{
    if(!err){
        console.log(`app is started ${port}`)
    }else{
        console.log("app is not running")
    }
})