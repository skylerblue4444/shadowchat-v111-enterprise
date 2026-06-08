import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Filter, Star, TrendingUp, Plus, ShoppingCart, Package, Truck, Shield, Zap, Heart, Eye, ChevronDown, X, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Pre-seeded DHgate/Alibaba-style Product Catalog ─────────────────── */
const CATEGORIES = [
  { id: "all", label: "All Products", icon: "🏪", count: 64 },
  { id: "electronics", label: "Electronics", icon: "📱", count: 12 },
  { id: "crypto-hardware", label: "Crypto Mining", icon: "⛏️", count: 8 },
  { id: "fashion", label: "Fashion & Luxury", icon: "👔", count: 10 },
  { id: "software", label: "Software & SaaS", icon: "💻", count: 8 },
  { id: "digital", label: "Digital Goods", icon: "🎮", count: 8 },
  { id: "services", label: "Services", icon: "🛠️", count: 6 },
  { id: "security", label: "Security Tools", icon: "🔐", count: 6 },
  { id: "ai-tools", label: "AI & ML Tools", icon: "🤖", count: 6 },
];

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  category: string;
  seller: string;
  sellerRating: number;
  sellerOrders: number;
  sellerVerified: boolean;
  rating: number;
  reviews: number;
  sold: number;
  shipping: string;
  tags: string[];
  hot?: boolean;
  featured?: boolean;
}

