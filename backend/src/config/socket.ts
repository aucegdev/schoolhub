import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "./firebase";

let io: SocketIOServer | null = null;

export interface RealtimeChange {
  entity: string;
  operation: string;
  recordId?: string;
  record?: unknown;
}

export function initSocketServer(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      next(new Error("Authentication required"));
      return;
    }

    const jwtSecret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === "development" ? "schoolhub-dev-secret" : undefined);
    if (jwtSecret) {
      try {
        socket.data.user = jwt.verify(token, jwtSecret);
        next();
        return;
      } catch {
        // Try Firebase verification below.
      }
    }

    const firebaseApp = getFirebaseAdminApp();
    if (!firebaseApp) {
      next(new Error("Authentication service unavailable"));
      return;
    }

    try {
      socket.data.user = await getAuth(firebaseApp).verifyIdToken(token);
      next();
    } catch {
      next(new Error("Invalid authentication token"));
    }
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

export function broadcastRealtimeChange(change: RealtimeChange) {
  if (io) {
    io.emit("data:changed", change);
  }
}
