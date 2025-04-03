import express from "express";
import noteRoute from "./routes/noteRoute";
import userRoute from "./routes/userRoute";
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

const allowedOrigins = [process.env.FRONTEND_URL, process.env.LOCAL_URL];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", noteRoute);
app.use("/api", userRoute);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export { io };
