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
  },
  people: {
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

  additionalInfo: {
    type: String,
  },
  table: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  terms: {
    type: Boolean,
    require: true,
  },
});

export default mongoose.model("Reservation", ReservationSchema);
