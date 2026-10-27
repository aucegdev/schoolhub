import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
    socket = io(backendUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: {
        token: localStorage.getItem("token"),
      },
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

export interface RealtimeChange {
  entity: string;
  operation: string;
  recordId?: string;
  record?: unknown;
}

export function subscribeToDataChanges(callback: (change: RealtimeChange) => void) {
  const s = getSocket();
  s.on("data:changed", callback);
  return () => {
    s.off("data:changed", callback);
  };
}
