import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socketInstance = null;

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io("http://localhost:5000", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }
    socketRef.current = socketInstance;

    return () => {};
  }, []);

  return socketRef;
};
