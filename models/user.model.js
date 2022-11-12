import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            // required: true,
        },
        img: {
            type: String,
            default:
                "https://res.cloudinary.com/debanjan/image/upload/v1645795943/account_vrj23k.png",
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        subscribedUsers: {
            type: [String],
        },
        fromGoogle: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
