import { create } from 'zustand';
import { PersonalityType } from './personality-engine';

/**
 * Neural Core Sync
 * The central nervous system of ShadowChat v1111.
 * Connects all enterprise hubs, economy, and AI activity.
 */

interface EnterpriseState {
  // Economic Core
  skycoin: number;
  manusCoin: number;
  credits: number;
  gems: number;
  
  // Gamification
  neuralXP: number;
  neuralLevel: number;
  achievements: string[];
  
  // System Status
  neuralPowerLevel: number;
  charityImpact: number;
  isSovereignMode: boolean;
  isEncryptionActive: boolean;
  isSelfHealingActive: boolean;
  
  // Activity Feed
  recentActivity: Array<{ id: string; type: string; message: string; time: string }>;
  
  // Actions
  updateSkycoin: (amount: number, skipCharity?: boolean) => void;
  updateManusCoin: (amount: number) => void;
  mineSkycoin: () => void;
  stakeSkycoin: (amount: number) => void;
  burnSkycoin: (amount: number) => void;
  tipSkycoin: (amount: number, recipient: string) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  activateUpgrade: (id: number, cost: number) => void;
  toggleSovereign: () => void;
  addActivity: (type: string, message: string) => void;
  personality: PersonalityType;
  setPersonality: (type: PersonalityType) => void;
}

export const useNeuralCore = create<EnterpriseState>((set) => ({
  skycoin: 4444,
  manusCoin: 1000,
  credits: 444,
  gems: 44,
  neuralXP: 4444,
  neuralLevel: 44,
  achievements: ['Sovereign_Founder', 'First_Mint'],
  neuralPowerLevel: 4444,
  charityImpact: 444,
  isSovereignMode: true,
  isEncryptionActive: true,
  isSelfHealingActive: true,
  recentActivity: [
    { id: '1', type: 'SEC', message: 'Quantum encryption keys rotated successfully.', time: '2m ago' },
    { id: '2', type: 'LAW', message: 'AI Supreme Court resolved Case-4444-A.', time: '5m ago' },
    { id: '3', type: 'FIN', message: 'Automated trade executed: +45.2 SKY.', time: '12m ago' },
  ],
  
  updateSkycoin: (amount, skipCharity = false) => set((state) => {
    // 4.44% Automatic Charity Diversion on all positive inflows
    const charityCut = (!skipCharity && amount > 0) ? amount * 0.0444 : 0;
    const finalAmount = amount - charityCut;
    
    return { 
      skycoin: state.skycoin + finalAmount,
      charityImpact: state.charityImpact + charityCut,
      neuralPowerLevel: state.neuralPowerLevel + (charityCut * 2), // Charity boosts power
      recentActivity: charityCut > 0 ? 
        [{ id: Math.random().toString(), type: 'GIVE', message: `Automatically diverted ${charityCut.toFixed(2)} SKY to Charity.`, time: 'Just now' }, ...state.recentActivity.slice(0, 9)] : 
        state.recentActivity
    };
  }),
  updateManusCoin: (amount) => set((state) => ({ manusCoin: state.manusCoin + amount })),
  mineSkycoin: () => set((state) => {
    const reward = 4.44 + (Math.random() * 10);
    return { 
      skycoin: state.skycoin + reward,
      neuralXP: state.neuralXP + 5,
      recentActivity: [{ id: Math.random().toString(), type: 'MIN', message: `Mined ${reward.toFixed(2)} SKY via Neural Compute.`, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
    };
  }),
  stakeSkycoin: (amount) => set((state) => {
    if (state.skycoin >= amount) {
      return { 
        skycoin: state.skycoin - amount,
        neuralXP: state.neuralXP + (amount * 0.1),
        recentActivity: [{ id: Math.random().toString(), type: 'STK', message: `Staked ${amount} SKY for 12.4% APY.`, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
      };
    }
    return state;
  }),
  burnSkycoin: (amount) => set((state) => {
    if (state.skycoin >= amount) {
      return { 
        skycoin: state.skycoin - amount,
        neuralPowerLevel: state.neuralPowerLevel + (amount * 0.5),
        recentActivity: [{ id: Math.random().toString(), type: 'BRN', message: `Burned ${amount} SKY to increase Neural Power.`, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
      };
    }
    return state;
  }),
  tipSkycoin: (amount, recipient) => set((state) => {
    if (state.skycoin >= amount) {
      return { 
        skycoin: state.skycoin - amount,
        neuralXP: state.neuralXP + (amount * 0.2),
        recentActivity: [{ id: Math.random().toString(), type: 'TIP', message: `Tipped ${amount} SKY to ${recipient}.`, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
      };
    }
    return state;
  }),
  addXP: (amount) => set((state) => {
    const newXP = state.neuralXP + amount;
    const newLevel = Math.floor(newXP / 1000);
    return { neuralXP: newXP, neuralLevel: newLevel > state.neuralLevel ? newLevel : state.neuralLevel };
  }),
  unlockAchievement: (id) => set((state) => ({
    achievements: state.achievements.includes(id) ? state.achievements : [...state.achievements, id]
  })),
  activateUpgrade: (id, cost) => set((state) => {
    if (state.skycoin >= cost) {
      return { 
        skycoin: state.skycoin - cost,
        neuralPowerLevel: state.neuralPowerLevel + (cost * 1.1),
        neuralXP: state.neuralXP + (cost * 0.5),
        recentActivity: [{ id: Math.random().toString(), type: 'UPG', message: `Upgrade #${id} activated via Skycoin4444.`, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
      };
    }
    return state;
  }),
  toggleSovereign: () => set((state) => ({ isSovereignMode: !state.isSovereignMode })),
  addActivity: (type, message) => set((state) => ({
    recentActivity: [{ id: Math.random().toString(), type, message, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
  })),
  personality: 'elite',
  setPersonality: (type) => set({ personality: type }),
}));
