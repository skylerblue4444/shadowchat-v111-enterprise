import React, { useState } from "react";

/**
 * Economic Engine Plotline
 * Narrative-driven gamified earnings and quests
 */

export default function EconomicEnginePlotline() {
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedQuest, setSelectedQuest] = useState<number | null>(null);

  const chapters = [
    {
      id: 1,
      title: "Chapter 1: The Beginning",
      description: "You arrive at ShadowChat and meet Hope AI",
      status: "Completed",
      progress: 100,
      rewards: "1,000 SKY",
      quests: [
        { id: 1, title: "Welcome to ShadowChat", description: "Complete your first login", reward: 100, completed: true },
        { id: 2, title: "Meet Hope AI", description: "Interact with Hope AI for the first time", reward: 150, completed: true },
        { id: 3, title: "Create Your Profile", description: "Set up your profile with avatar and bio", reward: 200, completed: true },
        { id: 4, title: "First Donation", description: "Donate 50 coins to charity", reward: 250, completed: true },
      ],
    },
    {
      id: 2,
      title: "Chapter 2: The Trader's Path",
      description: "Learn to trade and build your wealth",
      status: "In Progress",
      progress: 65,
      rewards: "2,500 SKY",
      quests: [
        { id: 5, title: "First Trade", description: "Execute your first trade", reward: 300, completed: true },
        { id: 6, title: "Profit Master", description: "Make 500 coins profit", reward: 400, completed: true },
        { id: 7, title: "Portfolio Builder", description: "Hold 5 different assets", reward: 500, completed: false },
        { id: 8, title: "Market Analyst", description: "Analyze 10 market trends", reward: 600, completed: false },
      ],
    },
    {
      id: 3,
      title: "Chapter 3: The Influencer",
      description: "Build your social presence and earn from content",
      status: "Locked",
      progress: 0,
      rewards: "3,000 SKY",
      quests: [
        { id: 9, title: "First Post", description: "Create your first social post", reward: 250, completed: false },
        { id: 10, title: "1K Followers", description: "Reach 1,000 followers", reward: 500, completed: false },
        { id: 11, title: "Viral Post", description: "Get 10K likes on a post", reward: 750, completed: false },
        { id: 12, title: "Content Creator", description: "Upload 5 videos", reward: 800, completed: false },
      ],
    },
    {
      id: 4,
      title: "Chapter 4: The Philanthropist",
      description: "Change the world through charity",
      status: "Locked",
      progress: 0,
      rewards: "4,000 SKY",
      quests: [
        { id: 13, title: "Charity Champion", description: "Donate 5,000 coins total", reward: 500, completed: false },
        { id: 14, title: "Campaign Creator", description: "Create a charity campaign", reward: 750, completed: false },
        { id: 15, title: "Impact Leader", description: "Help 100 people through charity", reward: 1000, completed: false },
        { id: 16, title: "Global Savior", description: "Reach 1M coins donated platform-wide", reward: 1500, completed: false },
      ],
    },
    {
      id: 5,
      title: "Chapter 5: The Legend",
      description: "Become a ShadowChat legend",
      status: "Locked",
      progress: 0,
      rewards: "5,000 SKY",
      quests: [
        { id: 17, title: "Legendary Status", description: "Reach level 100", reward: 1000, completed: false },
        { id: 18, title: "AI Whisperer", description: "Interact with all 12 AI agents", reward: 1200, completed: false },
        { id: 19, title: "Master Trader", description: "Achieve 1M coins net worth", reward: 1500, completed: false },
        { id: 20, title: "Hall of Fame", description: "Complete all chapters", reward: 2000, completed: false },
      ],
    },
  ];

  const playerStats = {
    level: 45,
    totalXP: 125000,
    nextLevelXP: 150000,
    totalEarnings: "$12,450",
    chapterProgress: "Chapter 2: 65%",
    questsCompleted: 7,
    totalQuests: 20,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          📖 Economic Engine Plotline
        </h1>
        <p className="text-slate-400">Your journey to becoming a ShadowChat legend</p>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-6 gap-3 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Level</div>
          <div className="text-2xl font-bold text-emerald-400">{playerStats.level}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">XP Progress</div>
          <div className="text-sm font-bold text-cyan-400">{(playerStats.totalXP / 1000).toFixed(0)}K / {(playerStats.nextLevelXP / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Earnings</div>
          <div className="text-2xl font-bold text-purple-400">{playerStats.totalEarnings}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Chapter</div>
          <div className="text-sm font-bold text-orange-400">{playerStats.chapterProgress}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Quests</div>
          <div className="text-2xl font-bold text-green-400">{playerStats.questsCompleted}/{playerStats.totalQuests}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">XP Bar</div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${(playerStats.totalXP / playerStats.nextLevelXP) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chapter List */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Story Chapters</h2>
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedChapter === chapter.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                } ${chapter.status === "Locked" ? "opacity-50" : ""}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-sm">{chapter.title}</h3>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                    chapter.status === "Completed" ? "bg-green-500/20 text-green-400" :
                    chapter.status === "In Progress" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-slate-600/20 text-slate-400"
                  }`}>
                    {chapter.status}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-2">{chapter.description}</p>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${chapter.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Details */}
        <div className="col-span-2">
          {(() => {
            const chapter = chapters.find(c => c.id === selectedChapter);
            return (
              <div className="space-y-6">
                {/* Chapter Header */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-2">{chapter?.title}</h2>
                  <p className="text-slate-400 mb-4">{chapter?.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400 mb-1">Status</div>
                      <div className={`font-bold ${
                        chapter?.status === "Completed" ? "text-green-400" :
                        chapter?.status === "In Progress" ? "text-yellow-400" :
                        "text-slate-400"
                      }`}>
                        {chapter?.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Progress</div>
                      <div className="font-bold text-emerald-400">{chapter?.progress}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Chapter Reward</div>
                      <div className="font-bold text-purple-400">{chapter?.rewards}</div>
                    </div>
                  </div>
                </div>

                {/* Quests */}
                <div>
                  <h3 className="text-lg font-bold mb-3 text-emerald-400">Chapter Quests</h3>
                  <div className="space-y-2">
                    {chapter?.quests.map((quest) => (
                      <div
                        key={quest.id}
                        onClick={() => setSelectedQuest(quest.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedQuest === quest.id
                            ? "bg-emerald-500/20 border-emerald-400"
                            : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-sm">{quest.title}</h4>
                          <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                            quest.completed ? "bg-green-500/20 text-green-400" : "bg-slate-600/20 text-slate-400"
                          }`}>
                            {quest.completed ? "✓ Done" : "Pending"}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{quest.description}</p>
                        <div className="text-xs text-emerald-400 font-bold">+{quest.reward} XP</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chapter Reward */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Chapter Completion Reward</div>
                  <div className="text-2xl font-bold text-emerald-400">{chapter?.rewards}</div>
                  <p className="text-xs text-slate-400 mt-2">Complete all quests to unlock the next chapter</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
