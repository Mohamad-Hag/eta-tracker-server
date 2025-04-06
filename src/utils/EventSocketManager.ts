import { Socket } from "socket.io";
import SocketManager from "./SocketManager";

class EventSocketManager {
  static initialize(socket: Socket) {
    // You can perform any initialization logic for the connectedsocket here
    socket.emit("message", "Hello World");
  }
}

export default EventSocketManager;
