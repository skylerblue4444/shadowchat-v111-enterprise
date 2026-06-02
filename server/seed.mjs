/**
 * ShadowChat Ultimate — Master Seed Script
 * Seeds ALL modules with rich demo content so the platform feels alive from day 1.
 * Run: node server/seed.mjs
 */
import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const pool = mysql.createPool(DATABASE_URL + "&multipleStatements=true");

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const USERS = [
  { name: "Skyler Blue", username: "skylerblue4444", email: "skyler@shadowchat.io", role: "admin", level: 99, xp: 999999, isVerified: true },
  { name: "HOPE AI Oracle", username: "hopeai_oracle", email: "hope@shadowchat.io", role: "admin", level: 88, xp: 880000, isVerified: true },
  { name: "Crypto Samurai", username: "cryptosamurai", email: "samurai@shadowchat.io", role: "user", level: 72, xp: 720000, isVerified: true },
  { name: "Shadow Witch", username: "shadowwitch", email: "witch@shadowchat.io", role: "user", level: 65, xp: 650000, isVerified: true },
  { name: "NeonDrake", username: "neondrake", email: "drake@shadowchat.io", role: "user", level: 58, xp: 580000, isVerified: true },
  { name: "Luna Cipher", username: "lunacipher", email: "luna@shadowchat.io", role: "user", level: 51, xp: 510000, isVerified: false },
  { name: "ByteStorm", username: "bytestorm", email: "byte@shadowchat.io", role: "user", level: 44, xp: 440000, isVerified: true },
  { name: "Aria Quantum", username: "ariaquantum", email: "aria@shadowchat.io", role: "user", level: 39, xp: 390000, isVerified: false },
  { name: "DarkMatter", username: "darkmatter", email: "dark@shadowchat.io", role: "user", level: 33, xp: 330000, isVerified: true },
  { name: "Phoenix Rise", username: "phoenixrise", email: "phoenix@shadowchat.io", role: "user", level: 27, xp: 270000, isVerified: false },
];

