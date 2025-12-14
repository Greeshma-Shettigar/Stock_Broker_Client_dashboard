const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];
let prices = {};

STOCKS.forEach((s) => (prices[s] = 1000 + Math.random() * 100));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("subscribe", (stock) => {
    socket.join(stock);
    console.log(`${socket.id} subscribed to ${stock}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Update prices every second
setInterval(() => {
  STOCKS.forEach((stock) => {
    prices[stock] += (Math.random() - 0.5) * 10;
    io.to(stock).emit("priceUpdate", {
      stock,
      price: prices[stock].toFixed(2),
    });
  });
}, 1000);

server.listen(4000, () => console.log("Server running on port 4000"));
