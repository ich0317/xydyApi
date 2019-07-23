const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", function(socket) {
  socket.emit("unpay", { hello: "world2" });
  socket.on("my other event", function(data) {
    console.log(data);
  });
});

server.listen("8084"); //创建端口