const POSTS = [
  { content: "Just deployed my first AI agent on ShadowChat! It's analyzing crypto sentiment in real-time and already identified 3 alpha plays 🚀 #SKYCOIN4444 #AIAgents", tags: ["SKYCOIN4444","AIAgents"], likes: 847, reposts: 234, comments: 89, views: 12400, aiScore: 94.5 },
  { content: "The SkyWorld metaverse just hit 10,000 concurrent users. The virtual real estate market is BOOMING. My plot near the central hub is up 340% 📈", tags: ["SkyWorld","Metaverse","VirtualRealEstate"], likes: 1243, reposts: 456, comments: 167, views: 28900, aiScore: 97.2 },
  { content: "SHADOW token just broke through $4.44 resistance. The tokenomics are insane — 2% burn on every transaction + staking rewards. This is going to $100 💎🙌", tags: ["SHADOW","Crypto","DeFi"], likes: 2341, reposts: 891, comments: 345, views: 45600, aiScore: 88.7 },
  { content: "Built a custom trading bot using the ShadowChat API Ecosystem. It's executing 200+ trades/day with 73% win rate. The documentation is actually incredible.", tags: ["Trading","API","Automation"], likes: 567, reposts: 123, comments: 78, views: 8900, aiScore: 91.3 },
  { content: "The ethical hacking tools just found a vulnerability in my smart contract before deployment. Saved me potentially $2M in losses. This platform is next level 🔒", tags: ["Security","SmartContracts","EthicalHacking"], likes: 1890, reposts: 567, comments: 234, views: 34500, aiScore: 95.8 },
  { content: "Dating module AI matched me with someone who shares my exact interests in quantum computing and DeFi. We've been talking for 3 hours straight 💕", tags: ["Dating","AI","Connection"], likes: 432, reposts: 67, comments: 156, views: 6700, aiScore: 82.4 },
  { content: "Just minted my digital artwork as an NFT on the ShadowChat marketplace. Already got 5 offers within the first hour! The creator economy here is thriving 🎨", tags: ["NFT","Art","CreatorEconomy"], likes: 789, reposts: 234, comments: 98, views: 15600, aiScore: 89.1 },
  { content: "The DAO governance just passed proposal #47 — community treasury will fund 10 new developer grants. Democracy in action! 🗳️ #ShadowDAO", tags: ["DAO","Governance","Community"], likes: 1567, reposts: 445, comments: 289, views: 23400, aiScore: 93.6 },
  { content: "HOPE AI just helped me write a complete smart contract audit report in 30 seconds. The legal tools integration is chef's kiss 👨‍🍳", tags: ["HopeAI","Legal","SmartContracts"], likes: 678, reposts: 189, comments: 67, views: 11200, aiScore: 90.2 },
  { content: "Live streaming my coding session building a DeFi protocol on ShadowChat. 2,400 viewers and counting! The community support is unreal 🔴", tags: ["LiveStream","DeFi","Coding"], likes: 1234, reposts: 345, comments: 456, views: 38900, aiScore: 96.1 },
  { content: "The marketplace just added DHgate-style wholesale electronics. Got a batch of 50 smart watches for $3 each. Reselling on Amazon for $29.99 💰", tags: ["Marketplace","Wholesale","Business"], likes: 2100, reposts: 678, comments: 345, views: 52000, aiScore: 87.5 },
  { content: "Staking 100K SHADOW tokens at 24% APY. Passive income hits different when the platform actually works. Monthly yield: $4,800 🏦", tags: ["Staking","PassiveIncome","SHADOW"], likes: 3456, reposts: 1234, comments: 567, views: 78900, aiScore: 92.8 },
  { content: "The voice navigation is INSANE. I just said 'buy 1000 SHADOW tokens' and it executed the trade in 0.8 seconds. Hands-free trading is the future 🎙️", tags: ["VoiceNav","Trading","Innovation"], likes: 890, reposts: 234, comments: 123, views: 14500, aiScore: 94.0 },
  { content: "Won $12,000 in the ShadowChat casino playing blackjack last night. The provably fair system means you can verify every hand on-chain ♠️", tags: ["Casino","Blackjack","Crypto"], likes: 1567, reposts: 456, comments: 234, views: 29800, aiScore: 85.3 },
  { content: "The charity module just raised $500K for clean water projects. 100% transparent — every donation tracked on blockchain. This is how crypto should be used 🌍", tags: ["Charity","Blockchain","Impact"], likes: 4567, reposts: 2345, comments: 890, views: 98700, aiScore: 99.1 },
  { content: "My AI digital twin just handled 47 customer support tickets while I slept. It learned my communication style perfectly. The future is NOW 🤖", tags: ["DigitalTwin","AI","Automation"], likes: 2345, reposts: 789, comments: 345, views: 45600, aiScore: 96.7 },
  { content: "Just completed the ShadowChat ethical hacking certification. The penetration testing tools are enterprise-grade. Found 3 bugs in my own app 🐛", tags: ["EthicalHacking","Certification","Security"], likes: 567, reposts: 123, comments: 89, views: 9800, aiScore: 88.9 },
  { content: "The ICO portal just launched Phase 3. Early investors from Phase 1 are already up 1,200%. This is generational wealth building 📊", tags: ["ICO","Investment","Crypto"], likes: 3890, reposts: 1567, comments: 678, views: 67800, aiScore: 91.5 },
  { content: "Built a full e-commerce store using ShadowChat's plugin marketplace. Integrated payments, inventory, and AI customer service in 2 hours ⚡", tags: ["Ecommerce","Plugins","Business"], likes: 1234, reposts: 345, comments: 167, views: 21000, aiScore: 93.2 },
  { content: "The social graph visualization just showed me I'm connected to 12,000 users through 3 degrees of separation. Network effects are real 🕸️", tags: ["SocialGraph","Network","Community"], likes: 678, reposts: 189, comments: 78, views: 12300, aiScore: 87.8 },
];

