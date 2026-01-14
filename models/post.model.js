const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    slug:{
         type: String,
      unique: true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    published: {
      type: Boolean,
      default: true,
    },


},{timestamps:true})

module.exports = mongoose.model("post" , postSchema)