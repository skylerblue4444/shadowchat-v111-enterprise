import React, { useState } from "react";

/**
 * YouVideo Platform
 * Premium video content with Live Pay Watch
 */

export default function YouVideo() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("featured");
  const [watchTime, setWatchTime] = useState(0);

  const videos = [
    {
      id: 1,
      title: "Crypto Market Secrets: 2026 Predictions",
      creator: "Analyst",
      views: 245000,
      likes: 12500,
      duration: "45:32",
      thumbnail: "🎬",
      category: "Educational",
      premium: false,
      earnings: 0,
      description: "Deep dive into market trends and predictions for 2026",
    },
    {
      id: 2,
      title: "Building Your First Smart Contract",
      creator: "Architect",
      views: 189000,
      likes: 9800,
      duration: "38:15",
      thumbnail: "💻",
      category: "Tutorial",
      premium: true,
      earnings: 2.50,
      description: "Step-by-step guide to smart contract development",
    },
    {
      id: 3,
      title: "AI Trading Bot Live Demo",
      creator: "Innovator",
      views: 567000,
      likes: 28900,
      duration: "52:10",
      thumbnail: "🤖",
      category: "Live",
      premium: true,
      earnings: 5.00,
      description: "Watch an AI bot make real-time trading decisions",
    },
    {
      id: 4,
      title: "Charity Impact Stories",
      creator: "Guardian",
      views: 123000,
      likes: 8900,
      duration: "28:45",
      thumbnail: "❤️",
      category: "Documentary",
      premium: false,
      earnings: 0,
      description: "Real stories of lives changed by our charity initiatives",
    },
  ];

  const liveStreams = [
    {
      id: 1,
      title: "Live Trading Session",
      host: "Analyst",
      viewers: 3456,
      duration: "2h 15m",
      status: "Live",
      costPerMinute: 0.10,
      totalEarnings: 13.50,
    },
    {
      id: 2,
      title: "AMA: Ask the AI Agents",
      host: "Sage",
      viewers: 5678,
      duration: "1h 45m",
      status: "Live",
      costPerMinute: 0.05,
      totalEarnings: 5.25,
    },
    {
      id: 3,
      title: "Gaming Tournament",
      host: "Catalyst",
      viewers: 2345,
      duration: "3h 30m",
      status: "Upcoming",
      costPerMinute: 0.15,
      totalEarnings: 0,
    },
  ];

  const creatorStats = {
    totalViews: 1124000,
    totalEarnings: "$3,450",
    subscribers: 45000,
    avgWatchTime: "12m 34s",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          📺 YouVideo Platform
        </h1>
        <p className="text-slate-400">Premium video content with Live Pay Watch</p>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-emerald-400">{(creatorStats.totalViews / 1000000).toFixed(1)}M</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Earnings</div>
          <div className="text-2xl font-bold text-cyan-400">{creatorStats.totalEarnings}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Subscribers</div>
          <div className="text-2xl font-bold text-purple-400">{(creatorStats.subscribers / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Avg Watch Time</div>
          <div className="text-2xl font-bold text-orange-400">{creatorStats.avgWatchTime}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["featured", "live", "trending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              selectedTab === tab
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Featured Videos */}
      {selectedTab === "featured" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Featured Videos</h2>
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex gap-4 ${
                    selectedVideo === video.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="text-4xl">{video.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{video.title}</h3>
                    <div className="text-sm text-slate-400 mb-2">
                      {video.creator} • {video.duration}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>👁️ {(video.views / 1000).toFixed(0)}K views</span>
                      <span>❤️ {(video.likes / 1000).toFixed(1)}K likes</span>
                      {video.premium && (
                        <span className="text-emerald-400 font-bold">💰 ${video.earnings.toFixed(2)}/view</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Details */}
          <div className="col-span-1">
            {selectedVideo !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const video = videos.find(v => v.id === selectedVideo);
                  return (
                    <>
                      <div className="text-3xl mb-3">{video?.thumbnail}</div>
                      <h3 className="font-bold mb-2 text-emerald-400">{video?.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">{video?.description}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Creator</span>
                          <span className="font-semibold">{video?.creator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category</span>
                          <span className="font-semibold">{video?.category}</span>
                        </div>
                        {video?.premium && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Earnings/View</span>
                            <span className="font-bold">${video?.earnings.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        {video?.premium ? "Watch (Premium)" : "Watch Free"}
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedVideo === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a video to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Streams */}
      {selectedTab === "live" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Live Streams</h2>
          <div className="grid grid-cols-3 gap-4">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
                <div className={`p-4 ${stream.status === "Live" ? "bg-red-500/20" : "bg-slate-700/30"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{stream.title}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      stream.status === "Live" ? "bg-red-500 text-white animate-pulse" : "bg-slate-600"
                    }`}>
                      {stream.status}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mb-3">
                    {stream.host} • 👥 {stream.viewers.toLocaleString()} watching
                  </div>
                  <div className="space-y-1 text-xs text-slate-400 mb-3">
                    <div>Duration: {stream.duration}</div>
                    <div className="text-emerald-400 font-semibold">
                      Earn ${(stream.viewers * stream.costPerMinute / 60).toFixed(2)}/min
                    </div>
                  </div>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold text-sm transition-all">
                    {stream.status === "Live" ? "Watch Live" : "Set Reminder"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      {selectedTab === "trending" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Trending Now</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { rank: 1, title: "AI Revolution", views: "2.3M", trend: "↑ 45%" },
              { rank: 2, title: "Crypto Boom", views: "1.8M", trend: "↑ 32%" },
              { rank: 3, title: "Gaming Wars", views: "1.5M", trend: "↑ 28%" },
              { rank: 4, title: "Charity Impact", views: "1.2M", trend: "↑ 15%" },
            ].map((item) => (
              <div key={item.rank} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-400 mb-2">#{item.rank}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <div className="text-xs text-slate-400 mb-2">{item.views} views</div>
                <div className="text-sm text-green-400 font-bold">{item.trend}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
