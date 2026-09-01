import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
    socket = io(backendUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("⚡ [Socket.io Client] Connected to real-time server");
    });
  }
  return socket;
}

export function subscribeToNotifications(callback: (notification: any) => void) {
  const s = getSocket();
  s.on("notification:new", callback);
  return () => {
    s.off("notification:new", callback);
  };
}
