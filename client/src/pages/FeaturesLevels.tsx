import { useState } from "react";

/**
 * Features & Levels Page — Shows what's included at each subscription tier
 * and what modules are available at each level
 */
export default function FeaturesLevels() {
  const [activeTab, setActiveTab] = useState<"tiers" | "modules" | "roadmap">("tiers");

  const tiers = [
    {
      name: "Free",
      price: "$0",
      color: "from-gray-600 to-gray-800",
      badge: "STARTER",
      features: [
        "Social Feed (read + 5 posts/day)",
        "Basic Messaging (1-on-1)",
        "Explore & Discovery",
        "Basic Wallet (1 coin)",
        "Community Forums",
        "5 AI queries/day",
        "Basic Profile",
        "Public Marketplace browsing",
      ],
      limits: "5 posts/day, 5 AI queries, 1 coin wallet, no trading",
    },
    {
      name: "Pro",
      price: "$29/mo",
      color: "from-blue-600 to-cyan-500",
      badge: "POPULAR",
      features: [
        "Everything in Free +",
        "Unlimited Social Feed",
        "Dating / Match system",
        "Group Messaging + Video",
        "Multi-coin Wallet (all 7 coins)",
        "Basic Trading (market orders)",
        "50 AI queries/day",
        "Creator Studio access",
        "NFT Gallery (mint up to 10/mo)",
        "Casino (basic games)",
        "Gamification & Achievements",
        "Voice Navigation",
        "Basic Analytics",
        "Knowledge Base access",
      ],
      limits: "50 AI/day, 10 NFT mints/mo, basic trading only",
    },
    {
      name: "Enterprise",
      price: "$99/mo",
      color: "from-purple-600 to-pink-500",
      badge: "POWER USER",
      features: [
        "Everything in Pro +",
        "Unlimited AI (GPT-4, Claude, Gemini)",
        "AI Agent Builder (up to 10 agents)",
        "Advanced Trading (limit, stop, margin)",
        "Staking & Mining pools",
        "Token Burning portal",
        "Live Video streaming",
        "Advanced Analytics & Insights",
        "Ethical Hacking Tools",
        "Legal Tools & Smart Contracts",
        "E-learning (all courses)",
        "Project Management",
        "Scheduling & Calendar",
        "IoT & Smart Home",
        "Travel & Booking (crypto payments)",
        "Social Commerce (affiliate program)",
        "Priority Support",
      ],
      limits: "10 AI agents, standard API rate limits",
    },
    {
      name: "Ultimate",
      price: "$299/mo",
      color: "from-amber-500 to-red-600",
      badge: "UNLIMITED",
      features: [
        "Everything in Enterprise +",
        "Unlimited AI Agents",
        "AI Self-Improvement Engine",
        "Dev Workspace Enterprise (full IDE)",
        "Software Engineering Suite",
        "ML Pipeline (train & deploy models)",
        "Blockchain Integration (deploy contracts)",
        "Workflow Automation (unlimited)",
        "Multi-tenant SaaS tools",
        "White-label system",
        "API Gateway (unlimited calls)",
        "Real-time Collaboration",
        "Data Lake access",
        "ICO Portal (launch tokens)",
        "Advanced Security (2FA, WebAuthn)",
        "Dedicated Support + SLA",
        "Custom domain",
        "Revenue sharing (80/20)",
      ],
      limits: "No limits. Full platform access.",
    },
  ];

  const modules = [
    { category: "CORE", items: [
      { name: "Mission Control", level: "Free", desc: "Central dashboard with real-time metrics, live activity feed, system health monitoring" },
      { name: "Social Feed", level: "Free", desc: "Posts, likes, comments, shares, trending topics, hashtags" },
      { name: "Explore", level: "Free", desc: "Discover content, users, trending, recommendations" },
      { name: "Notifications", level: "Free", desc: "Push, in-app, email, SMS notifications with preferences" },
    ]},
    { category: "SOCIAL & MEDIA", items: [
      { name: "Dating / Match", level: "Pro", desc: "AI-powered matching, swipe, compatibility scores, video dates" },
      { name: "Messaging", level: "Free", desc: "1-on-1 chat (Free), group + video (Pro+)" },
      { name: "Live & Video", level: "Enterprise", desc: "Live streaming, video calls, screen sharing, recording" },
      { name: "Creator Studio", level: "Pro", desc: "Content creation tools, scheduling, analytics, monetization" },
      { name: "Social Graph", level: "Pro", desc: "Network visualization, connections, influence mapping" },
      { name: "NFT Gallery", level: "Pro", desc: "Mint, display, trade NFTs. 10/mo (Pro), unlimited (Enterprise+)" },
    ]},
    { category: "COMMERCE & FINANCE", items: [
      { name: "Marketplace", level: "Free (browse) / Pro (sell)", desc: "60+ categories, DHgate/Alibaba-style, escrow, ratings, reviews" },
      { name: "Wallet / Finance", level: "Free (1 coin) / Pro (all)", desc: "7 coins: SHADOW, SKY, TRUMP, DOGE, BTC, USDT, MONERO" },
      { name: "Exchange / DEX", level: "Enterprise", desc: "Advanced trading: limit, stop, margin orders. Real-time charts" },
      { name: "Payments Hub", level: "Pro", desc: "Send/receive payments, invoicing, Wise integration" },
      { name: "Crypto Suite", level: "Enterprise", desc: "Staking, mining pools, token burning, ICO participation" },
      { name: "Tokenomics", level: "Enterprise", desc: "Full token economy, ICO portal, whitepaper, vesting" },
      { name: "Casino", level: "Pro", desc: "Slots, blackjack, roulette, poker. Provably fair." },
      { name: "Social Commerce", level: "Enterprise", desc: "Live shopping, group buying, flash deals, affiliate program" },
      { name: "Travel & Booking", level: "Enterprise", desc: "Flights, hotels, experiences with crypto payment" },
    ]},
    { category: "AI & INTELLIGENCE", items: [
      { name: "HOPE AI Core", level: "Free (5/day) / Pro (50) / Ent (unlimited)", desc: "Multi-model AI: GPT-4, Claude, Gemini routing" },
      { name: "AI Agents", level: "Enterprise", desc: "Build, deploy, manage autonomous AI agents" },
      { name: "AI Enterprise Suite", level: "Ultimate", desc: "Code gen, analysis, research, translation, brainstorming" },
      { name: "AI Self-Improvement", level: "Ultimate", desc: "AI that codes its own upgrades 24/7, auto-deploys" },
      { name: "ML Pipeline", level: "Ultimate", desc: "Train, evaluate, deploy ML models" },
      { name: "Digital Twin", level: "Enterprise", desc: "AI clone of yourself for automated responses" },
    ]},
    { category: "DEVELOPER TOOLS", items: [
      { name: "Dev Workspace", level: "Ultimate", desc: "Monaco editor, AI pair programming, terminal, git integration" },
      { name: "Software Engineering", level: "Ultimate", desc: "Code generation, review, testing, deployment pipeline" },
      { name: "Ethical Hacking Tools", level: "Enterprise", desc: "Port scanner, vulnerability assessment, bug bounty, compliance" },
      { name: "Legal Tools", level: "Enterprise", desc: "Smart contracts, compliance, dispute resolution, IP protection" },
      { name: "API Gateway", level: "Ultimate", desc: "Advanced routing, rate limiting, versioning, monitoring" },
      { name: "Plugin Marketplace", level: "Pro", desc: "Install and build plugins to extend platform" },
    ]},
    { category: "ENTERPRISE & PLATFORM", items: [
      { name: "Multi-tenant SaaS", level: "Ultimate", desc: "Organizations, teams, SSO, billing, audit" },
      { name: "White-label System", level: "Ultimate", desc: "Custom branding, themes, domains for resellers" },
      { name: "Workflow Automation", level: "Ultimate", desc: "Zapier/n8n-style triggers, actions, execution" },
      { name: "Blockchain Integration", level: "Ultimate", desc: "Deploy smart contracts, NFT minting, DEX, staking" },
      { name: "Data Lake", level: "Ultimate", desc: "Enterprise data management, ETL, quality metrics" },
      { name: "Real-time Collaboration", level: "Ultimate", desc: "Multiplayer editing, presence, conflict resolution" },
      { name: "Project Management", level: "Enterprise", desc: "Kanban, sprints, time tracking (Linear/Jira-style)" },
      { name: "Scheduling", level: "Enterprise", desc: "Cal.com-style appointments, availability, bookings" },
      { name: "E-learning", level: "Enterprise", desc: "Courses, quizzes, certificates, progress tracking" },
      { name: "IoT & Smart Home", level: "Enterprise", desc: "Device management, automation, energy monitoring" },
      { name: "Health & Fitness", level: "Pro", desc: "Workout tracking, nutrition, goals, wearable integration" },
      { name: "CMS", level: "Enterprise", desc: "Content management, blog, media library, SEO" },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Features & Levels
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ShadowChat Ultimate Platform — 79+ modules, 100+ routers, enterprise-grade architecture.
            Choose your level and unlock the power.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {(["tiers", "modules", "roadmap"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab === "tiers" ? "Subscription Tiers" : tab === "modules" ? "All Modules" : "Roadmap"}
            </button>
          ))}
        </div>

        {/* Tiers View */}
        {activeTab === "tiers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className="rounded-xl border border-border bg-card p-6 flex flex-col">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${tier.color} text-white w-fit mb-4`}>
                  {tier.badge}
                </div>
                <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                <p className="text-3xl font-bold text-cyan-400 mb-4">{tier.price}</p>
                <ul className="space-y-2 flex-1 mb-4">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
                  <strong>Limits:</strong> {tier.limits}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modules View */}
        {activeTab === "modules" && (
          <div className="space-y-8">
            {modules.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 uppercase tracking-wider">{cat.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.items.map((item) => (
                    <div key={item.name} className="rounded-lg border border-border bg-card/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.level.includes("Free") ? "bg-gray-500/20 text-gray-400" :
                          item.level.includes("Pro") ? "bg-blue-500/20 text-blue-400" :
                          item.level.includes("Enterprise") ? "bg-purple-500/20 text-purple-400" :
                          "bg-amber-500/20 text-amber-400"
                        }`}>
                          {item.level.split(" /")[0]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roadmap View */}
        {activeTab === "roadmap" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">✅ LIVE NOW — v96</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>• 79 Router Files</span>
                <span>• 100+ API Procedures</span>
                <span>• 55+ Frontend Pages</span>
                <span>• 7 Cryptocurrencies</span>
                <span>• Enterprise AI Suite</span>
                <span>• Full Trading Engine</span>
                <span>• Social Commerce</span>
                <span>• IoT Integration</span>
                <span>• Travel & Booking</span>
                <span>• E-learning Platform</span>
                <span>• Project Management</span>
                <span>• Blockchain/DeFi</span>
              </div>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">🚀 COMING NEXT — v100</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>• Mobile App (iOS/Android)</span>
                <span>• AR/VR Metaverse</span>
                <span>• Voice AI Assistant</span>
                <span>• Decentralized Identity</span>
                <span>• Cross-chain Bridge</span>
                <span>• AI Video Generation</span>
                <span>• Quantum-safe Encryption</span>
                <span>• Satellite Integration</span>
              </div>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-3">🔮 FUTURE — v200</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>• AGI Integration</span>
                <span>• Brain-Computer Interface</span>
                <span>• Autonomous Economy</span>
                <span>• Space Commerce</span>
                <span>• DNA Data Storage</span>
                <span>• Neural Network OS</span>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="rounded-xl border border-border bg-card p-6 mt-8">
              <h3 className="text-lg font-bold mb-4">Platform Architecture Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">79</p>
                  <p className="text-xs text-muted-foreground">Router Files</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">100+</p>
                  <p className="text-xs text-muted-foreground">API Procedures</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">55+</p>
                  <p className="text-xs text-muted-foreground">Frontend Pages</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">0</p>
                  <p className="text-xs text-muted-foreground">TS Errors</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
