import Razorpay from "razorpay";
import crypto from "crypto";
import { order as Transaction } from "../model/transaction.model.js";
import { orderModel } from "../model/order.model.js";

import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const createOrderId = async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "USD",
      receipt: `receipt_order_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// Verify and store payment
const verifyTransaction = async (req, res) => {
  try {
    const { response, product } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    const user_id = req.user._id;

    if (!user_id) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    const generated_signature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      const order = new orderModel({
        user: user_id,
        items: product,
        totalAmount: payment.amount,
        currency: payment.currency,
        status: "ordered",
      });

      // console.log("order", order);

      const Transactions = new Transaction({
        razorpay_order_id,
        razorpay_payment_id,
        user_id,
        razorpay_signature,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        email: payment.email,
        contact: payment.contact,
        method: payment.method,
        order: order._id,
      });

      // console.log("Transaction", Transaction);

      order.transaction = Transactions._id;

      const isOrderSaved = await order.save();

      // console.log("isOrderSaved", isOrderSaved);

      const isTransactionSaved = await Transactions.save();

      // console.log("isTransactionSaved", isTransactionSaved);

      res.json({ success: true, message: "Payment verified and saved" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

export { createOrderId, verifyTransaction };
