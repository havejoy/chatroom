const express = require("express");
const socket = require("socket.io");

// 设置
const PORT = 3000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`启动服务器，监听端口：${PORT}`);
  console.log(`请打开浏览器，访问地址：localhost:${PORT}`);
});

// 设置静态文件路径
app.use(express.static("src"));

// 设置Socket
const io = socket(server);

const activeUsers = new Set();

// 监听WebSocket连接事件

io.on("connection", function (socket) {
  socket.on("newUserConnected", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("newUserConnected", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("aUserDisconnected", socket.userId);
  });

  socket.on("chatMessage", function (data) {
    io.emit("chatMessage", data);
  });
});
