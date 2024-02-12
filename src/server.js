import express from "express";
const app = express();
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
app.use(cors());
import ip from "ip";
const host = ip.address();
const address = `http://${host}`;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${address}:3000`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on("city_change", (data) => {
    socket.broadcast.emit("get_city", data);
  });
});
server.listen(4000, host, () => {
  console.log(`listening on ${host}:4000`);
});
