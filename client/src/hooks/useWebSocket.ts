/**
 * WebSocket Hook — Real-time data streaming
 */
import { useState, useEffect, useCallback, useRef } from "react";

interface WebSocketOptions {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxRetries?: number;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(options: WebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(options.url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setRetryCount(0);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
      options.onMessage?.(data);
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (options.reconnect && retryCount < (options.maxRetries || 5)) {
        setTimeout(() => {
          setRetryCount(r => r + 1);
          connect();
        }, options.reconnectInterval || 3000);
      }
    };

    ws.onerror = (error) => {
      options.onError?.(error);
    };
  }, [options.url, retryCount]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, lastMessage, send, retryCount };
}
