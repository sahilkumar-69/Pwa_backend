import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  image: String,
  cuisine: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  spice_level: {
    type: String,
    enum: ["Mild", "Medium", "Hot"],
    default: "Mild",
  },
  veg: { type: Boolean, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
});

const menuSchema = new mongoose.Schema({
  restaurant: {
    name: { type: String, required: true },
    image: String,
    location: { type: String, required: true },
    contact: { type: String, required: true },
    menu: [
      {
        breakfast: [menuItemSchema],
        beverages: [menuItemSchema],
        dinner: [menuItemSchema],
        desserts: [menuItemSchema],
      },
    ],
  },
});

export default mongoose.model("RestaurantMenu", menuSchema);
