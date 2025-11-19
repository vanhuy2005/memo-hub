import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import confetti from "canvas-confetti";

/**
 * Socket Context - Real-time communication with server
 *
 * Purpose: Connect to Socket.io server and listen for events
 * Features:
 * - Auto-connect/disconnect based on auth status
 * - Join user-specific room for targeted notifications
 * - Listen for level-up events and trigger confetti
 * - Toast notifications for real-time updates
 */

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get auth token from localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
      console.log("⚠️ No auth token, skipping Socket.io connection");
      return;
    }

    // Initialize Socket.io connection
    const socketInstance = io(
      import.meta.env.VITE_API_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket", "polling"], // Prefer WebSocket, fallback to polling
      }
    );

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ Socket.io connected:", socketInstance.id);
      setIsConnected(true);

      // Join user-specific room
      socketInstance.emit("join", user.id);
      console.log(`👤 Joined room: user:${user.id}`);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 Socket.io disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket.io connection error:", error);
      setIsConnected(false);
    });

    // Level-up event listener
    socketInstance.on("level-up", (data) => {
      console.log("🎊 Level-up event received:", data);

      // Trigger confetti celebration
      if (data.confetti) {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: ["#B5C99A", "#86A789", "#FFE5E5", "#FFF4E0"],
          ticks: 300,
          gravity: 1.2,
        });

        // Second wave of confetti
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#B5C99A", "#86A789"],
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#FFE5E5", "#FFF4E0"],
          });
        }, 300);
      }

      // Show toast notification (if toast library is available)
      if (window.toast) {
        window.toast({
          title: `🎊 Level Up! Bạn vừa đạt Level ${data.newLevel}!`,
          description: `Tổng XP: ${data.totalXP} | Tiền thưởng: +${data.currency} coins`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Fallback to alert if no toast
        console.log(
          `🎊 Level ${data.newLevel}! XP: ${data.totalXP}, Currency: +${data.currency}`
        );
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log("🛑 Disconnecting Socket.io");
      socketInstance.disconnect();
    };
  }, []); // Empty deps: only run once on mount

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
