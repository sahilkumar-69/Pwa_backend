import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }],
  cuisine: { type: String },
  description: { type: String },
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

const subCategorySchema = new mongoose.Schema({
  subcategory: { type: String, required: true }, // e.g., "South Indian"
  items: [menuItemSchema],
});

const menuCategorySchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "🥞 Breakfast"
  items: [subCategorySchema], // subcategories inside it
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  menu: [menuCategorySchema],
});

export default mongoose.model("RestaurantMenu", restaurantSchema);
