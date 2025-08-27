import RestaurantMenu from "../model/menu.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import Reservation from "../model/reservation.model.js";
import { User } from "../model/user.model.js";
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

// Create new reservation
export const createNewReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res
      .status(201)
      .json({ message: "Reservation created successfully", reservation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reservations (admin use)
export const getReservation = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reservation by ID
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel (delete) reservation
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: "Reservation cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, phone, address, pincode, password } = req.body;

    // check all required fields
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // create new user
    const user = new User({
      name,
      email,
      phone,
      address,
      pincode,
      password,
    });

    await user.save();

    // generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
