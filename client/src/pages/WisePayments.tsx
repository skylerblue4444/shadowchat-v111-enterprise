import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 1 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.92 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rate: 149.5 },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rate: 1.53 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rate: 1.36 },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", rate: 0.88 },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", rate: 7.24 },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", rate: 83.1 },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", rate: 4.97 },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", rate: 17.1 },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", rate: 1550 },
];

const PAYMENT_METHODS = [
  { id: "wise", name: "Wise Transfer", icon: "🌐", fee: "0.5%", speed: "1-2 days", limit: "$1M" },
  { id: "crypto", name: "Crypto Bridge", icon: "₿", fee: "0.1%", speed: "Instant", limit: "Unlimited" },
  { id: "swift", name: "SWIFT Wire", icon: "🏦", fee: "1.5%", speed: "3-5 days", limit: "$10M" },
  { id: "stripe", name: "Stripe Connect", icon: "💳", fee: "2.9%", speed: "Instant", limit: "$500K" },
  { id: "paypal", name: "PayPal", icon: "🅿️", fee: "3.5%", speed: "1-3 days", limit: "$100K" },
  { id: "shadow", name: "SHADOW Pay", icon: "🌑", fee: "0%", speed: "Instant", limit: "Unlimited" },
];

export default function WisePayments() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("wise");
  const [recipient, setRecipient] = useState("");
  const [tab, setTab] = useState<"send" | "receive" | "history" | "cards">("send");

  const fromRate = CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
  const toRate = CURRENCIES.find(c => c.code === toCurrency)?.rate || 1;
  const convertedAmount = amount ? (Number(amount) / fromRate * toRate).toFixed(2) : "0.00";
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method);

  const handleSend = () => {
    if (!amount || !recipient) { toast.error("Fill all fields"); return; }
    toast.success(`Sent ${amount} ${fromCurrency} → ${convertedAmount} ${toCurrency} to ${recipient} via ${selectedMethod?.name}`);
    setAmount("");
    setRecipient("");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            International Payments
          </h1>
          <p className="text-sm text-white/50 mt-1">Send money anywhere. Crypto + Fiat + Wise + Stripe.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <div className="text-[10px] text-white/40">Balance</div>
            <div className="text-sm font-bold">$142,400</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <div className="text-[10px] text-white/40">Sent Today</div>
            <div className="text-sm font-bold text-emerald-400">$24,800</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "send" as const, label: "Send Money", icon: "📤" },
          { id: "receive" as const, label: "Receive", icon: "📥" },
          { id: "history" as const, label: "History", icon: "📋" },
          { id: "cards" as const, label: "Virtual Cards", icon: "💳" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
        {tab === "send" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Send International Transfer</h2>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs text-white/40">You Send</label>
                <div className="flex gap-2">
                  <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white min-w-[120px]">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>

              <div className="text-center text-xl text-white/30">⇅</div>

              {/* Receive */}
              <div className="space-y-2">
                <label className="text-xs text-white/40">They Receive</label>
                <div className="flex gap-2">
                  <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white min-w-[120px]">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono">
                    {convertedAmount} {toCurrency}
                  </div>
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <label className="text-xs text-white/40">Recipient (email, wallet, or IBAN)</label>
                <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="email@example.com or 0x..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-xs text-white/40">Payment Method</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <div key={m.id} onClick={() => setMethod(m.id)}
                      className={`p-2 rounded-lg border cursor-pointer text-center transition-all ${method === m.id ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                      <div className="text-lg">{m.icon}</div>
                      <div className="text-[10px] font-bold">{m.name}</div>
                      <div className="text-[9px] text-white/40">Fee: {m.fee}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 font-bold" onClick={handleSend} disabled={!amount || !recipient}>
                Send {amount ? `${amount} ${fromCurrency}` : "Money"} →
              </Button>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="font-bold">Transfer Summary</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="text-white/40 text-sm">Amount</span><span className="font-mono">{amount || "0"} {fromCurrency}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Exchange Rate</span><span className="font-mono">1 {fromCurrency} = {(toRate / fromRate).toFixed(4)} {toCurrency}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Fee</span><span className="font-mono text-orange-400">{selectedMethod?.fee}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Speed</span><span className="text-emerald-400">{selectedMethod?.speed}</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between"><span className="font-bold">They Receive</span><span className="font-bold text-emerald-400">{convertedAmount} {toCurrency}</span></div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <h4 className="font-bold text-sm text-emerald-400 mb-2">Why ShadowChat Payments?</h4>
                <ul className="space-y-1.5 text-xs text-white/50">
                  <li>✓ 0% fees with SHADOW Pay</li>
                  <li>✓ 200+ countries supported</li>
                  <li>✓ Instant crypto settlements</li>
                  <li>✓ Multi-currency accounts</li>
                  <li>✓ Virtual debit cards</li>
                  <li>✓ Wise + Stripe + Crypto unified</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "receive" && (
          <div className="space-y-4 max-w-md">
            <h2 className="text-lg font-bold">Receive Money</h2>
            <p className="text-sm text-white/50">Share your payment details to receive funds from anywhere.</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div><div className="text-xs text-white/40">SHADOW Address</div><div className="font-mono text-sm break-all">0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28</div></div>
              <div><div className="text-xs text-white/40">IBAN</div><div className="font-mono text-sm">GB82 WEST 1234 5698 7654 32</div></div>
              <div><div className="text-xs text-white/40">SWIFT/BIC</div><div className="font-mono text-sm">WESTGB2L</div></div>
              <div><div className="text-xs text-white/40">PayPal</div><div className="font-mono text-sm">payments@shadowchat.io</div></div>
            </div>
            <Button className="w-full" onClick={() => { navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28"); toast.success("Address copied!"); }}>
              Copy SHADOW Address
            </Button>
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Transaction History</h2>
            {[
              { date: "Today", amount: "$5,200", to: "alex@gmail.com", method: "Wise", status: "Completed", dir: "out" },
              { date: "Today", amount: "$12,000", to: "0x8f2...4a1", method: "Crypto", status: "Completed", dir: "in" },
              { date: "Yesterday", amount: "€8,400", to: "maria@eu.com", method: "SWIFT", status: "Pending", dir: "out" },
              { date: "Yesterday", amount: "$3,100", to: "Stripe Payout", method: "Stripe", status: "Completed", dir: "in" },
              { date: "Jan 28", amount: "¥1,200,000", to: "tokyo@corp.jp", method: "Wise", status: "Completed", dir: "out" },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${tx.dir === "in" ? "text-emerald-400" : "text-orange-400"}`}>{tx.dir === "in" ? "📥" : "📤"}</span>
                  <div>
                    <div className="font-bold text-sm">{tx.amount}</div>
                    <div className="text-xs text-white/40">{tx.to} • {tx.method}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${tx.status === "Completed" ? "text-emerald-400" : "text-orange-400"}`}>{tx.status}</div>
                  <div className="text-[10px] text-white/30">{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "cards" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Virtual Cards</h2>
            <p className="text-sm text-white/50">Create virtual debit cards for online purchases. Funded by your crypto or fiat balance.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="text-xs text-white/40 mb-4">SHADOW VIRTUAL CARD</div>
                  <div className="font-mono text-lg tracking-wider mb-4">•••• •••• •••• 4444</div>
                  <div className="flex justify-between">
                    <div><div className="text-[10px] text-white/40">HOLDER</div><div className="text-sm font-bold">SKYLER BLUE</div></div>
                    <div><div className="text-[10px] text-white/40">EXPIRES</div><div className="text-sm font-bold">12/28</div></div>
                    <div><div className="text-[10px] text-white/40">BALANCE</div><div className="text-sm font-bold text-emerald-400">$44,400</div></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500" onClick={() => toast.success("New virtual card created!")}>
                  + Create New Card
                </Button>
                <div className="text-xs text-white/40 space-y-1">
                  <p>• Instant creation, no credit check</p>
                  <p>• Fund with SHADOW, SKY, USDT, or fiat</p>
                  <p>• Works with Apple Pay & Google Pay</p>
                  <p>• Set spending limits per card</p>
                  <p>• Auto-freeze after single use (burner cards)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
