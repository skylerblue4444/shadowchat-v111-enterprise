/**
 * ShadowChat Ultimate — CryptoChart
 * TradingView-style SVG chart with live price feed.
 * Uses CoinGecko sparkline data when available.
 */
import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoChartProps {
  currentPrice: number;
  symbol?: string;
  sparkline?: number[];
  change24h?: number;
  high24h?: number;
  low24h?: number;
}

export function CryptoChart({
  currentPrice,
  symbol = "BTC/USDT",
  sparkline,
  change24h = 0,
  high24h,
  low24h,
}: CryptoChartProps) {
  const [timeframe, setTimeframe] = useState<"1H" | "4H" | "1D" | "1W">("1D");

  const priceData = useMemo(() => {
    if (sparkline && sparkline.length > 0) return sparkline.slice(-48);
    const points = 48;
    const volatility =
      timeframe === "1H" ? 0.005 : timeframe === "4H" ? 0.01 : timeframe === "1D" ? 0.025 : 0.08;
    const data: number[] = [];
    let price = currentPrice * (1 - volatility * 0.5);
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.45) * volatility * currentPrice;
      price = Math.max(price + change, currentPrice * 0.5);
      data.push(price);
    }
    data[data.length - 1] = currentPrice;
    return data;
  }, [currentPrice, timeframe, sparkline]);

  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);
  const range = maxPrice - minPrice || 1;
  const isUp = (change24h ?? 0) >= 0;

  const W = 600, H = 160, PAD = 8;
  const pts = priceData.map((p, i) => ({
    x: PAD + (i / (priceData.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - (p - minPrice) / range) * (H - PAD * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const color = isUp ? "#22d3ee" : "#f87171";
  const gid = `cg-${symbol.replace(/\//g, "")}`;

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] text-white/40 font-mono">{symbol}</div>
          <div className="text-2xl font-bold text-white font-mono">
            ${currentPrice >= 1000
              ? currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : currentPrice < 0.01
              ? currentPrice.toFixed(6)
              : currentPrice.toFixed(4)}
          </div>
          <div className={`flex items-center gap-1 text-[11px] font-medium ${isUp ? "text-cyan-400" : "text-red-400"}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? "+" : ""}{change24h.toFixed(2)}% (24h)
          </div>
        </div>
        <div className="flex gap-1">
          {(["1H", "4H", "1D", "1W"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                timeframe === tf
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.05]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Current price line */}
        <line
          x1={PAD} y1={pts[pts.length - 1].y}
          x2={W - PAD} y2={pts[pts.length - 1].y}
          stroke={color} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4"
        />
      </svg>
      {(high24h || low24h) && (
        <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1">
          <span>L: ${low24h?.toFixed(2)}</span>
          <span>H: ${high24h?.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
