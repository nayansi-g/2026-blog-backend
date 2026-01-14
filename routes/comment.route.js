const Post = require("../models/post.model")
const authenticatedUser = require("../authentication/auth")
const Comment = require("../models/comment.model")

const express = require("express")
const router = express.Router();


router.post("/:postId", authenticatedUser, async (req, res) => {
    try {
        const { text } = req.body
        const post = await Post.findById(req.params.postId);
        if (!post || !post.published) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.create({
            text, post: post._id,
            user: req.user.id,
        })
        res.status(200).json({ message: "comment created successfully", comment })

    } catch (error) {
        res.status(500).json({ message: "comment not created" })
    }
})

router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ post:req.params.postId}).populate("user", "userName")
            .sort({ createdAt: -1 });
        res.status(200).json(comments)

    } catch (error) {
        res.status(500).json({ message: "comment not found" })
    }
})

router.delete("/:id", authenticatedUser, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "comment not found" });
        }

        if (
            comment.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        const deletedComment = await comment.deleteOne()
        res.status(200).json({ message: "comment deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: "comment not deleted" })
    }
})




module.exports = router;