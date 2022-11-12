import express from "express";
import {
    deleteUser,
    dislikeVid,
    getUser,
    likeVid,
    subscribeUser,
    unsubscribeUser,
    updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// update user
router.put("/:id", verifyToken, updateUser);

router.get("/username");

// delete user
router.delete("/:id", verifyToken, deleteUser);

// get user
router.get("/find/:id", getUser);

// subscribe a user
router.put("/sub/:id", verifyToken, subscribeUser);

// unsubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribeUser);

// like a video
router.put("/like/:videoId", verifyToken, likeVid);

// dislike a video
router.put("/dislike/:videoId", verifyToken, dislikeVid);

export default router;
