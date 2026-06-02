// ─── Shared Mock Data for ShadowChat Ultimate ────────────────────────────────
// Used across all 30 modules for realistic demo data

export const TOKENS = [
  { symbol: 'SKYCOIN', name: 'SKYCOIN4444', price: 4.44, change: +12.4, balance: 4444444, color: '#22d3ee' },
  { symbol: 'BTC', name: 'Bitcoin', price: 67420, change: +2.1, balance: 0.842, color: '#f59e0b' },
  { symbol: 'ETH', name: 'Ethereum', price: 3840, change: +1.8, balance: 12.4, color: '#8b5cf6' },
  { symbol: 'SOL', name: 'Solana', price: 182, change: +5.3, balance: 240, color: '#10b981' },
  { symbol: 'USDT', name: 'Tether', price: 1.00, change: 0, balance: 24500, color: '#6b7280' },
  { symbol: 'TRUMP', name: 'TRUMP Coin', price: 8.72, change: +18.2, balance: 10000, color: '#ef4444' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.182, change: +3.7, balance: 50000, color: '#eab308' },
];

export const FEED_POSTS = [
  {
    id: 'p1', user: 'Alex Rivera', handle: '@alexr', avatar: 'AR', verified: true,
    content: 'Just staked 100K SKYCOIN4444 in the AetherLux Vault. 44% APY is absolutely insane 🚀 The deflationary mechanics are working perfectly.',
    likes: 2847, comments: 342, shares: 891, time: '2m ago', trending: true,
    tags: ['#SKYCOIN4444', '#DeFi', '#Staking'],
  },
  {
    id: 'p2', user: 'Maya Chen', handle: '@mayachain', avatar: 'MC', verified: true,
    content: 'HOPE AI just predicted the BTC breakout 4 hours before it happened. The digital twin behavioral model is on another level. This is the future of trading intelligence.',
    likes: 5621, comments: 891, shares: 2103, time: '15m ago', trending: true,
    tags: ['#HOPEAI', '#Bitcoin', '#AITrading'],
  },
  {
    id: 'p3', user: 'Jordan Wells', handle: '@jwells', avatar: 'JW', verified: false,
    content: 'The ShadowChat marketplace just hit $8.4M daily volume. Creator monetization is up 340% this month. We\'re building the next generation digital economy.',
    likes: 1204, comments: 156, shares: 445, time: '1h ago', trending: false,
    tags: ['#ShadowChat', '#Marketplace', '#Web3'],
  },
  {
    id: 'p4', user: 'Zara Knight', handle: '@zaraknights', avatar: 'ZK', verified: true,
    content: 'Governance Proposal #47: Enable cross-chain SKYCOIN bridge to Ethereum. Voting opens in 24h. Every holder gets a say. This is what decentralized governance looks like.',
    likes: 3890, comments: 567, shares: 1234, time: '2h ago', trending: true,
    tags: ['#DAO', '#Governance', '#SKYCOIN4444'],
  },
  {
    id: 'p5', user: 'Sam Torres', handle: '@samtorres', avatar: 'ST', verified: false,
    content: 'Just deployed my first AI agent on the ShadowChat agent marketplace. It auto-trades, posts content, and manages my social graph. Passive income from intelligence 🤖',
    likes: 987, comments: 203, shares: 312, time: '3h ago', trending: false,
    tags: ['#AIAgents', '#Automation', '#PassiveIncome'],
  },
];

export const MARKET_CANDLES = (() => {
  const candles = [];
  let price = 4.00;
  const now = Date.now();
  for (let i = 200; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.48) * 0.15;
    const close = Math.max(0.1, open * (1 + change));
    const high = Math.max(open, close) * (1 + Math.random() * 0.03);
    const low = Math.min(open, close) * (1 - Math.random() * 0.03);
    candles.push({
      time: Math.floor((now - i * 3600000) / 1000),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: Math.floor(Math.random() * 2000000 + 500000),
    });
    price = close;
  }
  return candles;
})();

export const ANALYTICS_DATA = {
  dailyUsers: [
    { date: 'Mon', users: 18200, revenue: 42000 },
    { date: 'Tue', users: 21400, revenue: 51000 },
    { date: 'Wed', users: 19800, revenue: 47000 },
    { date: 'Thu', users: 23100, revenue: 58000 },
    { date: 'Fri', users: 26700, revenue: 71000 },
    { date: 'Sat', users: 24500, revenue: 65000 },
    { date: 'Sun', users: 22300, revenue: 59000 },
  ],
  moduleUsage: [
    { name: 'Social Feed', value: 31, color: '#22d3ee' },
    { name: 'Wallet', value: 22, color: '#f59e0b' },
    { name: 'Marketplace', value: 18, color: '#8b5cf6' },
    { name: 'AI Core', value: 14, color: '#10b981' },
    { name: 'Live Video', value: 9, color: '#ef4444' },
    { name: 'Other', value: 6, color: '#6b7280' },
  ],
  revenueStreams: [
    { month: 'Jan', marketplace: 120000, trading: 85000, creator: 45000, staking: 32000 },
    { month: 'Feb', marketplace: 145000, trading: 92000, creator: 58000, staking: 41000 },
    { month: 'Mar', marketplace: 168000, trading: 110000, creator: 72000, staking: 55000 },
    { month: 'Apr', marketplace: 195000, trading: 128000, creator: 89000, staking: 68000 },
    { month: 'May', marketplace: 228000, trading: 145000, creator: 104000, staking: 82000 },
    { month: 'Jun', marketplace: 264000, trading: 167000, creator: 121000, staking: 97000 },
  ],
};