const PRODUCTS: Product[] = [
  // Electronics
  { id: "e1", name: "ASIC Miner S21 Pro 200TH/s Bitcoin", price: 4299, originalPrice: 5499, currency: "USDT", image: "⛏️", category: "crypto-hardware", seller: "CryptoMining Pro", sellerRating: 4.9, sellerOrders: 12400, sellerVerified: true, rating: 4.8, reviews: 847, sold: 2340, shipping: "Free Express", tags: ["BTC", "Mining", "ASIC"], hot: true },
  { id: "e2", name: "GPU RTX 5090 Mining Edition 48GB", price: 2199, originalPrice: 2899, currency: "USDT", image: "🖥️", category: "crypto-hardware", seller: "TechVault Global", sellerRating: 4.8, sellerOrders: 8900, sellerVerified: true, rating: 4.7, reviews: 523, sold: 1890, shipping: "Free DHL", tags: ["GPU", "Mining", "NVIDIA"], hot: true },
  { id: "e3", name: "Ledger Nano X Pro - Cold Wallet", price: 149, originalPrice: 199, currency: "USDT", image: "🔐", category: "electronics", seller: "SecureWallet Store", sellerRating: 4.9, sellerOrders: 45000, sellerVerified: true, rating: 4.9, reviews: 12400, sold: 89000, shipping: "Free", tags: ["Wallet", "Security", "Cold Storage"], featured: true },
  { id: "e4", name: "Trezor Model T - Hardware Wallet", price: 219, currency: "USDT", image: "🛡️", category: "electronics", seller: "CryptoSafe Official", sellerRating: 4.8, sellerOrders: 23000, sellerVerified: true, rating: 4.8, reviews: 8900, sold: 56000, shipping: "Free Express", tags: ["Wallet", "Security"] },
  { id: "e5", name: "iPhone 16 Pro Max 1TB Unlocked", price: 1599, originalPrice: 1799, currency: "USDT", image: "📱", category: "electronics", seller: "GlobalTech Direct", sellerRating: 4.7, sellerOrders: 67000, sellerVerified: true, rating: 4.6, reviews: 3400, sold: 12000, shipping: "Free FedEx", tags: ["Apple", "Phone"] },
  { id: "e6", name: "MacBook Pro M4 Max 128GB/4TB", price: 4499, currency: "USDT", image: "💻", category: "electronics", seller: "AppleWholesale", sellerRating: 4.9, sellerOrders: 34000, sellerVerified: true, rating: 4.9, reviews: 2100, sold: 8900, shipping: "Free Express", tags: ["Apple", "Laptop", "Pro"] },
  { id: "e7", name: "Samsung Galaxy S25 Ultra 512GB", price: 1199, originalPrice: 1399, currency: "USDT", image: "📲", category: "electronics", seller: "MobileHub", sellerRating: 4.6, sellerOrders: 29000, sellerVerified: true, rating: 4.5, reviews: 1800, sold: 7600, shipping: "Free", tags: ["Samsung", "Phone"] },
  { id: "e8", name: "Sony WH-1000XM6 Noise Cancelling", price: 349, originalPrice: 449, currency: "USDT", image: "🎧", category: "electronics", seller: "AudioPro Store", sellerRating: 4.8, sellerOrders: 18000, sellerVerified: true, rating: 4.7, reviews: 4500, sold: 23000, shipping: "Free", tags: ["Audio", "Sony"] },
  // Crypto Mining
  { id: "m1", name: "Ethereum Mining Rig 8x RTX 4090", price: 12999, currency: "USDT", image: "🏗️", category: "crypto-hardware", seller: "MiningFactory", sellerRating: 4.7, sellerOrders: 3400, sellerVerified: true, rating: 4.6, reviews: 234, sold: 890, shipping: "Freight", tags: ["ETH", "Rig", "8GPU"], hot: true },
  { id: "m2", name: "Goldshell KD-MAX KDA Miner 40TH", price: 3899, currency: "USDT", image: "🥇", category: "crypto-hardware", seller: "ASICDirect", sellerRating: 4.8, sellerOrders: 5600, sellerVerified: true, rating: 4.7, reviews: 345, sold: 1200, shipping: "Free DHL", tags: ["KDA", "ASIC"] },
  { id: "m3", name: "Mining PSU 3600W 80+ Platinum", price: 299, originalPrice: 399, currency: "USDT", image: "🔌", category: "crypto-hardware", seller: "PowerSupplyPro", sellerRating: 4.6, sellerOrders: 12000, sellerVerified: true, rating: 4.5, reviews: 890, sold: 4500, shipping: "Free", tags: ["PSU", "Mining"] },
  { id: "m4", name: "Mining Cooling System Industrial", price: 899, currency: "USDT", image: "❄️", category: "crypto-hardware", seller: "CoolMine Tech", sellerRating: 4.7, sellerOrders: 2300, sellerVerified: true, rating: 4.6, reviews: 167, sold: 780, shipping: "$49 Express", tags: ["Cooling", "Industrial"] },
  { id: "m5", name: "Solar Panel Kit 10kW for Mining", price: 5499, currency: "USDT", image: "☀️", category: "crypto-hardware", seller: "GreenMine Energy", sellerRating: 4.8, sellerOrders: 1200, sellerVerified: true, rating: 4.7, reviews: 89, sold: 340, shipping: "Freight", tags: ["Solar", "Green Mining"] },
  // Fashion & Luxury
  { id: "f1", name: "Rolex Submariner Date 41mm", price: 14999, currency: "USDT", image: "⌚", category: "fashion", seller: "LuxWatch Certified", sellerRating: 4.9, sellerOrders: 890, sellerVerified: true, rating: 4.9, reviews: 234, sold: 456, shipping: "Free Insured", tags: ["Rolex", "Luxury", "Watch"], featured: true },
  { id: "f2", name: "Louis Vuitton Keepall 55 Monogram", price: 2499, currency: "USDT", image: "👜", category: "fashion", seller: "LuxBag Authentic", sellerRating: 4.8, sellerOrders: 4500, sellerVerified: true, rating: 4.7, reviews: 567, sold: 2300, shipping: "Free Express", tags: ["LV", "Bag", "Luxury"] },
  { id: "f3", name: "Gucci GG Supreme Sneakers", price: 890, originalPrice: 1100, currency: "USDT", image: "👟", category: "fashion", seller: "DesignerKicks", sellerRating: 4.7, sellerOrders: 7800, sellerVerified: true, rating: 4.6, reviews: 890, sold: 4500, shipping: "Free", tags: ["Gucci", "Sneakers"] },
  { id: "f4", name: "Canada Goose Expedition Parka", price: 1299, currency: "USDT", image: "🧥", category: "fashion", seller: "WinterLux", sellerRating: 4.8, sellerOrders: 3400, sellerVerified: true, rating: 4.7, reviews: 456, sold: 1890, shipping: "Free Express", tags: ["Jacket", "Premium"] },
  { id: "f5", name: "Ray-Ban Aviator Titanium Gold", price: 349, originalPrice: 449, currency: "USDT", image: "🕶️", category: "fashion", seller: "SunglassHub", sellerRating: 4.6, sellerOrders: 23000, sellerVerified: true, rating: 4.5, reviews: 3400, sold: 12000, shipping: "Free", tags: ["Sunglasses", "RayBan"] },
  { id: "f6", name: "Nike Air Jordan 1 Retro High OG", price: 299, originalPrice: 389, currency: "USDT", image: "👠", category: "fashion", seller: "SneakerVault", sellerRating: 4.8, sellerOrders: 56000, sellerVerified: true, rating: 4.8, reviews: 12000, sold: 67000, shipping: "Free", tags: ["Nike", "Jordan", "Sneakers"], hot: true },
  { id: "f7", name: "Cartier Love Bracelet 18K Gold", price: 7899, currency: "USDT", image: "💍", category: "fashion", seller: "JewelryLux", sellerRating: 4.9, sellerOrders: 1200, sellerVerified: true, rating: 4.9, reviews: 178, sold: 567, shipping: "Free Insured", tags: ["Cartier", "Gold", "Jewelry"] },
  // Software & SaaS
  { id: "s1", name: "Enterprise AI Suite - Lifetime License", price: 4999, currency: "USDT", image: "🧠", category: "software", seller: "AI Solutions Inc", sellerRating: 4.9, sellerOrders: 2300, sellerVerified: true, rating: 4.8, reviews: 345, sold: 1200, shipping: "Instant", tags: ["AI", "Enterprise", "Lifetime"], featured: true },
  { id: "s2", name: "Cloud VPS 128GB RAM / 32 vCPU / 2TB", price: 89, currency: "USDT", image: "☁️", category: "software", seller: "CloudForge", sellerRating: 4.8, sellerOrders: 89000, sellerVerified: true, rating: 4.7, reviews: 12000, sold: 234000, shipping: "Instant", tags: ["VPS", "Cloud", "Monthly"] },
  { id: "s3", name: "SEO Tool Pro - 1 Year Subscription", price: 299, originalPrice: 599, currency: "USDT", image: "📊", category: "software", seller: "SEO Masters", sellerRating: 4.7, sellerOrders: 12000, sellerVerified: true, rating: 4.6, reviews: 2300, sold: 8900, shipping: "Instant", tags: ["SEO", "Marketing"] },
  { id: "s4", name: "Trading Bot - Arbitrage Pro License", price: 1499, currency: "USDT", image: "🤖", category: "software", seller: "AlgoTrade Pro", sellerRating: 4.8, sellerOrders: 3400, sellerVerified: true, rating: 4.7, reviews: 567, sold: 2300, shipping: "Instant", tags: ["Trading", "Bot", "Arbitrage"], hot: true },
  { id: "s5", name: "Figma Enterprise - Team 50 seats", price: 599, currency: "USDT", image: "🎨", category: "software", seller: "DesignTools", sellerRating: 4.9, sellerOrders: 5600, sellerVerified: true, rating: 4.8, reviews: 890, sold: 4500, shipping: "Instant", tags: ["Design", "Figma", "Team"] },
  { id: "s6", name: "GitHub Copilot Business - Annual", price: 228, currency: "USDT", image: "🐙", category: "software", seller: "DevTools Store", sellerRating: 4.8, sellerOrders: 34000, sellerVerified: true, rating: 4.7, reviews: 5600, sold: 23000, shipping: "Instant", tags: ["GitHub", "AI", "Dev"] },
  { id: "s7", name: "Notion Enterprise Workspace - Annual", price: 180, currency: "USDT", image: "📝", category: "software", seller: "ProductivityHub", sellerRating: 4.7, sellerOrders: 45000, sellerVerified: true, rating: 4.6, reviews: 7800, sold: 34000, shipping: "Instant", tags: ["Notion", "Productivity"] },
  // Digital Goods
  { id: "d1", name: "NFT Collection - 10,000 Generative Art", price: 2999, currency: "USDT", image: "🎭", category: "digital", seller: "NFT Factory", sellerRating: 4.7, sellerOrders: 1200, sellerVerified: true, rating: 4.6, reviews: 178, sold: 456, shipping: "Instant", tags: ["NFT", "Art", "Collection"] },
  { id: "d2", name: "Premium Domain - crypto.io", price: 49999, currency: "USDT", image: "🌐", category: "digital", seller: "DomainKing", sellerRating: 4.9, sellerOrders: 890, sellerVerified: true, rating: 4.9, reviews: 67, sold: 123, shipping: "Transfer", tags: ["Domain", "Premium"], featured: true },
  { id: "d3", name: "Twitter/X Account 500K Followers", price: 8999, currency: "USDT", image: "🐦", category: "digital", seller: "SocialAssets", sellerRating: 4.5, sellerOrders: 2300, sellerVerified: true, rating: 4.4, reviews: 345, sold: 890, shipping: "Transfer", tags: ["Social", "Twitter"] },
  { id: "d4", name: "Spotify 10M Streams Package", price: 4999, currency: "USDT", image: "🎵", category: "digital", seller: "MusicPromo", sellerRating: 4.6, sellerOrders: 5600, sellerVerified: true, rating: 4.5, reviews: 890, sold: 3400, shipping: "7 Days", tags: ["Music", "Spotify", "Promo"] },
  { id: "d5", name: "Game Assets Bundle - 10K+ Items", price: 199, originalPrice: 499, currency: "USDT", image: "🎮", category: "digital", seller: "GameDevAssets", sellerRating: 4.8, sellerOrders: 12000, sellerVerified: true, rating: 4.7, reviews: 2300, sold: 8900, shipping: "Instant", tags: ["Game", "Assets", "Unity"] },
  { id: "d6", name: "Stock Photo Library - 1M Images", price: 899, currency: "USDT", image: "📸", category: "digital", seller: "PhotoVault", sellerRating: 4.7, sellerOrders: 7800, sellerVerified: true, rating: 4.6, reviews: 1200, sold: 5600, shipping: "Instant", tags: ["Photos", "Stock", "Library"] },
  { id: "d7", name: "E-Book Collection - 50K Business Books", price: 149, currency: "USDT", image: "📚", category: "digital", seller: "BookVault", sellerRating: 4.6, sellerOrders: 23000, sellerVerified: true, rating: 4.5, reviews: 4500, sold: 18000, shipping: "Instant", tags: ["Books", "Business"] },
  // Services
  { id: "sv1", name: "Smart Contract Audit - Full Review", price: 2999, currency: "USDT", image: "🔍", category: "services", seller: "AuditPro Security", sellerRating: 4.9, sellerOrders: 890, sellerVerified: true, rating: 4.8, reviews: 234, sold: 567, shipping: "5-7 Days", tags: ["Audit", "Smart Contract", "Security"], featured: true },
  { id: "sv2", name: "Full-Stack Development - 160 Hours", price: 7999, currency: "USDT", image: "👨‍💻", category: "services", seller: "DevForce Agency", sellerRating: 4.8, sellerOrders: 1200, sellerVerified: true, rating: 4.7, reviews: 345, sold: 890, shipping: "Ongoing", tags: ["Development", "Full-Stack"] },
  { id: "sv3", name: "Penetration Testing - Enterprise", price: 4999, currency: "USDT", image: "🕵️", category: "services", seller: "WhiteHat Security", sellerRating: 4.9, sellerOrders: 560, sellerVerified: true, rating: 4.8, reviews: 123, sold: 345, shipping: "2-4 Weeks", tags: ["Pentest", "Security"] },
  { id: "sv4", name: "Logo & Brand Identity Package", price: 499, originalPrice: 899, currency: "USDT", image: "🎨", category: "services", seller: "BrandCraft Studio", sellerRating: 4.7, sellerOrders: 8900, sellerVerified: true, rating: 4.6, reviews: 2300, sold: 6700, shipping: "5 Days", tags: ["Design", "Branding"] },
  { id: "sv5", name: "SEO Backlinks - 500 DA50+ Links", price: 1999, currency: "USDT", image: "🔗", category: "services", seller: "LinkBuilder Pro", sellerRating: 4.6, sellerOrders: 4500, sellerVerified: true, rating: 4.5, reviews: 890, sold: 3400, shipping: "30 Days", tags: ["SEO", "Backlinks"] },
  // Security Tools
  { id: "sec1", name: "Enterprise VPN - 100 Seats Annual", price: 1999, currency: "USDT", image: "🔒", category: "security", seller: "SecureNet VPN", sellerRating: 4.9, sellerOrders: 12000, sellerVerified: true, rating: 4.8, reviews: 3400, sold: 8900, shipping: "Instant", tags: ["VPN", "Enterprise", "Security"] },
  { id: "sec2", name: "Zero-Day Vulnerability Scanner Pro", price: 3499, currency: "USDT", image: "🛡️", category: "security", seller: "CyberDefense Lab", sellerRating: 4.8, sellerOrders: 2300, sellerVerified: true, rating: 4.7, reviews: 456, sold: 1200, shipping: "Instant", tags: ["Scanner", "Vulnerability"], hot: true },
  { id: "sec3", name: "Encrypted Communication Suite", price: 799, currency: "USDT", image: "🔐", category: "security", seller: "PrivacyFirst", sellerRating: 4.8, sellerOrders: 5600, sellerVerified: true, rating: 4.7, reviews: 890, sold: 3400, shipping: "Instant", tags: ["Encryption", "Privacy"] },
  { id: "sec4", name: "DDoS Protection - Enterprise Plan", price: 2499, currency: "USDT", image: "🛡️", category: "security", seller: "ShieldForce", sellerRating: 4.9, sellerOrders: 3400, sellerVerified: true, rating: 4.8, reviews: 567, sold: 2300, shipping: "Instant", tags: ["DDoS", "Protection"] },
  { id: "sec5", name: "Password Manager Enterprise - 500 Users", price: 599, currency: "USDT", image: "🔑", category: "security", seller: "VaultPass", sellerRating: 4.7, sellerOrders: 18000, sellerVerified: true, rating: 4.6, reviews: 4500, sold: 12000, shipping: "Instant", tags: ["Password", "Enterprise"] },
  // AI & ML Tools
  { id: "ai1", name: "GPT-5 API Credits - 100M Tokens", price: 999, currency: "USDT", image: "🧠", category: "ai-tools", seller: "AI Credits Hub", sellerRating: 4.8, sellerOrders: 23000, sellerVerified: true, rating: 4.7, reviews: 5600, sold: 18000, shipping: "Instant", tags: ["GPT", "API", "Credits"], hot: true },
  { id: "ai2", name: "Custom LLM Fine-Tuning Service", price: 4999, currency: "USDT", image: "🔬", category: "ai-tools", seller: "ML Factory", sellerRating: 4.9, sellerOrders: 890, sellerVerified: true, rating: 4.8, reviews: 178, sold: 456, shipping: "2-4 Weeks", tags: ["LLM", "Fine-Tuning", "Custom"] },
  { id: "ai3", name: "Computer Vision Model - Object Detection", price: 1499, currency: "USDT", image: "👁️", category: "ai-tools", seller: "VisionAI Lab", sellerRating: 4.7, sellerOrders: 2300, sellerVerified: true, rating: 4.6, reviews: 345, sold: 890, shipping: "Instant", tags: ["Vision", "Detection", "ML"] },
  { id: "ai4", name: "Voice Cloning API - Enterprise", price: 2999, currency: "USDT", image: "🎙️", category: "ai-tools", seller: "VoiceForge AI", sellerRating: 4.8, sellerOrders: 1200, sellerVerified: true, rating: 4.7, reviews: 234, sold: 567, shipping: "Instant", tags: ["Voice", "Clone", "API"] },
  { id: "ai5", name: "AI Image Generator - Unlimited Plan", price: 499, originalPrice: 899, currency: "USDT", image: "🖼️", category: "ai-tools", seller: "ImageAI Pro", sellerRating: 4.7, sellerOrders: 12000, sellerVerified: true, rating: 4.6, reviews: 3400, sold: 8900, shipping: "Instant", tags: ["Image", "Generator", "Unlimited"] },
  // More electronics
  { id: "e9", name: "DJI Mavic 4 Pro Drone", price: 2199, currency: "USDT", image: "🚁", category: "electronics", seller: "DroneWorld", sellerRating: 4.8, sellerOrders: 12000, sellerVerified: true, rating: 4.7, reviews: 2300, sold: 7800, shipping: "Free Express", tags: ["Drone", "DJI", "4K"] },
  { id: "e10", name: "Tesla Powerwall 3 Home Battery", price: 8999, currency: "USDT", image: "🔋", category: "electronics", seller: "EnergyDirect", sellerRating: 4.9, sellerOrders: 3400, sellerVerified: true, rating: 4.8, reviews: 567, sold: 2300, shipping: "Freight", tags: ["Tesla", "Battery", "Solar"] },
  { id: "e11", name: "Meta Quest 4 Pro VR Headset", price: 999, originalPrice: 1299, currency: "USDT", image: "🥽", category: "electronics", seller: "VR Universe", sellerRating: 4.7, sellerOrders: 23000, sellerVerified: true, rating: 4.6, reviews: 5600, sold: 18000, shipping: "Free", tags: ["VR", "Meta", "Gaming"] },
  { id: "e12", name: "Starlink Satellite Internet Kit", price: 599, currency: "USDT", image: "📡", category: "electronics", seller: "SpaceNet", sellerRating: 4.8, sellerOrders: 45000, sellerVerified: true, rating: 4.7, reviews: 8900, sold: 34000, shipping: "Free", tags: ["Starlink", "Internet", "Satellite"] },
];

