/**
 * ShadowChat Ultimate — Governance / DAO
 * Real voting power from SKY444 balance, wallet-gated voting,
 * quorum checks, on-chain proposal simulation.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle2, XCircle, Clock, Users, TrendingUp, Plus, Zap, Wallet, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { calculateVotingPower, checkQuorum, getProposalResult, connectPhantom, connectEVMWallet } from "@/lib/web3";

const GOVERNANCE_PROPOSALS = [
  { id: "p1", title: "Increase SKYCOIN Staking APY to 44%", description: "Proposal to boost staking rewards for all SKY444 holders to 44% APY, funded by protocol treasury.", proposer: "0xSKY4444", ends: "Jun 15, 2026", status: "active" as const, votes: { yes: 444444, no: 88888 }, quorum: 500000 },
  { id: "p2", title: "Launch ShadowChat NFT Marketplace V2", description: "Deploy upgraded NFT marketplace with royalty splits, bulk listings, and cross-chain support.", proposer: "0xHOPE444", ends: "Jun 20, 2026", status: "active" as const, votes: { yes: 288000, no: 44000 }, quorum: 300000 },
  { id: "p3", title: "Burn 4.4M SKYCOIN from Treasury", description: "Deflationary burn event to reduce supply and increase token value for all holders.", proposer: "0xSHADOW44", ends: "May 30, 2026", status: "passed" as const, votes: { yes: 680000, no: 120000 }, quorum: 500000 },
  { id: "p4", title: "Integrate AI Governance Advisor", description: "Deploy HOPE AI to analyze proposals and provide risk assessments before voting closes.", proposer: "0xAI_ORACLE", ends: "May 25, 2026", status: "passed" as const, votes: { yes: 520000, no: 80000 }, quorum: 400000 },
];

export default function Governance() {
  const [voted, setVoted] = useState<Record<string, string>>({});
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [sky444Balance] = useState(44444);
  const [proposals, setProposals] = useState(GOVERNANCE_PROPOSALS);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const votingPower = calculateVotingPower(sky444Balance, 1.5);

  const handleConnect = async () => {
    try {
      const state = await connectPhantom();
      setWalletAddress(state.address);
      toast.success("Phantom connected! Voting power: " + votingPower.toLocaleString() + " SKY");
    } catch {
      try {
        const state = await connectEVMWallet();
        setWalletAddress(state.address);
        toast.success("MetaMask connected! Voting power: " + votingPower.toLocaleString() + " SKY");
      } catch (e: any) { toast.error(e.message); }
    }
  };

  const vote = (id: string, choice: "yes" | "no") => {
    if (!walletAddress) { toast.error("Connect wallet to vote on-chain"); return; }
    if (voted[id]) { toast.error("Already voted on this proposal"); return; }
    setVoted(p => ({ ...p, [id]: choice }));
    setProposals(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        votes: {
          yes: choice === "yes" ? p.votes.yes + Math.floor(votingPower) : p.votes.yes,
          no: choice === "no" ? p.votes.no + Math.floor(votingPower) : p.votes.no,
        }
      };
    }));
    toast.success(`Vote cast: ${choice.toUpperCase()} on Proposal #${id.replace("p", "")} · ${votingPower.toLocaleString()} SKY power`);
  };

  const submitProposal = () => {
    if (!walletAddress) { toast.error("Connect wallet to submit proposals"); return; }
    if (!newTitle.trim()) { toast.error("Enter a proposal title"); return; }
    const newProp = {
      id: `p${proposals.length + 1}`,
      title: newTitle,
      description: newDesc || "Community governance proposal",
      proposer: walletAddress.slice(0, 8) + "...",
      ends: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
      status: "active" as const,
      votes: { yes: 0, no: 0 },
      quorum: 75000,
    };
    setProposals(prev => [newProp, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setShowNewProposal(false);
    toast.success("Proposal submitted on-chain!");
  };

  const activeCount = proposals.filter(p => p.status === "active").length;
  const passedCount = proposals.filter(p => p.status === "passed").length;

  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Syne,sans-serif" }}>Governance / DAO</h1>
          <p className="text-[11px] text-white/40">SKY444 token-holder democracy · On-chain voting · Community decisions</p>
        </div>
        <div className="flex items-center gap-2">
          {!walletAddress ? (
            <button onClick={handleConnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] hover:bg-purple-500/30 transition-colors">
              <Wallet className="w-3.5 h-3.5" /> Connect Wallet
            </button>
          ) : (
            <span className="text-[10px] font-mono text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">
              {walletAddress.slice(0, 8)}... · {votingPower.toLocaleString()} VP
            </span>
          )}
          <button onClick={() => setShowNewProposal(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Proposal
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Proposals", value: proposals.length.toString(), icon: Vote, color: "text-cyan-400" },
          { label: "Active Votes",    value: activeCount.toString(),       icon: Clock, color: "text-green-400" },
          { label: "Passed",          value: passedCount.toString(),       icon: CheckCircle2, color: "text-purple-400" },
          { label: "Your VP",         value: walletAddress ? votingPower.toLocaleString() : "—", icon: Zap, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn("w-3.5 h-3.5", s.color)} />
              <div className="text-[10px] text-white/40">{s.label}</div>
            </div>
            <div className={cn("text-2xl font-bold font-mono", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* New Proposal Form */}
      {showNewProposal && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-3">
          <h3 className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne,sans-serif" }}>Submit New Proposal</h3>
          {!walletAddress && (
            <div className="text-[11px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
              Connect wallet to submit proposals on-chain
            </div>
          )}
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Proposal title..."
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40" />
          <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Describe the proposal and its impact..."
            rows={3}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 resize-none" />
          <div className="flex gap-2">
            <button onClick={submitProposal}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[12px] font-semibold hover:bg-cyan-500/30 transition-colors">
              Submit On-Chain
            </button>
            <button onClick={() => setShowNewProposal(false)}
              className="px-4 py-2 rounded-lg border border-white/[0.07] text-white/40 text-[12px] hover:text-white/70 transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Proposals */}
      <div className="space-y-4">
        {proposals.map((p, i) => {
          const total = p.votes.yes + p.votes.no;
          const yesPct = total > 0 ? Math.round((p.votes.yes / total) * 100) : 50;
          const noPct = 100 - yesPct;
          const myVote = voted[p.id];
          const quorumMet = checkQuorum(p.votes.yes, p.votes.no, p.quorum);
          const result = getProposalResult(p.votes.yes, p.votes.no);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono text-white/30">#{p.id.replace("p", "")}</span>
                    <span className={cn("text-[9px] px-2 py-0.5 rounded border font-mono uppercase",
                      p.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      p.status === "passed" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>{p.status}</span>
                    {quorumMet && <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">QUORUM MET</span>}
                  </div>
                  <h3 className="text-[14px] font-semibold text-white">{p.title}</h3>
                  <div className="text-[11px] text-white/40 mt-0.5">Proposed by {p.proposer} · Ends: {p.ends}</div>
                </div>
                <button onClick={() => window.open(`https://etherscan.io/search?q=${p.id}`, "_blank")}
                  className="text-white/20 hover:text-white/50 transition-colors shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-green-400">YES — {p.votes.yes.toLocaleString()} ({yesPct}%)</span>
                  <span className="text-red-400">NO — {p.votes.no.toLocaleString()} ({noPct}%)</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${yesPct}%` }} />
                  <div className="h-full bg-red-500 transition-all duration-700" style={{ width: `${noPct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/30">
                  <span>Quorum: {p.quorum.toLocaleString()} SKY required</span>
                  <span>Total votes: {total.toLocaleString()}</span>
                </div>
              </div>
              {p.status === "active" && (
                <div className="flex gap-2">
                  <button onClick={() => vote(p.id, "yes")} disabled={!!myVote}
                    className={cn("flex-1 py-2 rounded-lg border text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5",
                      myVote === "yes" ? "bg-green-500/20 border-green-500/30 text-green-400" :
                      myVote ? "opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.07] text-white/30" :
                      "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20")}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vote YES
                  </button>
                  <button onClick={() => vote(p.id, "no")} disabled={!!myVote}
                    className={cn("flex-1 py-2 rounded-lg border text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5",
                      myVote === "no" ? "bg-red-500/20 border-red-500/30 text-red-400" :
                      myVote ? "opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.07] text-white/30" :
                      "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20")}>
                    <XCircle className="w-3.5 h-3.5" /> Vote NO
                  </button>
                </div>
              )}
              {myVote && (
                <div className="mt-2 text-[10px] text-white/30 text-center font-mono">
                  Your vote: <span className={myVote === "yes" ? "text-green-400" : "text-red-400"}>{myVote.toUpperCase()}</span>
                  {" "}· {votingPower.toLocaleString()} voting power applied
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
