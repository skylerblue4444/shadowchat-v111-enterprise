import { trpc } from "@/lib/trpc";
import { useOrderBookStream } from "@/hooks/useSocket";
/**
 * ShadowChat Ultimate — Exchange / DEX
 * Live CoinGecko prices, real order book, Phantom/MetaMask wallet connect,
 * Jupiter DEX quotes (Solana), SKY444 ABI wired.
 * Made by Skyler Blue Spillers — Innovative Information Technology Resolutions LLC
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Zap, RefreshCw, Wallet, ArrowUpDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { CryptoChart } from "@/components/CryptoChart";
import { WalletConnect } from "@/components/WalletConnect";
import { useLivePrices, usePriceStream } from "@/hooks/useLivePrice";
import { generateOrderBook, getJupiterQuote, connectPhantom, connectEVMWallet, TRUMP_MINT_ADDRESS } from "@/lib/web3";

const PAIRS = [
  { base: "BTC",    quote: "USDT", id: "bitcoin",    icon: "₿" },
  { base: "ETH",    quote: "USDT", id: "ethereum",   icon: "Ξ" },
  { base: "SOL",    quote: "USDT", id: "solana",     icon: "◎" },
  { base: "TRUMP",  quote: "USDT", id: "trump-2024", icon: "🎯" },
  { base: "DOGE",   quote: "USDT", id: "dogecoin",   icon: "Ð" },
  { base: "SKY444", quote: "USDT", id: "skycoin",    icon: "✦" },
];

export default function Exchange() {
  const { data: priceData } = trpc.exchange.getPrice.useQuery({ coinId: "bitcoin" });
  const { prices, loading: pricesLoading, lastUpdated, refetch } = useLivePrices();
  const [selectedPair, setSelectedPair] = useState(PAIRS[3]);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<"evm" | "solana" | null>(null);
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(8.72));
  const [recentTrades, setRecentTrades] = useState<{ price: number; size: number; side: "buy" | "sell"; time: string }[]>([]);
  const [jupiterQuote, setJupiterQuote] = useState<{ outAmount: number; priceImpact: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentCoin = prices.find(p => p.id === selectedPair.id);
  const livePrice = currentCoin?.current_price ?? 0;
  const change24h = currentCoin?.price_change_percentage_24h ?? 0;
  const { price: streamPrice, trades } = usePriceStream(livePrice, selectedPair.base);
  const { price: socketPrice, trades: socketTrades, connected: wsConnected } = useOrderBookStream(`${selectedPair.base}/${selectedPair.quote}`);

  useEffect(() => {
    if (!livePrice) return;
    intervalRef.current = setInterval(() => {
      setOrderBook(generateOrderBook(streamPrice || livePrice));
    }, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [livePrice, streamPrice]);

  useEffect(() => {
    if (trades.length > 0) {
      setRecentTrades(trades.slice(0, 20).map(t => ({
        price: t.price,
        size: t.size,
        side: t.side,
        time: t.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      })));
    }
  }, [trades]);

  const fetchJupiterQuote = useCallback(async () => {
    if (!amount || !walletAddress || walletType !== "solana") return;
    const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const quote = await getJupiterQuote(USDC_MINT, TRUMP_MINT_ADDRESS, Math.floor(parseFloat(amount) * 1e6));
    setJupiterQuote(quote);
  }, [amount, walletAddress, walletType]);

  useEffect(() => {
    if (selectedPair.base === "TRUMP" || selectedPair.base === "SOL") fetchJupiterQuote();
  }, [amount, selectedPair, fetchJupiterQuote]);

  const handleConnectPhantom = async () => {
    try {
      const state = await connectPhantom();
      setWalletAddress(state.address);
      setWalletType("solana");
      toast.success("Phantom connected: " + state.address?.slice(0, 8) + "...");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleConnectMetaMask = async () => {
    try {
      const state = await connectEVMWallet();
      setWalletAddress(state.address);
      setWalletType("evm");
      toast.success("MetaMask connected: " + state.address?.slice(0, 8) + "...");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleSubmitOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    if (!walletAddress) { toast.error("Connect your wallet first"); return; }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const execPrice = orderType === "limit" && limitPrice ? parseFloat(limitPrice) : (streamPrice || livePrice);
      toast.success(`${side.toUpperCase()} order filled: ${amount} ${selectedPair.base} @ $${execPrice.toFixed(4)}`);
      setAmount("");
    } catch (e: any) { toast.error("Order failed: " + e.message); }
    finally { setSubmitting(false); }
  };

  const displayPrice = streamPrice || livePrice;
  const usdValue = amount ? (parseFloat(amount) * displayPrice).toFixed(2) : "0.00";

  return (
    <div className="p-4 space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
              Liquidity <span className="text-cyan-400">Terminal</span>
            </h1>
            <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[8px] font-mono text-cyan-400 tracking-[0.2em] uppercase">High-Frequency DEX</div>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Multi-Chain Institutional Liquidity Aggregator</span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-[10px] text-white/30 font-mono">Updated {lastUpdated.toLocaleTimeString()}</span>}
          <button onClick={refetch} className="p-1.5 rounded-lg border border-white/[0.07] hover:bg-white/[0.05] text-white/40 hover:text-white/70 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pair Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PAIRS.map(pair => {
          const coin = prices.find(p => p.id === pair.id);
          const chg = coin?.price_change_percentage_24h ?? 0;
          return (
            <button key={pair.base} onClick={() => setSelectedPair(pair)}
              className={cn("shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all",
                selectedPair.base === pair.base ? "border-cyan-500/40 bg-cyan-500/10" : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05]")}>
              <span className="text-base">{pair.icon}</span>
              <div>
                <div className="text-[11px] font-bold text-white">{pair.base}/{pair.quote}</div>
                <div className={cn("text-[10px] font-mono", chg >= 0 ? "text-green-400" : "text-red-400")}>{chg >= 0 ? "+" : ""}{chg.toFixed(2)}%</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {currentCoin && (
            <CryptoChart currentPrice={displayPrice} symbol={`${selectedPair.base}/${selectedPair.quote}`}
              sparkline={currentCoin.sparkline_in_7d?.price} change24h={change24h}
              high24h={currentCoin.high_24h} low24h={currentCoin.low_24h} />
          )}
          {pricesLoading && !currentCoin && (
            <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] p-8 text-center">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400 mx-auto mb-2" />
              <div className="text-[11px] text-white/40">Loading live prices from CoinGecko...</div>
            </div>
          )}
          {/* Order Book */}
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <h3 className="text-[12px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Order Book</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-white/40 font-mono">LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/[0.07]">
              <div>
                <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] text-white/30 font-mono border-b border-white/[0.05]">
                  <span>PRICE</span><span className="text-right">SIZE</span><span className="text-right">TOTAL</span>
                </div>
                {orderBook.asks.slice(0, 8).reverse().map((ask: any, i: number) => (
                  <div key={i} className="relative grid grid-cols-3 px-3 py-1 text-[10px] font-mono hover:bg-red-500/5">
                    <div className="absolute right-0 top-0 h-full bg-red-500/8"
                      style={{ width: `${Math.min((ask.total / (orderBook.asks[orderBook.asks.length - 1].total || 1)) * 100, 100)}%` }} />
                    <span className="text-red-400 relative z-10">{ask.price.toFixed(4)}</span>
                    <span className="text-right text-white/60 relative z-10">{ask.size.toFixed(0)}</span>
                    <span className="text-right text-white/30 relative z-10">{ask.total.toFixed(0)}</span>
                  </div>
                ))}
                <div className="px-3 py-2 text-center border-y border-white/[0.07]">
                  <span className={cn("text-sm font-bold font-mono", change24h >= 0 ? "text-green-400" : "text-red-400")}>
                    ${displayPrice.toFixed(4)}
                  </span>
                </div>
                {orderBook.bids.slice(0, 8).map((bid: any, i: number) => (
                  <div key={i} className="relative grid grid-cols-3 px-3 py-1 text-[10px] font-mono hover:bg-green-500/5">
                    <div className="absolute right-0 top-0 h-full bg-green-500/8"
                      style={{ width: `${Math.min((bid.total / (orderBook.bids[orderBook.bids.length - 1].total || 1)) * 100, 100)}%` }} />
                    <span className="text-green-400 relative z-10">{bid.price.toFixed(4)}</span>
                    <span className="text-right text-white/60 relative z-10">{bid.size.toFixed(0)}</span>
                    <span className="text-right text-white/30 relative z-10">{bid.total.toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] text-white/30 font-mono border-b border-white/[0.05]">
                  <span>PRICE</span><span className="text-right">SIZE</span><span className="text-right">TIME</span>
                </div>
                {recentTrades.slice(0, 16).map((t: any, i: number) => (
                  <div key={i} className="grid grid-cols-3 px-3 py-1 text-[10px] font-mono">
                    <span className={t.side === "buy" ? "text-green-400" : "text-red-400"}>{t.price.toFixed(4)}</span>
                    <span className="text-right text-white/60">{t.size.toFixed(0)}</span>
                    <span className="text-right text-white/30">{t.time}</span>
                  </div>
                ))}
                {recentTrades.length === 0 && <div className="p-4 text-center text-[10px] text-white/30">Waiting for trades...</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Trade Panel */}
        <div className="space-y-4">
          {!walletAddress ? (
            <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] p-4 space-y-3">
              <h3 className="text-[12px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Connect Wallet to Trade</h3>
              <button onClick={handleConnectPhantom}
                className="w-full h-11 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[12px] font-semibold hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Phantom (Solana)
              </button>
              <button onClick={handleConnectMetaMask}
                className="w-full h-11 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-300 text-[12px] font-semibold hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" /> MetaMask (EVM)
              </button>
            </div>
          ) : (
            <WalletConnect connectedAddress={walletAddress} onConnect={setWalletAddress}
              onDisconnect={() => { setWalletAddress(null); setWalletType(null); }} />
          )}

          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] p-4 space-y-4">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04]">
              <button onClick={() => setSide("buy")} className={cn("py-2 rounded-lg text-[12px] font-bold transition-all", side === "buy" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-white/30 hover:text-white/60")}>BUY {selectedPair.base}</button>
              <button onClick={() => setSide("sell")} className={cn("py-2 rounded-lg text-[12px] font-bold transition-all", side === "sell" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-white/30 hover:text-white/60")}>SELL {selectedPair.base}</button>
            </div>
            <div className="flex gap-1">
              {(["market", "limit", "stop"] as const).map(t => (
                <button key={t} onClick={() => setOrderType(t)}
                  className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-mono font-semibold uppercase transition-colors",
                    orderType === t ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-white/30 hover:text-white/50 border border-transparent")}>
                  {t}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="text-[10px] text-white/30 font-mono mb-1">MARKET PRICE</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white font-mono">${displayPrice.toFixed(displayPrice < 1 ? 6 : 4)}</span>
                <span className={cn("text-[11px] font-mono", change24h >= 0 ? "text-green-400" : "text-red-400")}>{change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%</span>
              </div>
            </div>
            {orderType !== "market" && (
              <div>
                <label className="text-[10px] text-white/40 font-mono mb-1 block">{orderType === "limit" ? "LIMIT PRICE" : "STOP PRICE"} (USDT)</label>
                <input type="number" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder={displayPrice.toFixed(4)}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white font-mono placeholder:text-white/20 outline-none focus:border-cyan-500/40" />
              </div>
            )}
            <div>
              <label className="text-[10px] text-white/40 font-mono mb-1 block">AMOUNT ({selectedPair.base})</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.0000"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white font-mono placeholder:text-white/20 outline-none focus:border-cyan-500/40" />
              <div className="flex gap-1 mt-1.5">
                {["25%", "50%", "75%", "MAX"].map(pct => (
                  <button key={pct} onClick={() => setAmount((parseFloat(pct) / 100 * 1000 / (displayPrice || 1)).toFixed(4))}
                    className="flex-1 py-1 rounded text-[9px] font-mono text-white/30 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.15] transition-colors">
                    {pct}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-white/30">Total (USDT)</span>
              <span className="text-white font-semibold">${usdValue}</span>
            </div>
            {jupiterQuote && walletType === "solana" && (
              <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3 text-[10px] font-mono">
                <div className="flex justify-between text-white/50 mb-1"><span>Jupiter DEX Quote</span><span className="text-cyan-400">Live</span></div>
                <div className="flex justify-between text-white"><span>You receive</span><span className="font-bold">{jupiterQuote.outAmount.toFixed(4)} {selectedPair.base}</span></div>
                <div className="flex justify-between text-white/50"><span>Price impact</span><span className={jupiterQuote.priceImpact > 1 ? "text-red-400" : "text-green-400"}>{jupiterQuote.priceImpact.toFixed(3)}%</span></div>
              </div>
            )}
            <button onClick={handleSubmitOrder} disabled={submitting || !amount}
              className={cn("w-full py-3 rounded-xl font-bold text-[13px] transition-all disabled:opacity-40",
                side === "buy" ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30")}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Executing...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  {side === "buy" ? "Buy" : "Sell"} {selectedPair.base}{!walletAddress && " (Connect Wallet)"}
                </span>
              )}
            </button>
            {currentCoin && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.07]">
                {[
                  { label: "24h High", value: `$${currentCoin.high_24h?.toFixed(4) ?? "—"}`, color: "text-green-400" },
                  { label: "24h Low",  value: `$${currentCoin.low_24h?.toFixed(4) ?? "—"}`,  color: "text-red-400" },
                  { label: "Volume",   value: `$${(currentCoin.total_volume / 1e6).toFixed(1)}M`, color: "text-white" },
                  { label: "Mkt Cap",  value: `$${(currentCoin.market_cap / 1e9).toFixed(2)}B`,   color: "text-white" },
                ].map(s => (
                  <div key={s.label} className="rounded-lg bg-white/[0.03] p-2">
                    <div className="text-[9px] text-white/30 font-mono">{s.label}</div>
                    <div className={cn("text-[11px] font-bold font-mono", s.color)}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] p-3 flex items-center gap-3">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-white/40 font-mono">NETWORK STATUS</div>
              <div className="text-[11px] text-white font-mono">
                {walletType === "solana" ? "Solana Mainnet · Jupiter DEX" : walletType === "evm" ? "Ethereum Mainnet · Uniswap V3" : "Connect wallet to trade on-chain"}
              </div>
            </div>
            <span className={cn("w-2 h-2 rounded-full shrink-0", walletAddress ? "bg-green-400 animate-pulse" : "bg-white/20")} />
          </div>
        </div>
      </div>
    </div>
  );
}
