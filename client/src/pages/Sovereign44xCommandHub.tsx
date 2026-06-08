import { useState } from "react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignHeading, SovereignButton, SovereignBadge } from "@/components/SovereignUI";
import { Zap, Brain, Shield, Scale, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Sovereign44xCommandHub() {
  const { 
    economy44x, intelligence44x, security44x, governance44x,
    economyMultiplier, intelligenceMultiplier, securityMultiplier, governanceMultiplier,
    activate44x, addActivity
  } = useNeuralCore();

  const [activatingPillar, setActivatingPillar] = useState<string | null>(null);

  const handleActivate44x = async (pillar: 'economy' | 'intelligence' | 'security' | 'governance') => {
    setActivatingPillar(pillar);
    addActivity('44X', `Initiating 44x activation for ${pillar.toUpperCase()} pillar...`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate activation delay
    activate44x(pillar);
    addActivity('44X', `${pillar.toUpperCase()} 44x multiplier successfully activated!`);
    setActivatingPillar(null);
  };

  const pillars = [
    { id: 'economy', label: 'Economy', icon: Zap, active: economy44x, multiplier: economyMultiplier, badge: 'ECO' },
    { id: 'intelligence', label: 'Intelligence', icon: Brain, active: intelligence44x, multiplier: intelligenceMultiplier, badge: 'INTEL' },
    { id: 'security', label: 'Security', icon: Shield, active: security44x, multiplier: securityMultiplier, badge: 'SEC' },
    { id: 'governance', label: 'Governance', icon: Scale, active: governance44x, multiplier: governanceMultiplier, badge: 'GOV' },
  ];

  return (
    <div className="p-8 space-y-8">
      <SovereignHeading
        title="Sovereign 44x Command Hub"
        description="Activate 44x multipliers across core pillars for exponential growth and power."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => (
          <SovereignCard key={pillar.id} className="p-6 flex flex-col items-center text-center relative">
            {pillar.active && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-emerald-500/10 rounded-xl flex items-center justify-center"
              >
                <CheckCircle className="w-16 h-16 text-emerald-400 opacity-50" />
              </motion.div>
            )}
            <pillar.icon className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{pillar.label} 44x</h3>
            <p className="text-white/60 text-sm mb-4">
              {pillar.active ? 
                `Multiplier Active: ${pillar.multiplier}x. Experience exponential growth.` : 
                `Unlock a ${44}x multiplier for ${pillar.label} operations.`
              }
            </p>
            <SovereignBadge type={pillar.badge === 'SEC' ? 'red' : pillar.badge === 'GOV' ? 'purple' : 'cyan'}>
              {pillar.badge} {pillar.active ? `x${pillar.multiplier}` : 'INACTIVE'}
            </SovereignBadge>
            <SovereignButton
              onClick={() => handleActivate44x(pillar.id as 'economy' | 'intelligence' | 'security' | 'governance')}
              disabled={pillar.active || activatingPillar === pillar.id}
              className="mt-6 w-full"
            >
              {activatingPillar === pillar.id ? 'Activating...' : pillar.active ? 'Activated' : 'Activate 44x'}
            </SovereignButton>
          </SovereignCard>
        ))}
      </div>

      <SovereignCard className="p-6">
        <SovereignHeading
          title="Global 44x Status"
          description="Monitor the overall impact of your 44x activations."
          level={2}
        />
        <div className="grid grid-cols-2 gap-4 mt-4 text-white/80">
          <div>
            <p className="text-sm">Economy Multiplier:</p>
            <p className="text-lg font-bold text-emerald-400">{economyMultiplier}x</p>
          </div>
          <div>
            <p className="text-sm">Intelligence Multiplier:</p>
            <p className="text-lg font-bold text-emerald-400">{intelligenceMultiplier}x</p>
          </div>
          <div>
            <p className="text-sm">Security Multiplier:</p>
            <p className="text-lg font-bold text-emerald-400">{securityMultiplier}x</p>
          </div>
          <div>
            <p className="text-sm">Governance Multiplier:</p>
            <p className="text-lg font-bold text-emerald-400">{governanceMultiplier}x</p>
          </div>
        </div>
      </SovereignCard>
    </div>
  );
}
