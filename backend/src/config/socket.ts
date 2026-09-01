import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

export function initSocketServer(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

    socket.on("join:room", (room: string) => {
      socket.join(room);
      console.log(`⚡ [Socket.io] Client ${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`⚡ [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function broadcastRealtimeNotification(notification: any) {
  if (io) {
    io.emit("notification:new", notification);
  }
}