const SORT_OPTIONS = ["Best Match", "Price: Low to High", "Price: High to Low", "Most Sold", "Top Rated", "Newest"];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("Best Match");
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let items = PRODUCTS.filter(p => {
      const matchCat = category === "all" || p.category === category;
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchCat && matchSearch && matchPrice;
    });

    switch (sortBy) {
      case "Price: Low to High": items.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": items.sort((a, b) => b.price - a.price); break;
      case "Most Sold": items.sort((a, b) => b.sold - a.sold); break;
      case "Top Rated": items.sort((a, b) => b.rating - a.rating); break;
      default: items.sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0)); break;
    }
    return items;
  }, [search, category, sortBy, priceRange]);

  const addToCart = (id: string) => {
    setCart(prev => [...prev, id]);
    toast.success("Added to cart!");
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalVolume = PRODUCTS.reduce((sum, p) => sum + p.price * p.sold, 0);

  return (
    <div className="p-5 max-w-[1600px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase" style={{ fontFamily: "Syne, sans-serif" }}>Commerce <span className="text-cyan-400">Hub</span></h1>
          <p className="text-[10px] font-mono text-white/30 mt-1 uppercase tracking-[0.2em]">Global Trade Network · ${(totalVolume / 1e9).toFixed(1)}B+ Volume</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info("List Item — create your listing")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Sell
          </button>
          <div className="relative cursor-pointer" onClick={() => toast.info(`Cart: ${cart.length} items`)}>
            <ShoppingCart className="w-5 h-5 text-white/40" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] text-white flex items-center justify-center font-bold">{cart.length}</span>}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: PRODUCTS.length.toLocaleString(), icon: Package },
          { label: "Active Sellers", value: "2,847", icon: ShoppingBag },
          { label: "Daily Volume", value: "$8.4M", icon: TrendingUp },
          { label: "Buyer Protection", value: "100%", icon: Shield },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <s.icon className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] text-white/40">{s.label}</div>
              <div className="text-sm font-bold text-white font-mono">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40 transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none"
        >
          {SORT_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0a0a1a]">{s}</option>)}
        </select>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm hover:border-cyan-500/30 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all border",
              category === cat.id
                ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:border-white/[0.12]"
            )}
          >
            <span>{cat.icon}</span> {cat.label}
            <span className="text-[9px] opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            className="group rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden hover:border-cyan-500/20 transition-all cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Image area */}
            <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.05]">
              <span className="text-5xl">{product.image}</span>
              {product.hot && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-500/90 text-[9px] font-bold text-white">HOT</span>
              )}
              {product.featured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-[9px] font-bold text-white">FEATURED</span>
              )}
              {product.originalPrice && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-green-500/90 text-[9px] font-bold text-white">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className={cn("w-4 h-4", wishlist.includes(product.id) ? "text-red-400 fill-red-400" : "text-white/60")} />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <h3 className="text-[12px] font-semibold text-white line-clamp-2 leading-tight">{product.name}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-cyan-400 font-mono">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-[11px] text-white/30 line-through">${product.originalPrice.toLocaleString()}</span>
                )}
                <span className="text-[9px] text-white/30">{product.currency}</span>
              </div>

              {/* Rating + Sold */}
              <div className="flex items-center gap-2 text-[10px]">
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-white/30">({product.reviews.toLocaleString()} reviews)</span>
                <span className="text-white/20">·</span>
                <span className="text-white/40">{product.sold.toLocaleString()} sold</span>
              </div>

              {/* Seller */}
              <div className="flex items-center gap-1.5 text-[10px]">
                {product.sellerVerified && <Shield className="w-3 h-3 text-green-400" />}
                <span className="text-white/50">{product.seller}</span>
                <span className="text-amber-400">★ {product.sellerRating}</span>
              </div>

              {/* Shipping + Tags */}
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 text-[9px] text-green-400/80 bg-green-500/10 px-1.5 py-0.5 rounded">
                  <Truck className="w-2.5 h-2.5" /> {product.shipping}
                </span>
                {product.tags.slice(0, 2).map(t => (
                  <span key={t} className="text-[9px] text-white/30 bg-white/[0.05] px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>

              {/* Add to cart */}
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 text-[11px] font-medium hover:bg-cyan-500/25 transition-colors active:scale-[0.97]"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-white/40 text-sm">No products found matching your criteria</p>
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[oklch(0.09_0.01_265)] p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedProduct.image}</span>
                  <div>
                    <h2 className="text-[15px] font-bold text-white">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      {selectedProduct.sellerVerified && <Shield className="w-3 h-3 text-green-400" />}
                      <span className="text-white/50">{selectedProduct.seller}</span>
                      <span className="text-amber-400">★ {selectedProduct.sellerRating}</span>
                      <span className="text-white/30">({selectedProduct.sellerOrders.toLocaleString()} orders)</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-1 rounded text-white/30 hover:text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-cyan-400 font-mono">${selectedProduct.price.toLocaleString()}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-white/30 line-through">${selectedProduct.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <div className="text-[10px] text-white/40">Rating</div>
                  <div className="text-sm font-bold text-amber-400">★ {selectedProduct.rating}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <div className="text-[10px] text-white/40">Reviews</div>
                  <div className="text-sm font-bold text-white">{selectedProduct.reviews.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <div className="text-[10px] text-white/40">Sold</div>
                  <div className="text-sm font-bold text-green-400">{selectedProduct.sold.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.tags.map(t => (
                  <span key={t} className="text-[10px] text-white/50 bg-white/[0.05] px-2 py-1 rounded-lg">{t}</span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-green-400/80">
                <Truck className="w-4 h-4" />
                <span>{selectedProduct.shipping}</span>
                <span className="text-white/20">·</span>
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400/80">Buyer Protection</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { addToCart(selectedProduct.id); setSelectedProduct(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/30 transition-colors active:scale-[0.97]"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => { toast.success("Proceeding to checkout..."); setSelectedProduct(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-white font-medium text-sm hover:bg-cyan-600 transition-colors active:scale-[0.97]"
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
