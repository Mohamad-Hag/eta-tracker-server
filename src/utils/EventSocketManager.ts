import { Socket } from "socket.io";
import SocketManager from "./SocketManager";

class EventSocketManager {
  static initialize(socket: Socket) {
    // You can perform any initialization logic for the connectedsocket here
    socket.on("wave", (data) => {
      console.log(
        `Joiner with Id ${data.guest.id} waved to event ${data.eventId} of type ${data.type}`
      );
      SocketManager.emitToRoom(`event-${data.eventId}`, "joinerWaved", data);
    });

    socket.on("registerUser", (data) => {
      const eventId = data.eventId;
      const guest = data.guest;
      const guestId = guest.id;
      if (!guest || !eventId) return;
      console.log(`Joiner with Id ${guestId} registered to event ${eventId}`);
      socket.data.eventId = eventId;
      socket.data.guest = guest;
      socket.join(`event-${eventId}`);
    });
  }
}

export default EventSocketManager;
