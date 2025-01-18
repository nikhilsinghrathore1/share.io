import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const room = new Map();

io.on("connection", (socket) => {
  console.log("connected with ", socket.id);
  let currentRoom = null;
  let currentUser = null;
  let currContent = null
  // Join a room
  socket.on("join", ({ roomId, userName }) => {
    if (currentUser) {
      // Leave previous room
      socket.leave(currentRoom);
      room.get(currentRoom)?.delete(currentUser);
      if (room.get(currentRoom)?.size === 0) {
        room.delete(currentRoom);
      } else {
        io.to(currentRoom).emit("userJoined", Array.from(room.get(currentRoom)));
      }
    }

    // Join the new room
    currentRoom = roomId;
    currentUser = userName;

    console.log("Joined room:", currentRoom, "as", currentUser);

    socket.join(roomId);

    if (!room.has(roomId)) {
      room.set(roomId, new Set());
    }
    room.get(roomId).add(userName);
    io.to(roomId).emit("userJoined", Array.from(room.get(currentRoom)));
  });

  // Leave the room
  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      console.log("Leaving room:", currentRoom);
      room.get(currentRoom)?.delete(currentUser);
      if (room.get(currentRoom)?.size === 0) {
        room.delete(currentRoom);
      } else {
        io.to(currentRoom).emit("userJoined", Array.from(room.get(currentRoom)));
      }
      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("codeChange",({roomId , code})=>{
               socket.to(roomId).emit("codeUpdate" , code)
  })

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    if (currentRoom && currentUser) {
      room.get(currentRoom)?.delete(currentUser);
      if (room.get(currentRoom)?.size === 0) {
        room.delete(currentRoom);
      } else {
        io.to(currentRoom).emit("userJoined", Array.from(room.get(currentRoom)));
      }
    }
  });
});

const PORT = 3000;

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname ,"/frontend/dist")))

app.get("*" , (req,res) =>{
               res.sendFile(path.join(__dirname,"frontend" , "dist" , "index.html"))
})

server.listen(PORT, () => {
  console.log("The server started on port", PORT);
});
