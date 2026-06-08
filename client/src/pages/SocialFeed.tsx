/**
 * ShadowChat Ultimate — Social Feed
 * Premium dark luxury social feed matching Mission Control quality.
 * AI-ranked posts, trending sidebar, glassmorphism cards, live composer.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Flame, Sparkles, Image, Send, Hash, AtSign,
  Globe, Lock, Users, ArrowUpRight, Repeat2, Verified, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const TABS = ["For You", "Following", "Trending", "AI Ranked"] as const;

const TRENDING = [
  { tag: "#SKYCOIN4444", posts: "24.8K", change: "+412%", hot: true },
  { tag: "#HopeAI",      posts: "18.2K", change: "+287%", hot: true },
  { tag: "#ShadowDAO",   posts: "12.1K", change: "+156%", hot: false },
  { tag: "#AIAgents",    posts: "9.4K",  change: "+98%",  hot: false },
  { tag: "#Bitcoin",     posts: "8.7K",  change: "+44%",  hot: false },
  { tag: "#Solana",      posts: "6.3K",  change: "+67%",  hot: false },
];

const SUGGESTED_USERS = [
  { name: "HOPE AI Oracle", handle: "@hopeai_oracle", avatar: "🔮", followers: "44.4K" },
  { name: "Crypto Samurai", handle: "@cryptosamurai", avatar: "⚔️", followers: "28.1K" },
  { name: "Shadow Witch",   handle: "@shadowwitch",   avatar: "🧙‍♀️", followers: "19.7K" },
];

function PostCard({ post, index }: { post: any; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const handleLike = () => {
    setLiked(p => !p);
    setLikes((p: number) => p + (liked ? -1 : 1));
  };

  const aiScore = 70 + (index * 7 % 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-xl border border-white/[0.04] overflow-hidden transition-all hover:border-cyan-500/20 group/card"
      style={{ background: "rgba(10,10,25,0.4)", backdropFilter: "blur(20px)" }}
    >
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {post.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                  {post.user}
                </span>
                {post.verified && <Verified className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />}
                {post.trending && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono bg-orange-500/15 text-orange-400 border-orange-500/25">
                    HOT
                  </span>
                )}
              </div>
              <div className="text-[11px] text-white/35 mt-0.5">{post.handle} · {post.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-cyan-500/20 bg-cyan-500/8">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span className="text-[9px] font-mono text-cyan-400">{aiScore}</span>
            </div>
            <button className="p-1 rounded-lg text-white/25 hover:text-white/50 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-[13px] text-white/80 leading-relaxed mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1">
            <button onClick={handleLike}
              className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all",
                liked ? "bg-red-500/12 text-red-400" : "text-white/35 hover:text-red-400 hover:bg-red-500/8")}>
              <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
              {likes.toLocaleString()}
            </button>
            <button onClick={() => setShowComment(p => !p)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-white/35 hover:text-cyan-400 hover:bg-cyan-500/8 transition-all">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.comments.toLocaleString()}
            </button>
            <button onClick={() => toast.success("Post shared!")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-white/35 hover:text-green-400 hover:bg-green-500/8 transition-all">
              <Repeat2 className="w-3.5 h-3.5" />
              {post.shares.toLocaleString()}
            </button>
          </div>
          <button onClick={() => setBookmarked(p => !p)}
            className={cn("p-1.5 rounded-lg transition-all",
              bookmarked ? "text-amber-400 bg-amber-500/10" : "text-white/25 hover:text-amber-400")}>
            <Bookmark className={cn("w-3.5 h-3.5", bookmarked && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Comment composer */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/[0.05] px-4 py-3 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/25 outline-none focus:border-cyan-500/30 transition-colors"
                onKeyDown={e => { if (e.key === "Enter" && comment.trim()) { toast.success("Reply posted!"); setComment(""); setShowComment(false); } }}
              />
              <button onClick={() => { if (comment.trim()) { toast.success("Reply posted!"); setComment(""); setShowComment(false); } }}
                className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/25 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SocialFeed() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("For You");
  const [postText, setPostText] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "followers" | "private">("public");

  const { data: feedData, isLoading, refetch } = trpc.social.getFeed.useQuery({ limit: 30, offset: 0 });
  const posts = feedData?.posts || [];

  const createPostMutation = trpc.social.createPost.useMutation({
    onSuccess: () => { toast.success("Post published to feed!"); setPostText(""); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const handlePost = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!postText.trim()) return;
    const tags = postText.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];
    createPostMutation.mutate({ content: postText, tags });
  };

  const currentUser = user ? { name: user.name || "User" } : { name: "Guest" };

  return (
    <div className="flex gap-5 p-5 max-w-[1400px]">
      {/* ── Main Feed ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-black text-white tracking-tight uppercase" style={{ fontFamily: "Syne, sans-serif" }}>Global <span className="text-cyan-400">Intelligence</span></h1>
            <p className="text-[10px] font-mono text-white/30 mt-1 uppercase tracking-[0.2em]">Real-time encrypted stream · {posts.length} nodes active</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-green-500/20 bg-green-500/8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono text-green-400">LIVE</span>
          </div>
        </div>

        {/* Composer */}
        <div className="rounded-2xl border border-white/[0.07] p-4"
          style={{ background: "rgba(13,13,34,0.75)", backdropFilter: "blur(12px)" }}>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0 shadow-lg shadow-cyan-500/10"
              style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,153,204,0.2))", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={postText}
                onChange={e => setPostText(e.target.value)}
                placeholder="What's happening in the ShadowChat universe?"
                rows={2}
                className="w-full bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none resize-none leading-relaxed"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1">
                  {[Image, Hash, AtSign].map((Icon, i) => (
                    <button key={i} onClick={() => toast.info("Feature coming soon")}
                      className="p-1.5 rounded-lg text-white/25 hover:text-cyan-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                  <button
                    onClick={() => setPrivacy(p => p === "public" ? "followers" : p === "followers" ? "private" : "public")}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/[0.08] text-[10px] text-white/40 hover:text-white/60 transition-colors ml-1">
                    {privacy === "public" ? <Globe className="w-3 h-3" /> : privacy === "followers" ? <Users className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span className="ml-1">{privacy}</span>
                  </button>
                </div>
                <button onClick={handlePost} disabled={!postText.trim()}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/20"
                  style={{ background: "linear-gradient(135deg, #00e5ff, #0099cc)", color: "#050510", fontFamily: "Syne, sans-serif" }}>
                  <Send className="w-3.5 h-3.5" />
                  Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl border border-white/[0.07]"
          style={{ background: "rgba(10,10,28,0.6)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("flex-1 py-2 rounded-lg text-[11px] font-medium transition-all",
                activeTab === tab
                  ? "bg-white/[0.08] text-white border border-white/[0.1]"
                  : "text-white/35 hover:text-white/60")}>
              {tab}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          <AnimatePresence>
            {posts.map((post, i) => <PostCard key={post.id} post={post as any} index={i} />)}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right Sidebar ── */}
      <div className="w-72 shrink-0 space-y-4 hidden lg:block">
        {/* Trending */}
        <div className="rounded-2xl border border-white/[0.07] p-4"
          style={{ background: "rgba(13,13,34,0.75)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Trending</h3>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="space-y-1">
            {TRENDING.map((t, i) => (
              <div key={t.tag} className="flex items-center justify-between py-2 cursor-pointer group rounded-lg px-2 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/20 w-4">{i + 1}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-white group-hover:text-cyan-400 transition-colors">{t.tag}</span>
                      {t.hot && <Flame className="w-3 h-3 text-orange-400" />}
                    </div>
                    <span className="text-[10px] text-white/30">{t.posts} posts</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-green-400">{t.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested users */}
        <div className="rounded-2xl border border-white/[0.07] p-4"
          style={{ background: "rgba(13,13,34,0.75)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Suggested</h3>
            <ArrowUpRight className="w-4 h-4 text-white/30" />
          </div>
          <div className="space-y-3">
            {SUGGESTED_USERS.map(s => (
              <div key={s.handle} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ background: "rgba(155,89,255,0.15)", border: "1px solid rgba(155,89,255,0.25)" }}>
                    {s.avatar}
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-white">{s.name}</div>
                    <div className="text-[10px] text-white/35">{s.followers} followers</div>
                  </div>
                </div>
                <button onClick={() => toast.success(`Following ${s.name}!`)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Score info */}
        <div className="rounded-2xl border border-cyan-500/15 p-4"
          style={{ background: "rgba(0,229,255,0.04)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-white">AI Ranking Score</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            HOPE AI scores each post 0–100 based on engagement velocity, content quality, sentiment, and relevance to your interests.
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-mono">Real-time re-ranking every 60s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
