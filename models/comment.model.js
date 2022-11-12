import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const CommentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        videoId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        likes: {
            type: [String],
            default: [],
        },
        dislikes: {
            type: [String],
            default: [],
        },
        replies: {
            type: [replySchema],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
