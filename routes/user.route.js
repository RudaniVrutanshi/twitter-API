import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  updateUser,
  getSuggestedUsers,
  followunfollowUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followunfollowUser);
router.post("/update", protectRoute, updateUser);

export default router;
