/**
 * ShadowChat Ultimate — Live Crypto Price Hook
 * Uses CoinGecko public API (no key required) for real-time prices.
 * Polls every 30 seconds. Falls back to last known price on error.
 */
import { useState, useEffect, useCallback } from "react";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}

// CoinGecko IDs for the coins we track
const COIN_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "dogecoin",
  "tether",
  "trump-2024", // TRUMP meme coin
  "skycoin",    // SKYCOIN — may not exist on CG, fallback handled
].join(",");

const COINGECKO_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`;

// Fallback prices when API is unavailable
const FALLBACK_PRICES: Record<string, number> = {
  bitcoin: 67420,
  ethereum: 3840,
  solana: 182,
  dogecoin: 0.182,
  tether: 1.0,
  "trump-2024": 8.72,
  skycoin: 4.44,
};

export function useLivePrices() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(COINGECKO_URL, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CoinPrice[] = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: any) {
      setError(e.message);
      // Use fallback data if no prices yet
      if (prices.length === 0) {
        const fallback: CoinPrice[] = Object.entries(FALLBACK_PRICES).map(([id, price]) => ({
          id,
          symbol: id.slice(0, 3).toUpperCase(),
          name: id.charAt(0).toUpperCase() + id.slice(1),
          current_price: price,
          price_change_percentage_24h: (Math.random() - 0.4) * 10,
          market_cap: price * 1_000_000_000,
          total_volume: price * 100_000_000,
          high_24h: price * 1.05,
          low_24h: price * 0.95,
          image: "",
        }));
        setPrices(fallback);
      }
    } finally {
      setLoading(false);
    }
  }, [prices.length]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000); // 30s refresh
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getPrice = (coinId: string) =>
    prices.find((p) => p.id === coinId)?.current_price ??
    FALLBACK_PRICES[coinId] ??
    0;

  const getChange = (coinId: string) =>
    prices.find((p) => p.id === coinId)?.price_change_percentage_24h ?? 0;

  return { prices, loading, error, lastUpdated, getPrice, getChange, refetch: fetchPrices };
}

/** Simulated live WebSocket-style price stream for the order book */
export function usePriceStream(basePrice: number, symbol: string) {
  const [price, setPrice] = useState(basePrice);
  const [trades, setTrades] = useState<{ price: number; size: number; side: "buy" | "sell"; time: Date }[]>([]);

  useEffect(() => {
    if (!basePrice) return;
    setPrice(basePrice);
    const interval = setInterval(() => {
      const change = (Math.random() - 0.499) * basePrice * 0.002;
      setPrice((p) => Math.max(p + change, basePrice * 0.5));
      const newTrade = {
        price: basePrice + (Math.random() - 0.5) * basePrice * 0.003,
        size: Math.random() * 1000,
        side: Math.random() > 0.5 ? ("buy" as const) : ("sell" as const),
        time: new Date(),
      };
      setTrades((t) => [newTrade, ...t.slice(0, 49)]);
    }, 800);
    return () => clearInterval(interval);
  }, [basePrice, symbol]);

  return { price, trades };
}
