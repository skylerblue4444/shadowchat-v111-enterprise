import { create } from 'zustand';

/**
 * Neural Core Sync
 * The central nervous system of ShadowChat v1111.
 * Connects all enterprise hubs, economy, and AI activity.
 */

interface EnterpriseState {
  // Economic Core
  skycoin: number;
  credits: number;
  gems: number;
  
  // System Status
  isSovereignMode: boolean;
  isEncryptionActive: boolean;
  isSelfHealingActive: boolean;
  
  // Activity Feed
  recentActivity: Array<{ id: string; type: string; message: string; time: string }>;
  
  // Actions
  updateSkycoin: (amount: number) => void;
  toggleSovereign: () => void;
  addActivity: (type: string, message: string) => void;
}

export const useNeuralCore = create<EnterpriseState>((set) => ({
  skycoin: 4444,
  credits: 444,
  gems: 44,
  isSovereignMode: true,
  isEncryptionActive: true,
  isSelfHealingActive: true,
  recentActivity: [
    { id: '1', type: 'SEC', message: 'Quantum encryption keys rotated successfully.', time: '2m ago' },
    { id: '2', type: 'LAW', message: 'AI Supreme Court resolved Case-4444-A.', time: '5m ago' },
    { id: '3', type: 'FIN', message: 'Automated trade executed: +45.2 SKY.', time: '12m ago' },
  ],
  
  updateSkycoin: (amount) => set((state) => ({ skycoin: state.skycoin + amount })),
  toggleSovereign: () => set((state) => ({ isSovereignMode: !state.isSovereignMode })),
  addActivity: (type, message) => set((state) => ({
    recentActivity: [{ id: Math.random().toString(), type, message, time: 'Just now' }, ...state.recentActivity.slice(0, 9)]
  })),
}));
