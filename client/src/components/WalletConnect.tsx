/**
 * ShadowChat Ultimate — WalletConnect
 * Real Phantom + Solflare wallet connection via browser extension.
 * Restored from Sky4444_Clean_Merged_Production.zip
 */
import { useState } from "react";
import { toast } from "sonner";
import { Wallet, Copy, Check, ExternalLink, Unplug, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletConnectProps {
  connectedAddress?: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function WalletConnect({ connectedAddress, onConnect, onDisconnect }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasPhantom = typeof window !== "undefined" && (window as any).solana?.isPhantom;
  const hasSolflare = typeof window !== "undefined" && (window as any).solflare?.isSolflare;

  const connectPhantom = async () => {
    try {
      setConnecting(true);
      const provider = (window as any).solana;
      if (!provider?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        toast.info("Install Phantom wallet to connect");
        return;
      }
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      onConnect(address);
      toast.success("Phantom wallet connected!");
    } catch (err: any) {
      if (err.code !== 4001) toast.error("Connection failed: " + err.message);
    } finally {
      setConnecting(false);
    }
  };

  const connectSolflare = async () => {
    try {
      setConnecting(true);
      const provider = (window as any).solflare;
      if (!provider?.isSolflare) {
        window.open("https://solflare.com/", "_blank");
        toast.info("Install Solflare wallet to connect");
        return;
      }
      await provider.connect();
      const address = provider.publicKey.toString();
      onConnect(address);
      toast.success("Solflare wallet connected!");
    } catch (err: any) {
      toast.error("Connection failed: " + err.message);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    try {
      const phantom = (window as any).solana;
      if (phantom?.isPhantom) phantom.disconnect();
      const solflare = (window as any).solflare;
      if (solflare?.isSolflare) solflare.disconnect();
    } catch {}
    onDisconnect();
    toast.success("Wallet disconnected");
  };

  const copyAddress = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const short = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : "";

  if (connectedAddress) {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-white font-mono">{short}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Connected
              </span>
            </div>
            <div className="text-[10px] text-white/40">Solana Mainnet</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={copyAddress}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => window.open(`https://solscan.io/account/${connectedAddress}`, "_blank")}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={disconnect}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
          >
            <Unplug className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.01_265)] p-5">
      <div className="text-center mb-4">
        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
          <Wallet className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
          Connect Solana Wallet
        </h3>
        <p className="text-[11px] text-white/40 mt-1">
          Link your wallet to trade SKYCOIN4444 &amp; TRUMP on-chain
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={connecting}
          onClick={connectPhantom}
          className={cn(
            "h-14 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] transition-all flex flex-col items-center justify-center gap-0.5",
            "disabled:opacity-50"
          )}
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-[11px] font-semibold text-white">Phantom</span>
          <span className="text-[9px] text-white/30">{hasPhantom ? "Detected" : "Install"}</span>
        </button>
        <button
          disabled={connecting}
          onClick={connectSolflare}
          className={cn(
            "h-14 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] transition-all flex flex-col items-center justify-center gap-0.5",
            "disabled:opacity-50"
          )}
        >
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-[11px] font-semibold text-white">Solflare</span>
          <span className="text-[9px] text-white/30">{hasSolflare ? "Detected" : "Install"}</span>
        </button>
      </div>
    </div>
  );
}
