import React, { useState, useEffect } from "react";

/**
 * Global Social Hub
 * Real-time chat rooms with AI moderation and live engagement
 */

export default function GlobalSocialHub() {
  const [selectedRoom, setSelectedRoom] = useState<string>("general");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const rooms = [
    { id: "general", name: "General", users: 2341, activity: "🔥 Hot" },
    { id: "ai-chat", name: "AI Chat", users: 1823, activity: "🌟 Active" },
    { id: "trading", name: "Trading", users: 892, activity: "📈 Trending" },
    { id: "gaming", name: "Gaming", users: 1456, activity: "🎮 Intense" },
    { id: "charity", name: "Charity", users: 567, activity: "💚 Caring" },
    { id: "dev-zone", name: "Dev Zone", users: 734, activity: "💻 Coding" },
  ];

  const mockMessages = [
    { id: 1, user: "Hope AI", avatar: "🤖", message: "Welcome to ShadowChat! What would you like to discuss?", timestamp: "2 min ago", verified: true },
    { id: 2, user: "Trader_Pro", avatar: "📊", message: "SKY token looking bullish today 🚀", timestamp: "1 min ago", verified: false },
    { id: 3, user: "Dev_Master", avatar: "💻", message: "Just deployed a new feature to production", timestamp: "30s ago", verified: true },
    { id: 4, user: "Charity_Bot", avatar: "💚", message: "We've raised 50K SKY for education today!", timestamp: "Just now", verified: true },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [selectedRoom]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          avatar: "👤",
          message: newMessage,
          timestamp: "Just now",
          verified: false,
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar - Chat Rooms */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Chat Rooms</h2>
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedRoom === room.id
                    ? "bg-emerald-500/20 border border-emerald-400"
                    : "bg-slate-800/50 border border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="font-semibold text-sm">{room.name}</div>
                <div className="text-xs text-slate-400 mt-1">{room.users.toLocaleString()} users</div>
                <div className="text-xs text-emerald-400 mt-1">{room.activity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="col-span-3">
          {/* Room Header */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 mb-4">
            <h1 className="text-2xl font-bold">
              {rooms.find((r) => r.id === selectedRoom)?.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {rooms.find((r) => r.id === selectedRoom)?.users.toLocaleString()} members • AI Moderated
            </p>
          </div>

          {/* Messages */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 mb-4 h-96 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="text-2xl">{msg.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{msg.user}</span>
                    {msg.verified && <span className="text-cyan-400 text-xs">✓ Verified</span>}
                    <span className="text-xs text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={handleSendMessage}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
