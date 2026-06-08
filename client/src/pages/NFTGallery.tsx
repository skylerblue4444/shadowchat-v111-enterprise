import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Image, Plus, TrendingUp, Star, ShoppingCart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NFTS = [
  {id:"n1",name:"ShadowGhost #4444",collection:"ShadowChat Genesis",price:44.4,currency:"ETH",rarity:"Legendary",owner:"You",color:"from-cyan-500 to-blue-700",emoji:"👻"},
  {id:"n2",name:"HOPE Entity #001",collection:"HOPE AI Series",price:28.8,currency:"ETH",rarity:"Epic",owner:"You",color:"from-purple-500 to-indigo-700",emoji:"🧠"},
  {id:"n3",name:"SKYCOIN Whale #7",collection:"Whale Club",price:120,currency:"ETH",rarity:"Mythic",owner:"You",color:"from-amber-500 to-orange-700",emoji:"🐋"},
  {id:"n4",name:"Digital Twin #SB",collection:"Identity Vault",price:8.8,currency:"ETH",rarity:"Rare",owner:"You",color:"from-green-500 to-teal-700",emoji:"🪞"},
  {id:"n5",name:"Governance Key #44",collection:"DAO Access",price:15.5,currency:"ETH",rarity:"Epic",owner:"Market",color:"from-red-500 to-rose-700",emoji:"🗝️"},
  {id:"n6",name:"AetherLux Pass",collection:"VIP Access",price:200,currency:"ETH",rarity:"Mythic",owner:"Market",color:"from-pink-500 to-purple-700",emoji:"💎"},
];
const RARITY_COLORS: Record<string,string> = {Legendary:"text-amber-400 bg-amber-500/10 border-amber-500/20",Epic:"text-purple-400 bg-purple-500/10 border-purple-500/20",Mythic:"text-pink-400 bg-pink-500/10 border-pink-500/20",Rare:"text-cyan-400 bg-cyan-500/10 border-cyan-500/20"};

export default function NFTGallery() {
  const { data: nftListings } = trpc.marketplace.getListings.useQuery({ limit: 20 });
  const [tab, setTab] = useState("My Collection");
  const TABS = ["My Collection","Marketplace","Create","Analytics"];
  const nfts = tab==="My Collection" ? NFTS.filter(n=>n.owner==="You") : NFTS;
  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>NFT Gallery</h1>
          <p className="text-[11px] text-white/40">OpenSea × Foundation × AI-generated collections</p>
        </div>
        <button onClick={()=>toast.info("NFT minting coming soon!")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">
          <Plus className="w-3.5 h-3.5"/> Mint NFT
        </button>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all",tab===t?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-white/40 hover:text-white/60")}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft,i)=>(
          <div key={nft.id} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden hover:border-white/[0.15] transition-all group">
            <div className={cn("h-44 bg-gradient-to-br flex items-center justify-center text-6xl relative",nft.color)}>
              {nft.emoji}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"/>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-[13px] font-bold text-white">{nft.name}</h3>
                  <div className="text-[10px] text-white/40">{nft.collection}</div>
                </div>
                <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-mono",RARITY_COLORS[nft.rarity]||"text-white/40 bg-white/[0.06] border-white/[0.08]")}>{nft.rarity}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-white/40">Price</div>
                  <div className="text-[15px] font-bold text-white font-mono">{nft.price} {nft.currency}</div>
                </div>
                {nft.owner==="You" ? (
                  <button onClick={()=>toast.success(`Listed ${nft.name} for sale!`)} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] hover:bg-amber-500/20 transition-colors">List for Sale</button>
                ) : (
                  <button onClick={()=>toast.success(`Purchased ${nft.name}!`)} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">Buy Now</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
