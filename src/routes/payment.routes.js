import express from "express";
import {
  createOrderId,
  verifyTransaction,
} from "../controller/payment.controller.js";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();

router.route("/create-order").post(verifyToken, createOrderId);

router.route("/verify").post(verifyToken, verifyTransaction);

export default router;
