import { Server as SocketServer } from "socket.io";
import type { Server } from "http";

let io: SocketServer | null = null;

export function initWebSocket(server: Server) {
  io = new SocketServer(server, {
    path: "/api/ws",
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Join rooms for targeted updates
    socket.on("join:orderbook", (pair: string) => {
      socket.join(`orderbook:${pair}`);
    });
    socket.on("leave:orderbook", (pair: string) => {
      socket.leave(`orderbook:${pair}`);
    });
    socket.on("join:feed", () => {
      socket.join("feed");
    });
    socket.on("join:notifications", (userId: string) => {
      socket.join(`notifications:${userId}`);
    });
    socket.on("join:messaging", (conversationId: string) => {
      socket.join(`messaging:${conversationId}`);
    });
    socket.on("join:governance", () => {
      socket.join("governance");
    });

    socket.on("disconnect", () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  // Simulate live market data every 2 seconds
  setInterval(() => {
    if (!io) return;
    const pairs = ["SKY/USDT", "BTC/USDT", "ETH/USDT"];
    pairs.forEach((pair) => {
      const basePrice = pair === "SKY/USDT" ? 4.44 : pair === "BTC/USDT" ? 67400 : 3800;
      const change = (Math.random() - 0.5) * basePrice * 0.002;
      const price = basePrice + change;
      io!.to(`orderbook:${pair}`).emit("price:update", {
        pair,
        price: price.toFixed(pair === "SKY/USDT" ? 4 : 2),
        change24h: ((Math.random() - 0.3) * 5).toFixed(2),
        volume: (Math.random() * 1000000).toFixed(0),
        timestamp: Date.now(),
      });
    });
  }, 2000);

  return io;
}

// Emit helpers for other modules to use
export function emitToRoom(room: string, event: string, data: any) {
  if (io) io.to(room).emit(event, data);
}

export function emitGlobal(event: string, data: any) {
  if (io) io.emit(event, data);
}

export function emitNewPost(post: any) {
  emitToRoom("feed", "feed:newPost", post);
}

export function emitNewNotification(userId: number, notification: any) {
  emitToRoom(`notifications:${userId}`, "notification:new", notification);
}

export function emitNewMessage(conversationId: number, message: any) {
  emitToRoom(`messaging:${conversationId}`, "message:new", message);
}

export function emitVoteUpdate(proposalId: number, data: any) {
  emitToRoom("governance", "vote:update", { proposalId, ...data });
}

export function emitTradeExecuted(pair: string, trade: any) {
  emitToRoom(`orderbook:${pair}`, "trade:executed", trade);
}
