const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();

const port = process.env.PORT || 4500;

app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello, it's working");
});

const server = http.createServer(app);
const io = socketIO(server);

const users = {};
const chatHistory = [];

io.on("connection", (socket) => {
    console.log("New Connection");

    socket.on('joined', (data) => {
        const { user } = data;
        users[socket.id] = user;
        console.log(`${user} has joined`);

        io.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${user}` });
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${user} has joined` });

        socket.emit('chatHistory', chatHistory);
    });

    socket.on('disconnect', () => {
        const leftUser = users[socket.id];
        if (leftUser) {
            io.emit('leave', { user: "Admin", message: `${leftUser} has left` });
            console.log(`${leftUser} has left`);
            delete users[socket.id];
        }
    });

    socket.on('message', ({ message, id }) => {
        const user = users[id];
        io.emit('sendMessage', { user, message, id });

        chatHistory.push({ user, message });
    });
});

server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`);
});