const DATING_PROFILES = [
  { bio: "Crypto trader by day, AI researcher by night. Looking for someone who understands blockchain and doesn't think NFTs are just JPEGs.", interests: ["Crypto","AI","Philosophy","Travel"], lookingFor: "relationship", location: "San Francisco, CA" },
  { bio: "Full-stack developer building the future of decentralized finance. Love hiking, coffee, and late-night coding sessions.", interests: ["DeFi","Hiking","Coffee","Music"], lookingFor: "relationship", location: "Austin, TX" },
  { bio: "Digital artist and NFT creator. My work has sold for over $200K. Looking for creative souls who see the world differently.", interests: ["Art","NFTs","Photography","Meditation"], lookingFor: "dating", location: "New York, NY" },
  { bio: "Quantum computing researcher at MIT. Fascinated by the intersection of physics and cryptocurrency. Let's talk about the multiverse.", interests: ["Quantum","Physics","Crypto","Books"], lookingFor: "relationship", location: "Boston, MA" },
  { bio: "Serial entrepreneur with 3 exits. Building my 4th startup on ShadowChat. Looking for someone ambitious who dreams big.", interests: ["Startups","Investing","Fitness","Wine"], lookingFor: "dating", location: "Miami, FL" },
  { bio: "Ethical hacker and cybersecurity consultant. I break things for a living (legally). Love puzzles, escape rooms, and CTF competitions.", interests: ["Security","Puzzles","Gaming","Cooking"], lookingFor: "relationship", location: "Seattle, WA" },
  { bio: "Music producer and DJ. Creating AI-generated beats that hit different. Looking for someone who vibes with experimental sounds.", interests: ["Music","AI","Festivals","Yoga"], lookingFor: "dating", location: "Los Angeles, CA" },
  { bio: "Data scientist turned crypto whale. Retired at 28. Now I mentor young traders and build AI models for fun.", interests: ["Data","Trading","Mentoring","Surfing"], lookingFor: "relationship", location: "Bali, Indonesia" },
];

