const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow all localhost ports for development
    if (origin.includes("localhost")) return callback(null, true);
    // Allow all Vercel deployments
    if (origin.includes("vercel.app")) return callback(null, true);
    // Allow your specific frontend URL from env
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    // Log blocked origins to help debug
    console.log("Blocked origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.includes("localhost")) return callback(null, true);
      if (origin.includes("vercel.app")) return callback(null, true);
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.json({ message: "DevCollab API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("join-project", (projectId) => socket.join(projectId));
  socket.on("leave-project", (projectId) => socket.leave(projectId));
  socket.on("task-created", ({ projectId, task }) =>
    socket.to(projectId).emit("task-created", task),
  );
  socket.on("task-updated", ({ projectId, task }) =>
    socket.to(projectId).emit("task-updated", task),
  );
  socket.on("task-deleted", ({ projectId, taskId }) =>
    socket.to(projectId).emit("task-deleted", taskId),
  );
  socket.on("disconnect", () =>
    console.log(`Socket disconnected: ${socket.id}`),
  );
});

app.set("io", io);

setInterval(() => console.log("keepalive"), 14 * 60 * 1000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
