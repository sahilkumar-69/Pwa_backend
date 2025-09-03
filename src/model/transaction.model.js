import { Schema, model } from "mongoose";

const order_schema = new Schema(
  {
    razorpay_payment_id: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    order: { type: Schema.Types.ObjectId, ref: "orders" },
    razorpay_order_id: { type: String },
    razorpay_signature: { type: String },
    amount: { type: Number },
    currency: { type: String },
    status: { type: String },
    email: { type: String },
    contact: { type: String },
    method: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const order = model("transactions", order_schema);
