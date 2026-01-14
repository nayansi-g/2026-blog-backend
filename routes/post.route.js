const Post = require("../models/post.model")
const authenticatedUser = require("../authentication/auth")
const upload = require("../middlewares/multer")

const express = require("express")
const router = express.Router();

router.post("/admin/create", authenticatedUser, upload.single("image"), async (req, res) => {
    try {
        if (!req.user.isAdmin) {
           return res.status(401).json({ messgae: "THis is User and cannot post" })
        } else {
            const { title, description, body,category } = req.body;
            if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }
            const createdPost = await Post.create({
                title, body, category, description,
                image: req.file.filename,
                slug: title.toLowerCase().replace(/ /g, "-"),
                published: req.user.role === "admin"
            })
            res.status(200).json({
                message: "post created successfully",
                post:createdPost
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "post is not created", error
        })
    }
})

router.get("/", async (req, res) => {
    try {
        const getAllPosts = await Post.find({ published: true });
        res.status(200).json({ getAllPosts: getAllPosts })
    } catch (error) {
        res.status(500).json({ message: "post not found", error })
    }

})

router.get("/:id", async (req, res) => {
    try {
        const getSinglePost = await Post.findOne({ _id: req.params.id });
        res.status(200).json({ getSinglePost: getSinglePost })
    } catch (error) {
        res.status(500).json({ message: "post not found", error })
    }

})

router.put("/update/:id",upload.single("image"), authenticatedUser, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
          return  res.status(401).json({ messgae: "THis is User and cannot update post" })
        } else {
            const { title, description, body,category } = req.body;
            const updatedPost = await Post.findOneAndUpdate({ _id: req.params.id }, { title, description,category, body }, { new: true })
            res.status(200).json({
                message: "post updated successfully",
                updatedPost: updatedPost
            })
        }
    } catch (Err) {
        res.status(500).json({
            message: "post is not updated", Err
        })
    }
})

router.delete("/delete/:id", authenticatedUser, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
          return  res.status(401).json({ messgae: "THis is User and cannot delete post" })
        } else {
            const deletedPost = await Post.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({
                message: "post deleted successfully"
            })
        }
    } catch (Err) {
        res.status(500).json({
            message: "post is not deleted", Err
        })
    }
})



router.post("/like/:postId",authenticatedUser,async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            const userId = req.user.id;

            const alreadyLiked = post.likes.includes(userId);

            if (alreadyLiked) {
                post.likes.pull(userId); // unlike
            } else {
                post.likes.push(userId); // like
            }

            await post.save();

            res.json({
                liked: !alreadyLiked,
                totalLikes: post.likes.length,
            });
        } catch (error) {
            res.status(500).json({ message: "Like failed", error });
        }
    }
);


module.exports = router