const MARKETPLACE_ITEMS = [
  { title: "Smart Watch Pro X9 - Wholesale (50 units)", desc: "AMOLED display, heart rate, GPS, 7-day battery. MOQ 50 units.", price: 3.49, category: "Electronics", seller: "ShenZhen Direct", rating: 4.8, sold: 12400, image: "smartwatch" },
  { title: "Wireless Earbuds ANC - Factory Direct", desc: "Active noise cancellation, 30hr battery, Bluetooth 5.3", price: 2.89, category: "Electronics", seller: "GuangZhou Audio", rating: 4.7, sold: 8900, image: "earbuds" },
  { title: "4K Action Camera Waterproof Bundle", desc: "4K60fps, EIS stabilization, waterproof 30m, 2 batteries included", price: 8.99, category: "Electronics", seller: "DongGuan Tech", rating: 4.6, sold: 5600, image: "camera" },
  { title: "RGB Mechanical Gaming Keyboard", desc: "Hot-swappable switches, PBT keycaps, wireless/wired", price: 4.29, category: "Electronics", seller: "YiWu Gaming", rating: 4.9, sold: 15600, image: "keyboard" },
  { title: "Portable Power Station 1000W", desc: "1024Wh LiFePO4, solar input, 6 AC outlets", price: 89.99, category: "Electronics", seller: "BaoAn Energy", rating: 4.8, sold: 3400, image: "powerstation" },
  { title: "AI Code Assistant - Lifetime License", desc: "GPT-4 powered IDE plugin. Auto-complete, refactor, debug.", price: 49.99, category: "Software", seller: "ShadowDev Tools", rating: 4.9, sold: 23000, image: "software" },
  { title: "Crypto Hardware Wallet - Military Grade", desc: "Air-gapped, 2048-bit encryption, supports 10,000+ tokens", price: 12.99, category: "Crypto", seller: "SecureVault HK", rating: 4.8, sold: 7800, image: "wallet" },
  { title: "VPN Router Pre-configured (No Logs)", desc: "OpenWrt flashed, 5 VPN protocols, 1Gbps throughput", price: 15.99, category: "Security", seller: "PrivacyFirst", rating: 4.7, sold: 4500, image: "router" },
  { title: "Drone 4K GPS Foldable Professional", desc: "3-axis gimbal, 45min flight, 10km range, obstacle avoidance", price: 45.99, category: "Electronics", seller: "SkyTech Shenzhen", rating: 4.6, sold: 6700, image: "drone" },
  { title: "LED Strip Lights 20m Smart WiFi", desc: "RGBIC, music sync, Alexa/Google compatible, app control", price: 1.89, category: "Home", seller: "LightWave Factory", rating: 4.5, sold: 34000, image: "ledstrip" },
  { title: "Mining Rig Frame 12 GPU Open Air", desc: "Aluminum alloy, stackable, with fans and risers included", price: 34.99, category: "Crypto", seller: "MineForge", rating: 4.7, sold: 2300, image: "miningrig" },
  { title: "Smart Home Hub - Zigbee/Z-Wave/WiFi", desc: "Control 500+ devices, local processing, no cloud required", price: 6.99, category: "Home", seller: "IoT Solutions", rating: 4.8, sold: 8900, image: "smarthub" },
  { title: "Penetration Testing USB Toolkit", desc: "Rubber ducky + WiFi pineapple + LAN turtle combo", price: 24.99, category: "Security", seller: "HackLab Pro", rating: 4.9, sold: 1200, image: "pentest" },
  { title: "3D Printer Resin - High Detail", desc: "8K resolution, 405nm UV, low odor, 1000ml bottle", price: 5.49, category: "Manufacturing", seller: "PrintMaster CN", rating: 4.6, sold: 11000, image: "resin" },
  { title: "Solar Panel 400W Monocrystalline", desc: "23.5% efficiency, 25-year warranty, PERC cells", price: 55.99, category: "Energy", seller: "SunPower Direct", rating: 4.8, sold: 4500, image: "solar" },
  { title: "NFC Business Cards - Programmable (100 pack)", desc: "Tap to share contact/website/crypto wallet. Custom print.", price: 0.89, category: "Business", seller: "SmartCard Factory", rating: 4.7, sold: 19000, image: "nfccard" },
  { title: "AI Training Dataset - 10M Images Labeled", desc: "ImageNet-compatible, 1000 categories, commercial license", price: 199.99, category: "AI/ML", seller: "DataForge", rating: 4.9, sold: 890, image: "dataset" },
  { title: "Server Rack 42U with PDU", desc: "19-inch standard, cable management, 2x 30A PDU included", price: 299.99, category: "Enterprise", seller: "RackSpace Direct", rating: 4.8, sold: 670, image: "rack" },
  { title: "Quantum Random Number Generator USB", desc: "True quantum randomness, 1Gbps output, NIST certified", price: 89.99, category: "Security", seller: "QuantumBits", rating: 4.9, sold: 340, image: "qrng" },
  { title: "E-Ink Display 13.3\" Development Kit", desc: "2200x1650, partial refresh 120ms, SPI interface", price: 42.99, category: "Electronics", seller: "PaperTech", rating: 4.6, sold: 1800, image: "eink" },
];

