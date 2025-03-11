import express from "express";
import noteRoute from "./routes/noteRoute";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", noteRoute);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export { io };
