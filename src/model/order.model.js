import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    items: [Object],
    totalAmount: Number,
    currency: String,
    status: { type: String, default: "pending" },
    transaction: { type: Schema.Types.ObjectId, ref: "transactions" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const orderModel = model("orders", orderSchema);
