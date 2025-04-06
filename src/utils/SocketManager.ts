import { Server as HttpServer } from "http";
import {
  Server as SocketServer,
  Socket,
  ServerOptions as SocketServerOptions,
} from "socket.io";

const defaultSocketOptions = {
  cors: { origin: "*", methods: ["GET", "POST"] },
};

class SocketManager {
  private static io: SocketServer;
  private static sockets: Map<string, Socket> = new Map(); // Store multiple sockets
  private static onConnection: (socket: Socket) => void = () => {};

  constructor(
    server: HttpServer,
    options: Partial<SocketServerOptions> = defaultSocketOptions
  ) {
    if (!SocketManager.io) {
      SocketManager.io = new SocketServer(server, options);
      console.log("Socket.io initialized");
      SocketManager.io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Store socket with its ID
        SocketManager.sockets.set(socket.id, socket);

        // Call the onConnection callback if provided
        SocketManager.onConnection?.(socket);

        console.log(
          "Sockets:",
          Array.from(SocketManager.sockets.entries()).map(([id]) => id)
        );

        socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.id}`);
          SocketManager.sockets.delete(socket.id);
        });
      });
    }
  }

  // Get the Socket.io instance
  static getIO(): SocketServer {
    if (!SocketManager.io) throw new Error("Socket.io not initialized!");
    return SocketManager.io;
  }

  static onConnect(callback: (socket: Socket) => void) {
    this.onConnection = callback;
  }

  // Get a specific socket by ID
  static getSocket(socketId: string): Socket | undefined {
    return SocketManager.sockets.get(socketId);
  }

  // Emit to all clients
  static emit(event: string, data: any) {
    SocketManager.io.emit(event, data);
  }

  // Emit to a specific socket
  static emitToSocket(socketId: string, event: string, data: any) {
    const socket = SocketManager.getSocket(socketId);
    if (socket) socket.emit(event, data);
  }

  // Listen to an event on the server
  static on(event: string, callback: (...args: any[]) => void) {
    SocketManager.io.on(event, callback);
  }

  // Emit to a specific room
  static emitToRoom(room: string, event: string, data: any) {
    SocketManager.io.to(room).emit(event, data);
  }

  // Join a room
  static joinRoom(socketId: string, room: string) {
    const socket = SocketManager.getSocket(socketId);
    if (socket) socket.join(room);
  }

  // Leave a room
  static leaveRoom(socketId: string, room: string) {
    const socket = SocketManager.getSocket(socketId);
    if (socket) socket.leave(room);
  }

  // Check if a user is in a room
  static inRoom(socketId: string, room: string): boolean {
    const socket = SocketManager.getSocket(socketId);
    return socket ? socket.rooms.has(room) : false;
  }

  // Get all rooms a user is in
  static rooms(socketId: string): string[] {
    const socket = SocketManager.getSocket(socketId);
    return socket ? Array.from(socket.rooms) : [];
  }

  // Disconnect a specific socket
  static disconnect(socketId: string) {
    const socket = SocketManager.getSocket(socketId);
    if (socket) {
      socket.disconnect();
    }
  }

  // Close the entire server
  static close() {
    if (SocketManager.io) {
      SocketManager.io.close();
    }
  }
}

export default SocketManager;
