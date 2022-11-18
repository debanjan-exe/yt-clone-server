import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

//SIGNUP
export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashedPass });

        await newUser.save();
        // res.status(200).send("User has been created !!");
        const user = await User.findOne({ email: req.body.email });
        const { password, ...others } = user._doc;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ access_token: token, ...others });
    } catch (err) {
        next(err);
    }
};

//SIGNIN
export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found"));
        const { password, ...others } = user._doc;
        const isCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isCorrect) return next(createError(400, "Wrong credentials"));

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ access_token: token, ...others });
    } catch (err) {
        next(err);
    }
};

//GOOGLE SIGNIN

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });

            const savedUser = await newUser.save();

            const token = jwt.sign(
                { id: savedUser._id },
                process.env.JWT_SECRET
            );
            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json(savedUser._doc);
        }
    } catch (err) {
        next(err);
    }
};

//LOGOUT

export const logout = async (req, res, next) => {
    // Set token to none and expire after 5 seconds
    res.cookie("access_token", undefined, {
        httpOnly: true,
    })
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
};
