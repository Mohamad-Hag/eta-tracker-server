import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import { eventRoutes } from "./routes/eventRoutes";
import { guestRoutes } from "./routes/guestRoutes";
import { locationRoutes } from "./routes/locationRoutes";
import EventSocketManager from "./utils/EventSocketManager";
import SocketManager from "./utils/SocketManager";
import getEnv from "./utils/getEnv";
import { AddressInfo } from "net";

const env = getEnv();
const isDev = false;

// Load SSL cert (Dev environment only)

let key, cert;

if (isDev) {
  key = fs.readFileSync("ssl/server.key");
  cert = fs.readFileSync("ssl/server.cert");
}

const app = express();
const server = !isDev
  ? http.createServer(app)
  : https.createServer({ key, cert }, app);

// ✅ Setup Socket.IO
new SocketManager(server);
SocketManager.onConnect(EventSocketManager.initialize);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// ✅ API Routes
app.use("/api/events", eventRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/locations", locationRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  const address = server.address() as AddressInfo;
  const host = address.address === "::" ? "localhost" : address.address;
  const port = address.port;
  console.log(`Server running on https://${host}:${port}`);
});
