import { createError } from "../error.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";

export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can only update your account !"));
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can only delete your account !"));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const subscribeUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json("Subscription Successfull.");
    } catch (err) {
        next(err);
    }
};

export const unsubscribeUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id },
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 },
        });
        res.status(200).json("Unsubscription Successfull.");
    } catch (err) {
        next(err);
    }
};

export const likeVid = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (video.likes.includes(id)) {
        try {
            await Video.findByIdAndUpdate(videoId, {
                $pull: { likes: id },
            });
            res.status(200).json("Video has been removed from liked");
        } catch (err) {
            next(err);
        }
    } else {
        try {
            await Video.findByIdAndUpdate(videoId, {
                $addToSet: { likes: id },
                $pull: { dislikes: id },
            });
            res.status(200).json("Video has been liked");
        } catch (err) {
            next(err);
        }
    }
};

export const dislikeVid = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (video.dislikes.includes(id)) {
        try {
            await Video.findByIdAndUpdate(videoId, {
                $pull: { dislikes: id },
            });
            res.status(200).json("Video has been removed from disliked");
        } catch (err) {
            next(err);
        }
    } else {
        try {
            await Video.findByIdAndUpdate(videoId, {
                $addToSet: { dislikes: id },
                $pull: { likes: id },
            });
            res.status(200).json("Video has been disliked");
        } catch (err) {
            next(err);
        }
    }
};
