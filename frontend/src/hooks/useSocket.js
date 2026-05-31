import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socketInstance = null;

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
        {
          transports: ["polling", "websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
          timeout: 10000,
        },
      );

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
      });

      socketInstance.on("connect_error", (err) => {
        console.log("Socket connection error:", err.message);
      });
    }
    socketRef.current = socketInstance;

    return () => {};
  }, []);

  return socketRef;
};
