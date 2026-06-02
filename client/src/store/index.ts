import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'user' | 'creator' | 'admin';
  verified: boolean;
  walletBalance: number;
  skycoinBalance: number;
  reputation: number;
  followers: number;
  following: number;
  joinedAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'match' | 'trade' | 'system' | 'message' | 'governance';
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
}

export interface AIMode {
  active: 'learn' | 'navigate' | 'scan' | 'guard';
  health: number;
  tasksRunning: number;
  memoryUsed: number;
}

export interface SystemStatus {
  uptime: number;
  activeUsers: number;
  txPerSecond: number;
  aiQueueDepth: number;
  feedLatency: number;
  marketVolume: number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppState {
  // Auth
  currentUser: User;
  isAuthenticated: boolean;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;

  // AI
  aiMode: AIMode;
  setAIMode: (mode: AIMode['active']) => void;

  // System
  systemStatus: SystemStatus;
  updateSystemStatus: (patch: Partial<SystemStatus>) => void;

  // Feature flags
  featureFlags: Record<string, boolean>;
  toggleFlag: (key: string) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const MOCK_USER: User = {
  id: 'usr_skyler_001',
  name: 'Skyler Blue',
  handle: '@skylerblue',
  avatar: 'SB',
  role: 'admin',
  verified: true,
  walletBalance: 142850.44,
  skycoinBalance: 4444444,
  reputation: 9820,
  followers: 12400,
  following: 340,
  joinedAt: '2024-01-01',
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'trade', title: 'Trade Executed', body: 'BTC/USDT +$2,400 profit', read: false, timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: 'n2', type: 'match', title: 'New Match!', body: 'You matched with Alex Rivera', read: false, timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 'n3', type: 'governance', title: 'Proposal #44 Passed', body: 'DAO voted to enable SKYCOIN staking v2', read: false, timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'n4', type: 'system', title: 'AI Guard Alert', body: 'Suspicious login attempt blocked', read: false, timestamp: new Date(Date.now() - 1200000).toISOString() },
  { id: 'n5', type: 'like', title: '847 new likes', body: 'Your post went viral on the feed', read: true, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n6', type: 'message', title: 'New message', body: 'HOPE AI: Market analysis ready', read: true, timestamp: new Date(Date.now() - 7200000).toISOString() },
];

export const useAppStore = create<AppState>()(
  immer((set) => ({
    currentUser: MOCK_USER,
    isAuthenticated: true,

    notifications: MOCK_NOTIFICATIONS,
    unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
    markAllRead: () => set(state => {
      state.notifications.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    }),

    aiMode: {
      active: 'navigate',
      health: 97,
      tasksRunning: 14,
      memoryUsed: 68,
    },
    setAIMode: (mode) => set(state => { state.aiMode.active = mode; }),

    systemStatus: {
      uptime: 99.97,
      activeUsers: 24891,
      txPerSecond: 4420,
      aiQueueDepth: 7,
      feedLatency: 12,
      marketVolume: 8_420_000,
    },
    updateSystemStatus: (patch) => set(state => { Object.assign(state.systemStatus, patch); }),

    featureFlags: {
      'dating-ai-matching': true,
      'live-streaming': true,
      'nft-marketplace': true,
      'skycoin-staking': true,
      'digital-twin': true,
      'grey-area-sandbox': false,
      'dao-voting': true,
      'creator-monetization': true,
      'ai-agents-marketplace': true,
      'privacy-routing': false,
    },
    toggleFlag: (key) => set(state => {
      state.featureFlags[key] = !state.featureFlags[key];
    }),

    sidebarCollapsed: false,
    setSidebarCollapsed: (v) => set(state => { state.sidebarCollapsed = v; }),
  }))
);
