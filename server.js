//external imports
const http = require("http");
const express = require("express");

let hostname = "0.0.0.0";

const app = express();

app.use(express.static(__dirname + "/public/"));

const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/* socket.io setup */
const io = require("socket.io")(server);

var users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user-connected", username);
    io.emit("user-list", users);
  });
  socket.on("disconnect", () => {
    let user = users[socket.id];
    socket.broadcast.emit("user-disconnected", user);
    delete users[socket.id];
    io.emit("user-list", users);
  });
  socket.on("message", (data) => {
    socket.broadcast.emit("message", { user: data.user, msg: data.msg });
  });
});

server.listen(port, () => {
  console.log("Server Listing on port" + port);
});
