import { Socket } from "socket.io";
import SocketManager from "./SocketManager";

class EventSocketManager {
  static initialize(socket: Socket) {
    // You can perform any initialization logic for the connectedsocket here
    socket.on("wave", (data) => {
      console.log(
        `Joiner with Id ${data.guest.id} waved to event ${data.eventId}`
      );
      SocketManager.emitToRoom(`event-${data.eventId}`, "joinerWaved", data);
    });
  }
}

export default EventSocketManager;
