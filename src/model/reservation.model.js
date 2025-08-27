// models/Reservation.js
import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    enum: ["8.00", "8.30", "9.00", "9.30", "12.00", "12.30", "1.00", "1.30"],
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  phone: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reservation", ReservationSchema);
