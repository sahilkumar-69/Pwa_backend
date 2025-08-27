import express from "express";
import {
  addRestaurantMenu,
  createNewReservation,
  deleteReservation,
  getReservation,
  getReservationById,
  getRestaurantMenu,
  login,
  signup,
} from "../controller/menuController.js";
import { uploadPhotoOnly } from "../utils/multer.js";

const router = express.Router();

// Add restaurant & menu
router.post("/menu", uploadPhotoOnly.array("img"), addRestaurantMenu);

// Get menu (full or by category)
router.get("/menu", getRestaurantMenu);

router.post("/book-table", createNewReservation);

router.post("/login", login);

router.post("/signup", signup);

router.get("/get-table", getReservation);

router.delete("/delete-table", deleteReservation);

router.get("/get-table/:id", getReservationById);






export default router;
