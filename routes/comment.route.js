import express from "express";
import {
    addComment,
    deleteComment,
    deleteReply,
    dislikeComment,
    getComments,
    likeComment,
    replyToComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//add comments
router.post("/", verifyToken, addComment);

// delete comment
router.delete("/delete/:id", verifyToken, deleteComment);

//get comments
router.get("/:videoId", getComments);

// like a comment
router.put("/like/:commentId", verifyToken, likeComment);

// dislike a comment
router.put("/dislike/:commentId", verifyToken, dislikeComment);

// replies
router.put("/reply/:commentId", verifyToken, replyToComment);

// delete replies
router.put("/reply/:commentId/:replyId", verifyToken, deleteReply);

export default router;
