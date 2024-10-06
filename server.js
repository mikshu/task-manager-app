const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
// Import routers
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
// PORT
const PORT = process.env.PORT || 5000;
// EXPRESS APP
const app = express();
// SERVER
const server = http.createServer(app);
// APP USE SOME PACKAGE
app.use(cors());
app.use(express.json());

// MONGODB Connection
mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_ADMIN_PASSWORD}@cluster0.de0ji.mongodb.net/taskManager?retryWrites=true&w=majority`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use the routers
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//SOCKET INSTANCE IS CREATED
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

//SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listing to ${PORT}`);
});
