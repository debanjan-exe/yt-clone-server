import express from "express";
import {
    addVideo,
    addView,
    deleteVideo,
    getSubVideos,
    getVideo,
    random,
    getByTags,
    search,
    trend,
    updateVideo,
    getByLikes,
} from "../controllers/video.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// create a video
router.post("/", verifyToken, addVideo);

// update a video
router.put("/:id", verifyToken, updateVideo);

// delete a video
router.delete("/:id", verifyToken, deleteVideo);

// get a video
router.get("/find/:id", getVideo);

// add a view
router.put("/view/:id", addView);

// get trending videos
router.get("/trend", trend);

// get random videos
router.get("/random", random);

// get subscribers videos
router.get("/sub", verifyToken, getSubVideos);

// get video by tags
router.get("/tags", getByTags);

// get videos by liked
router.get("/liked", verifyToken, getByLikes);

// get video by title
router.get("/search", search);

export default router;
