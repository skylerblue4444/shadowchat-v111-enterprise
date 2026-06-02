import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

function getSocket(): Socket {
  if (!globalSocket) {
    globalSocket = io(window.location.origin, {
      path: "/api/ws",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
  }
  return globalSocket;
}

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    if (socket.connected) setConnected(true);

    return () => {
      // Don't disconnect global socket on unmount
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => { socketRef.current?.off(event, handler); };
  }, []);

  return { socket: socketRef.current, connected, emit, on };
}

// Specialized hooks
export function useOrderBookStream(pair: string) {
  const { emit, on, connected } = useSocket();
  const [price, setPrice] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    if (!connected) return;
    emit("join:orderbook", pair);

    const offPrice = on("price:update", (data: any) => {
      if (data.pair === pair) setPrice(data);
    });
    const offTrade = on("trade:executed", (data: any) => {
      setTrades(prev => [data, ...prev].slice(0, 50));
    });

    return () => {
      emit("leave:orderbook", pair);
      offPrice();
      offTrade();
    };
  }, [pair, connected, emit, on]);

  return { price, trades, connected };
}

export function useFeedStream() {
  const { emit, on, connected } = useSocket();
  const [newPosts, setNewPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!connected) return;
    emit("join:feed");
    const off = on("feed:newPost", (post: any) => {
      setNewPosts(prev => [post, ...prev]);
    });
    return off;
  }, [connected, emit, on]);

  return { newPosts, connected, clearNew: () => setNewPosts([]) };
}

export function useNotificationStream(userId: number | undefined) {
  const { emit, on, connected } = useSocket();
  const [newNotifications, setNewNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!connected || !userId) return;
    emit("join:notifications", String(userId));
    const off = on("notification:new", (notification: any) => {
      setNewNotifications(prev => [notification, ...prev]);
    });
    return off;
  }, [connected, userId, emit, on]);

  return { newNotifications, connected };
}

export function useGovernanceStream() {
  const { emit, on, connected } = useSocket();
  const [voteUpdates, setVoteUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!connected) return;
    emit("join:governance");
    const off = on("vote:update", (data: any) => {
      setVoteUpdates(prev => [data, ...prev]);
    });
    return off;
  }, [connected, emit, on]);

  return { voteUpdates, connected };
}