const AI_AGENTS = [
  { name: "Alpha Hunter", desc: "Scans 500+ crypto pairs for breakout patterns. 78% accuracy on 4H timeframe.", category: "Trading", price: 29.99, rating: 4.9, users: 12400 },
  { name: "Code Reviewer Pro", desc: "Reviews PRs for security vulnerabilities, performance issues, and best practices.", category: "Development", price: 19.99, rating: 4.8, users: 8900 },
  { name: "Content Creator AI", desc: "Generates viral social media posts, threads, and video scripts optimized for engagement.", category: "Marketing", price: 14.99, rating: 4.7, users: 23000 },
  { name: "Smart Contract Auditor", desc: "Analyzes Solidity/Rust contracts for reentrancy, overflow, and logic bugs.", category: "Security", price: 49.99, rating: 4.9, users: 5600 },
  { name: "Portfolio Optimizer", desc: "Rebalances crypto portfolio based on risk tolerance and market conditions.", category: "Finance", price: 24.99, rating: 4.8, users: 7800 },
  { name: "Customer Support Bot", desc: "Handles 95% of support tickets with human-like responses. Learns from your docs.", category: "Business", price: 39.99, rating: 4.7, users: 15600 },
  { name: "Research Synthesizer", desc: "Reads 100+ papers/day and produces actionable summaries with citations.", category: "Research", price: 34.99, rating: 4.9, users: 4500 },
  { name: "Legal Document Drafter", desc: "Generates contracts, NDAs, and compliance docs tailored to your jurisdiction.", category: "Legal", price: 44.99, rating: 4.8, users: 3400 },
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log("🌱 Starting ShadowChat Ultimate seed...\n");

    // 1. Seed users (skip if exist)
    console.log("👤 Seeding users...");
    for (const u of USERS) {
      await conn.execute(
        `INSERT IGNORE INTO users (name, username, email, role, level, xp, isVerified, openId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [u.name, u.username, u.email, u.role, u.level, u.xp, u.isVerified, `seed_${u.username}`]
      );
    }
    console.log(`   ✅ ${USERS.length} users seeded`);

    // Get user IDs
    const [userRows] = await conn.execute("SELECT id, username FROM users ORDER BY id LIMIT 10");
    const userIds = userRows.map(r => r.id);
    if (userIds.length === 0) { console.log("⚠️ No users found, skipping dependent seeds"); return; }

    // 2. Seed posts
    console.log("📝 Seeding social posts...");
    for (let i = 0; i < POSTS.length; i++) {
      const p = POSTS[i];
      const authorId = userIds[i % userIds.length];
      await conn.execute(
        `INSERT IGNORE INTO posts (authorId, content, tags, likes, reposts, comments, views, aiScore, isHidden, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, false, DATE_SUB(NOW(), INTERVAL ? HOUR), NOW())`,
        [authorId, p.content, JSON.stringify(p.tags), p.likes, p.reposts, p.comments, p.views, p.aiScore, i * 3]
      );
    }
    console.log(`   ✅ ${POSTS.length} posts seeded`);

    // 3. Seed dating profiles
    console.log("💕 Seeding dating profiles...");
    for (let i = 0; i < DATING_PROFILES.length; i++) {
      const dp = DATING_PROFILES[i];
      const userId = userIds[(i + 2) % userIds.length];
      await conn.execute(
        `INSERT IGNORE INTO dating_profiles (userId, bio, interests, lookingFor, location, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, true, NOW(), NOW())`,
        [userId, dp.bio, JSON.stringify(dp.interests), dp.lookingFor, dp.location]
      );
    }
    console.log(`   ✅ ${DATING_PROFILES.length} dating profiles seeded`);

    // 4. Seed marketplace items
    console.log("🛒 Seeding marketplace items...");
    for (let i = 0; i < MARKETPLACE_ITEMS.length; i++) {
      const item = MARKETPLACE_ITEMS[i];
      const sellerId = userIds[i % userIds.length];
      await conn.execute(
        `INSERT IGNORE INTO marketplace_items (sellerId, title, description, price, category, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
        [sellerId, item.title, item.desc, item.price, item.category]
      );
    }
    console.log(`   ✅ ${MARKETPLACE_ITEMS.length} marketplace items seeded`);

    // 5. Seed AI agents
    console.log("🤖 Seeding AI agents...");
    for (let i = 0; i < AI_AGENTS.length; i++) {
      const agent = AI_AGENTS[i];
      const creatorId = userIds[i % userIds.length];
      await conn.execute(
        `INSERT IGNORE INTO ai_agents (creatorId, name, description, category, price, rating, totalUsers, isPublic, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, true, 'active', NOW(), NOW())`,
        [creatorId, agent.name, agent.desc, agent.category, agent.price, agent.rating, agent.users]
      );
    }
    console.log(`   ✅ ${AI_AGENTS.length} AI agents seeded`);

    console.log("\n🎉 Seed complete! Platform is alive with content.");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
