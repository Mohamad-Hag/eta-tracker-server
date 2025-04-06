import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { eventRoutes } from "./routes/eventRoutes";
import { guestRoutes } from "./routes/guestRoutes";
import { locationRoutes } from "./routes/locationRoutes";
import SocketManager from "./utils/SocketManager";
import EventSocketManager from "./utils/EventSocketManager";

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
new SocketManager(server);
SocketManager.onConnect(EventSocketManager.initialize);

app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/events", eventRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/locations", locationRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
