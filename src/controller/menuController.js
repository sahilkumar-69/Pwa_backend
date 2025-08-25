import RestaurantMenu from "../model/menu.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

// 👉 Add Restaurant with Menu
export const addRestaurantMenu = async (req, res) => {
  try {
    const { restaurant } = req.body;

    if (!restaurant || !restaurant.name || !restaurant.menu) {
      return res
        .status(400)
        .json({ message: "Restaurant name and menu are required." });
    }

    if (req.files && req.files.length > 0) {
      // Wait for all uploads in parallel
      const uploads = await Promise.all(
        req.files.map(async (file) =>
          uploadOnCloudinary(file.path, "RWA_REST_PHOTO")
        )
      );

      // Filter successful uploads
      docs = uploads
        .filter((u) => u.success)
        .map((u) => ({
          public_id: u.response.public_id,
          secure_url: u.response.secure_url,
        }));
    }

    const newMenu = new RestaurantMenu({ restaurant });
    const savedMenu = await newMenu.save();

    return res.status(201).json({
      message: "Restaurant menu added successfully",
      data: savedMenu,
    });
  } catch (error) {
    console.error("Error adding restaurant menu:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// 👉 Get Full Restaurant Menu (or by category)
export const getRestaurantMenu = async (req, res) => {
  try {
    const { category } = req.query; // optional query param ?category=breakfast

    const restaurantData = await RestaurantMenu.findOne();

    if (!restaurantData) {
      return res.status(404).json({ message: "No menu found" });
    }

    if (category) {
      if (restaurantData.restaurant.menu[category]) {
        return res.status(200).json({
          category: category,
          items: restaurantData.restaurant.menu[category],
        });
      } else {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    return res.status(200).json(restaurantData);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
