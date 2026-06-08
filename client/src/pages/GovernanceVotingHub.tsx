import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Vote, Users, CheckCircle2, XCircle, 
  Clock, BarChart3, Shield, Sparkles,
  ArrowRight, Plus
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Governance & Voting Hub
 * Democratic decision-making powered by Skycoin4444
 */

interface Proposal {
  id: number;
  title: string;
  description: string;
  author: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endsIn: string;
  category: string;
}

export default function GovernanceVotingHub() {
  const { skycoin, addXP, addActivity } = useNeuralCore();
  const [selectedTab, setSelectedTab] = useState<'active' | 'passed' | 'all'>('active');

  const proposals: Proposal[] = [
    { 
      id: 1, title: "Increase Mining Rewards by 20%", 
      description: "Proposal to boost neural mining output from 4.44 to 5.33 SKY base reward to incentivize platform compute.",
      author: "Skyler_Blue", status: 'active', votesFor: 3200, votesAgainst: 800, quorum: 5000, endsIn: "2d 14h", category: "Economic"
    },
    { 
      id: 2, title: "Launch Sovereign Education Fund", 
      description: "Allocate 100,000 SKY from the treasury to fund free courses in the Education Academy for new citizens.",
      author: "Neural_Architect", status: 'active', votesFor: 4100, votesAgainst: 200, quorum: 5000, endsIn: "5d 8h", category: "Social"
    },
    { 
      id: 3, title: "Implement Cross-Chain Bridge", 
      description: "Build a bridge between Skycoin4444 and external blockchain networks to enable interoperability.",
      author: "Sovereign_Node", status: 'active', votesFor: 1800, votesAgainst: 1500, quorum: 5000, endsIn: "1d 3h", category: "Technical"
    },
    { 
      id: 4, title: "Reduce Burn Rate to 25%", 
      description: "Lower the deflationary burn multiplier from 50% to 25% to preserve long-term liquidity.",
      author: "Whale_Alpha", status: 'passed', votesFor: 4800, votesAgainst: 150, quorum: 5000, endsIn: "Ended", category: "Economic"
    },
    { 
      id: 5, title: "Add Dark Mode v2 Theme", 
      description: "Introduce an alternative ultra-dark theme with OLED-optimized pure black backgrounds.",
      author: "UI_Master", status: 'passed', votesFor: 4400, votesAgainst: 100, quorum: 5000, endsIn: "Ended", category: "UI/UX"
    },
    { 
      id: 6, title: "Remove Tip Minimum", 
      description: "Allow tipping any amount of SKY with no minimum threshold.",
      author: "Community_Voice", status: 'rejected', votesFor: 1200, votesAgainst: 3500, quorum: 5000, endsIn: "Ended", category: "Economic"
    },
  ];

  const filteredProposals = proposals.filter(p => {
    if (selectedTab === 'active') return p.status === 'active';
    if (selectedTab === 'passed') return p.status === 'passed' || p.status === 'rejected';
    return true;
  });

  const handleVote = (proposalId: number, voteType: 'for' | 'against') => {
    addXP(25);
    addActivity('GOV', `Voted ${voteType} on Proposal #${proposalId}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Governance Voting" 
        subtitle="Sovereign Democracy // Powered by Skycoin4444" 
        accent="purple"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Active Proposals", value: "3", icon: Vote },
          { label: "Total Voters", value: "12,450", icon: Users },
          { label: "Proposals Passed", value: "24", icon: CheckCircle2 },
          { label: "Your Voting Power", value: `${skycoin.toLocaleString()} SKY`, icon: Shield },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
              <div className="text-sm font-black italic">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-slate-900/40 border border-slate-800 rounded-xl w-fit">
        {(['active', 'passed', 'all'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedTab === tab ? "bg-purple-500 text-white" : "text-slate-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-6">
        {filteredProposals.map((proposal) => {
          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
          
          return (
            <motion.div 
              key={proposal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Proposal Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <SovereignBadge type={proposal.status === 'active' ? 'purple' : (proposal.status === 'passed' ? 'emerald' : 'rose')}>
                      {proposal.status}
                    </SovereignBadge>
                    <SovereignBadge type="slate">{proposal.category}</SovereignBadge>
                    <span className="text-[9px] text-slate-600 font-mono">#{proposal.id.toString().padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-lg font-black uppercase italic mb-3">{proposal.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proposal.description}</p>
                  <div className="flex gap-6 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                    <span>By: {proposal.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {proposal.endsIn}</span>
                  </div>
                </div>

                {/* Voting Section */}
                <div className="lg:w-72 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                      <span className="text-emerald-500">{proposal.votesFor.toLocaleString()} For</span>
                      <span className="text-rose-500">{proposal.votesAgainst.toLocaleString()} Against</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${forPercent}%` }} />
                      <div className="h-full bg-rose-500" style={{ width: `${100 - forPercent}%` }} />
                    </div>
                    <div className="text-[9px] text-slate-600 font-mono text-center">
                      Quorum: {totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  {proposal.status === 'active' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleVote(proposal.id, 'for')}
                        className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                      >
                        Vote For
                      </button>
                      <button 
                        onClick={() => handleVote(proposal.id, 'against')}
                        className="flex-1 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                      >
                        Vote Against
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Proposal CTA */}
      <div className="mt-12 p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
            <Plus className="w-7 h-7 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic text-white">Create a Proposal</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Requires 100 SKY minimum to submit a governance proposal.</p>
          </div>
        </div>
        <SovereignButton variant="secondary">Submit Proposal</SovereignButton>
      </div>
    </div>
  );
}
