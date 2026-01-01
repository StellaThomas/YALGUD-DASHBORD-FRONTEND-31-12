import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_BASE_URL.replace("/api", "");

let socket = null;

// ✅ connect ONLY when called
export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    auth: { token },
    autoConnect: true,   // connects now
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected to", SOCKET_URL);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message);
  });

  return socket;
};

// ✅ use in dashboard
export const getSocket = () => socket;

// ✅ logout cleanup
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