export const MARKETPLACE_ITEMS = [
  { id: 'm1', name: 'AI Trading Bot Pro', category: 'Digital Goods', price: 299, currency: 'USDT', seller: 'TechLabs', rating: 4.9, sales: 1240, image: '🤖' },
  { id: 'm2', name: 'Luxury Watch NFT', category: 'Luxury', price: 4444, currency: 'SKYCOIN', seller: 'LuxuryVault', rating: 4.8, sales: 89, image: '⌚' },
  { id: 'm3', name: 'Creator Analytics Suite', category: 'SaaS', price: 49, currency: 'USDT', seller: 'DataForge', rating: 4.7, sales: 3400, image: '📊' },
  { id: 'm4', name: 'HOPE AI Agent License', category: 'AI Tools', price: 999, currency: 'SKYCOIN', seller: 'HopeAI', rating: 5.0, sales: 567, image: '🧠' },
  { id: 'm5', name: 'Privacy VPN Bundle', category: 'Security', price: 89, currency: 'USDT', seller: 'ShadowNet', rating: 4.6, sales: 2100, image: '🔐' },
  { id: 'm6', name: 'Social Graph Analyzer', category: 'Analytics', price: 199, currency: 'USDT', seller: 'GraphMind', rating: 4.8, sales: 890, image: '🕸️' },
];

export const GOVERNANCE_PROPOSALS = [
  { id: 'p44', title: 'Enable SKYCOIN Cross-Chain Bridge', status: 'active', votes: { yes: 68420, no: 12300 }, quorum: 75000, ends: '23h 14m', proposer: 'Core Team' },
  { id: 'p43', title: 'Increase Creator Revenue Share to 85%', status: 'passed', votes: { yes: 89200, no: 8100 }, quorum: 75000, ends: 'Ended', proposer: 'Community' },
  { id: 'p42', title: 'Launch SKYCOIN Staking v2 (AetherLux)', status: 'passed', votes: { yes: 92100, no: 4200 }, quorum: 75000, ends: 'Ended', proposer: 'Core Team' },
  { id: 'p41', title: 'Add Monero Privacy Layer', status: 'rejected', votes: { yes: 31000, no: 58000 }, quorum: 75000, ends: 'Ended', proposer: 'Privacy Guild' },
];

export const AI_AGENTS = [
  { id: 'a1', name: 'TradeMaster Pro', type: 'Trading', status: 'running', tasks: 847, accuracy: 94.2, earnings: 12400, icon: '📈' },
  { id: 'a2', name: 'ContentGenius', type: 'Social', status: 'running', tasks: 2341, accuracy: 91.8, earnings: 4200, icon: '✍️' },
  { id: 'a3', name: 'MarketScout', type: 'Research', status: 'idle', tasks: 456, accuracy: 88.4, earnings: 1800, icon: '🔍' },
  { id: 'a4', name: 'SecurityGuard', type: 'Security', status: 'running', tasks: 12840, accuracy: 99.1, earnings: 0, icon: '🛡️' },
  { id: 'a5', name: 'SocialOptimizer', type: 'Growth', status: 'running', tasks: 1203, accuracy: 86.7, earnings: 3100, icon: '🚀' },
];

export const NETWORK_NODES = [
  { id: 'you', label: 'You', val: 20, color: '#22d3ee' },
  { id: 'alex', label: 'Alex R.', val: 12, color: '#8b5cf6' },
  { id: 'maya', label: 'Maya C.', val: 15, color: '#10b981' },
  { id: 'jordan', label: 'Jordan W.', val: 8, color: '#f59e0b' },
  { id: 'zara', label: 'Zara K.', val: 18, color: '#ef4444' },
  { id: 'sam', label: 'Sam T.', val: 10, color: '#22d3ee' },
  { id: 'hope', label: 'HOPE AI', val: 25, color: '#22d3ee' },
  { id: 'dao', label: 'DAO Core', val: 22, color: '#f59e0b' },
];

export const NETWORK_LINKS = [
  { source: 'you', target: 'alex', value: 5 },
  { source: 'you', target: 'maya', value: 8 },
  { source: 'you', target: 'hope', value: 10 },
  { source: 'you', target: 'jordan', value: 3 },
  { source: 'alex', target: 'zara', value: 6 },
  { source: 'maya', target: 'dao', value: 7 },
  { source: 'hope', target: 'dao', value: 9 },
  { source: 'zara', target: 'sam', value: 4 },
  { source: 'sam', target: 'jordan', value: 2 },
  { source: 'dao', target: 'alex', value: 5 },
];

export function formatCurrency(n: number, symbol = '$') {
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(1)}K`;
  return `${symbol}${n.toFixed(2)}`;
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateSparkline(points = 20, base = 100, volatility = 10) {
  const data = [];
  let val = base;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * volatility;
    data.push(Math.max(0, val));
  }
  return data;
}
