import { createError } from "../error.js";
import Comment from "../models/comment.model.js";
import Video from "../models/video.model.js";

export const addComment = async (req, res, next) => {
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    try {
        const savedComment = await newComment.save();
        res.status(200).send(savedComment);
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById(comment.videoId);

        if (req.user.id === comment.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("The comment has been deleted !");
        } else {
            next(createError(403, "You can delete only your comments"));
        }
    } catch (err) {
        next(err);
    }
};

export const getComments = async (req, res, next) => {
    const { sort } = req.query;

    try {
        if (sort == "new") {
            // Sort by new
            const comments = await Comment.find({
                videoId: req.params.videoId,
            }).sort({ createdAt: -1 });
            res.status(200).json(comments);
        } else if (!sort || sort == "") {
            // Top comments
            const comments = await Comment.find({
                videoId: req.params.videoId,
            });
            res.status(200).json(comments);
        }
    } catch (err) {
        next(err);
    }
};

export const likeComment = async (req, res, next) => {
    const id = req.user.id;
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (comment.likes.includes(id)) {
        try {
            await Comment.findByIdAndUpdate(commentId, {
                $pull: { likes: id },
            });
            res.status(200).json("Comment has been unliked");
        } catch (err) {
            next(err);
        }
    } else {
        try {
            await Comment.findByIdAndUpdate(commentId, {
                $addToSet: { likes: id },
                $pull: { dislikes: id },
            });
            res.status(200).json("Comment has been liked");
        } catch (err) {
            next(err);
        }
    }
};

export const dislikeComment = async (req, res, next) => {
    const id = req.user.id;
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (comment.dislikes.includes(id)) {
        try {
            await Comment.findByIdAndUpdate(commentId, {
                $pull: { dislikes: id },
            });
            res.status(200).json("Comment has been undisliked");
        } catch (err) {
            next(err);
        }
    } else {
        try {
            await Comment.findByIdAndUpdate(commentId, {
                $addToSet: { dislikes: id },
                $pull: { likes: id },
            });
            res.status(200).json("Comment has been disliked");
        } catch (err) {
            next(err);
        }
    }
};

export const replyToComment = async (req, res, next) => {
    // get the reply text, _id of logged user
    const replyText = req.body.replyDesc;
    const id = req.user.id;
    const commentId = req.params.commentId;

    // find the specific comment in the collection
    const comment = await Comment.findById(commentId);

    // push to comment.replies { desc, userId }
    try {
        await Comment.findByIdAndUpdate(comment._id, {
            $push: { replies: { userId: id, desc: replyText } },
        });
        res.status(200).json("you have replied to a comment");
    } catch (err) {
        next(err);
    }
};

export const deleteReply = async (req, res, next) => {
    const id = req.user.id;
    const replyId = req.params.replyId;
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);

    try {
        await Comment.findByIdAndUpdate(comment._id, {
            $pull: { replies: { _id: replyId } },
        });
        res.status(200).json("you have deleted a reply");
    } catch (error) {
        next(error);
    }
};
