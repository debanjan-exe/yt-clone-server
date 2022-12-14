import express from "express";
import {
    googleAuth,
    logout,
    signin,
    signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

//create a user
router.post("/signup", signup);

//sign in
router.post("/signin", signin);

//google auth
router.post("/google", googleAuth);

//logout
router.get("/logout", logout);

export default router;
