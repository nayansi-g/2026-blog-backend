const express = require("express")

const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticatedUser = require("../authentication/auth")

const User = require("../models/user.model")

//signup
router.post("/signup", async (req,res)=>{
    console.log("route called")
    try {
        const {userName, email,password} = req.body

        const hashPassword = await bcrypt.hash(password,10)

         if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

        const userExists = await User.findOne({email})
        if(userExists){
         return  res.status(400).json({message:"User already exists"})
        }
              const user = await User.create({ userName, email, password:hashPassword})
              res.status(200).json({message:"User has been created",
                userName: user.userName,
                email: user.email,
                token: jwt.sign({ _id: user._id, userName: user.userName, role: user.role}, "JWT_SECRET")
              })
      

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error in creating User",
            error
        })
    }
})


//login 

router.post("/login", async (req,res)=>{
    try {
        const {email,password} = req.body
        
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

        const user = await User.findOne({email})
        if(!user){
            return  res.status(401).json({message:"email is not valid"})
        }
         const validuser = await bcrypt.compare(password ,user.password)
            if(!validuser){
                return res.status(401).json({message:"user is not valid"})
            }             
             
              res.status(200).json({message:"login successful",
                    token: jwt.sign({ _id: user._id, userName: user.userName, role: user.role}, "JWT_SECRET")
                })            
        
    } catch (error) {
        res.status(404).json({message:"user is not found"})
    }
})


router.get("/validate-user" ,authenticatedUser, async(req,res)=>{
    if(!req.user) {
        res.status(401)
    }else if(req.user.role == "admin"){
        res.status(200).json({role:"admin"})
    }else{
        res.status(200).json({role:"user"})
    }
})

module.exports = router;