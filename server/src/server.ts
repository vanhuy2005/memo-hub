import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/database";
import { errorHandler, notFound } from "./middlewares/error.middleware";

// Import routes
import authRoutes from "./routes/auth.routes";
import deckRoutes from "./routes/deck.routes";
import cardRoutes from "./routes/card.routes";
import studyRoutes from "./routes/study.routes";
import systemDeckRoutes from "./routes/systemDeck.routes";

// Import workers and queue scheduler (MUST import to start processing)
import emailWorker from "./workers/emailWorker";
import { scheduleDailyReminders } from "./config/queue";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "MemoHub API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/system-decks", systemDeckRoutes);

// Error handlers (Must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Create HTTP server for Socket.io
const httpServer = http.createServer(app);

// Initialize Socket.io
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // User joins their personal room (for targeted notifications)
  socket.on("join", (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`👤 User ${userId} joined room: user:${userId}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Schedule daily email reminders (9:00 AM Vietnam Time)
    await scheduleDailyReminders();
    console.log("📅 Daily reminder job scheduled");

    // Log worker status (worker starts automatically when imported)
    console.log(
      `📧 Email worker status: ${emailWorker ? "✅ Active" : "❌ Inactive"}`
    );

    // Start listening (use httpServer instead of app)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/health`);
      console.log(`⚡ Socket.io ready for real-time events`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
