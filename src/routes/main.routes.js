import express from "express";
import {
  addRestaurantMenu,
  getRestaurantMenu,
} from "../controller/menuController.js";
import { uploadPhotoOnly } from "../utils/multer.js";

const router = express.Router();

// Add restaurant & menu
router.post("/menu", uploadPhotoOnly.array("img"), addRestaurantMenu);

// Get menu (full or by category)
router.get("/menu", getRestaurantMenu);

export default router;
