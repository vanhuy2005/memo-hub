import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/memohub";

    await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    // Event listeners
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB Error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB Disconnected");
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};
