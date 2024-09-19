import express from "express";
import {Server} from "socket.io";
import {createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// const user =  false
// io.use((socket, next) => {
//     if(user) next()
// });

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("id: ",socket.id);
    // socket.emit("welcome", `welcome to the server ${socket.id}`);
    // socket.broadcast.emit("welcome", `user ${socket.id} has joined the chat`);  

    socket.on("message", (data) => {
        // console.log("User disconnected");
        console.log(data);
        // socket.broadcast.emit("receive-message", data);
        io.to(data.room).emit("receive-message", data.message);
    });

    socket.on("join-room", (room) => {
        console.log("room", room);
        socket.join(room);
    });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
    }
);