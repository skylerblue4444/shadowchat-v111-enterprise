import { trpc } from "@/lib/trpc";
import { DollarSign, CreditCard, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentsHub() {
  const { data: summary } = trpc.payments.getSummary.useQuery();
  const { data: invoices } = trpc.payments.getInvoices.useQuery({ limit: 10 });
  const { data: payoutsList } = trpc.payments.getPayouts.useQuery();
  const { data: txns } = trpc.payments.getTransactions.useQuery({ limit: 15 });

  return (
    <div className="p-5 max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{fontFamily:"Syne,sans-serif"}}><DollarSign className="w-5 h-5 text-green-400"/> Payments Hub</h1>
        <p className="text-[11px] text-white/40">Billing, invoices, payouts, transaction history</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:"Balance",value:`${summary?.balance||"0"} ${summary?.currency||"SKY"}`,icon:DollarSign,color:"text-green-400"},
          {label:"Total Paid",value:`$${summary?.totalPaid||"0"}`,icon:ArrowUpRight,color:"text-blue-400"},
          {label:"Total Payouts",value:`$${summary?.totalPayouts||"0"}`,icon:ArrowDownLeft,color:"text-purple-400"},
          {label:"Pending",value:summary?.pendingPayouts||0,icon:Clock,color:"text-amber-400"},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="flex items-center gap-1.5 mb-2"><s.icon className={cn("w-3.5 h-3.5",s.color)}/><span className="text-[10px] text-white/40">{s.label}</span></div>
            <div className="text-lg font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Transactions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(txns||[]).map((t: any)=>(
              <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                <div><div className="text-xs text-white">{t.type}</div><div className="text-[10px] text-white/40">{new Date(t.createdAt).toLocaleDateString()}</div></div>
                <span className={cn("text-xs font-mono",t.type==="deposit"?"text-green-400":"text-red-400")}>{t.amount} {t.currency}</span>
              </div>
            ))}
            {(!txns||txns.length===0)&&<p className="text-xs text-white/30 text-center py-4">No transactions</p>}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Invoices</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(invoices||[]).map((inv: any)=>(
              <div key={inv.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                <div><div className="text-xs text-white">{inv.description||"Invoice"}</div><div className="text-[10px] text-white/40">{inv.status}</div></div>
                <span className="text-xs font-mono text-white">${inv.amount}</span>
              </div>
            ))}
            {(!invoices||invoices.length===0)&&<p className="text-xs text-white/30 text-center py-4">No invoices</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
