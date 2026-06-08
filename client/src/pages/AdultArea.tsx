import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdultArea() {
  const [verified, setVerified] = useState(false);
  const [dob, setDob] = useState("");

  const handleVerify = () => {
    if (!dob) { toast.error("Please enter your date of birth"); return; }
    const birthDate = new Date(dob);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age >= 18) {
      setVerified(true);
      toast.success("Age verified. Welcome to the Adult Area.");
    } else {
      toast.error("You must be 18+ to access this area.");
    }
  };

  if (!verified) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="bg-white/5 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="text-6xl">🔞</div>
          <h1 className="text-2xl font-bold text-red-400">Age Verification Required</h1>
          <p className="text-sm text-white/50">This section contains adult content. You must be 18 years or older to proceed.</p>
          <div className="space-y-3">
            <label className="text-xs text-white/40 block text-left">Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            <Button className="w-full bg-red-500 hover:bg-red-600" onClick={handleVerify}>
              Verify Age & Enter
            </Button>
            <p className="text-[10px] text-white/30">By proceeding, you confirm you are of legal age in your jurisdiction.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🔞</span>
        <div>
          <h1 className="text-2xl font-bold text-red-400">Adult Area</h1>
          <p className="text-xs text-white/40">18+ verified content. Discretion advised.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Adult Content Categories */}
        {[
          { title: "Private Messaging", icon: "💬", desc: "End-to-end encrypted adult conversations", users: "24K active" },
          { title: "Premium Content", icon: "⭐", desc: "Exclusive creator content marketplace", users: "8K creators" },
          { title: "Live Rooms", icon: "🎥", desc: "Private live streaming rooms", users: "1.2K live" },
          { title: "Dating+", icon: "🔥", desc: "Enhanced dating with adult preferences", users: "45K matches" },
          { title: "NFT Gallery 18+", icon: "🎨", desc: "Adult art and collectibles", users: "12K items" },
          { title: "Anonymous Mode", icon: "👻", desc: "Browse with zero identity trace", users: "Active" },
        ].map(cat => (
          <div key={cat.title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 hover:border-red-500/20 transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <div className="font-bold">{cat.title}</div>
                <div className="text-[10px] text-white/40">{cat.users}</div>
              </div>
            </div>
            <p className="text-sm text-white/50">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Grey Area Tools */}
      <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-bold text-orange-400 mb-4">⚠️ Grey Area Tools</h2>
        <p className="text-sm text-white/50 mb-4">Advanced tools for power users. Use responsibly.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Stealth Browser", desc: "Tor-like browsing within ShadowChat", icon: "🕵️" },
            { title: "Crypto Mixer", desc: "Privacy-enhanced token transfers", icon: "🔀" },
            { title: "Burn Phone", desc: "Temporary anonymous identity", icon: "📱" },
            { title: "Dead Drop", desc: "Encrypted file sharing with auto-delete", icon: "📦" },
            { title: "Ghost Mode", desc: "Complete activity history wipe", icon: "👻" },
            { title: "Proxy Chain", desc: "Multi-hop encrypted routing", icon: "🔗" },
          ].map(tool => (
            <div key={tool.title} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-orange-500/20 transition-colors cursor-pointer" onClick={() => toast.info(`${tool.title} — Feature active in stealth mode`)}>
              <span className="text-xl">{tool.icon}</span>
              <div>
                <div className="font-bold text-sm">{tool.title}</div>
                <div className="text-xs text-white/40">{tool.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 text-center">
        <p className="text-xs text-white/40">🔒 All adult area activity is encrypted end-to-end. No logs. No traces. Your privacy is absolute.</p>
        <p className="text-[10px] text-white/30 mt-1">ShadowChat does not store, monitor, or share any adult area activity. Monero payments accepted for maximum privacy.</p>
      </div>
    </div>
  );
}
