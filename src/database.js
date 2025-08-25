import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
  } catch (error) {
    console.error("ERROR !", error);
    process.exit(1);
  }
}

export { connectDB };
