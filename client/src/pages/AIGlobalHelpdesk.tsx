import React, { useState } from "react";

/**
 * AI-Powered Global Helpdesk
 * 24/7 autonomous support from your 12 AI agents
 */

export default function AIGlobalHelpdesk() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const supportTickets = [
    {
      id: 1,
      title: "How to stake SKY tokens?",
      category: "Staking",
      status: "Resolved",
      agent: "Sage",
      priority: "High",
      created: "2 hours ago",
      resolved: "1 hour ago",
      messages: [
        { author: "User", text: "How do I stake my SKY tokens?", time: "2 hours ago" },
        { author: "Sage", text: "To stake SKY tokens, go to the Staking section in your dashboard. Select the amount you want to stake and choose your lock period (30, 90, or 180 days). Higher lock periods offer better APY.", time: "1 hour 55 min ago" },
        { author: "User", text: "What's the APY for 180 days?", time: "1 hour 50 min ago" },
        { author: "Sage", text: "The 180-day lock period offers 45% APY. You'll earn approximately 225 SKY per 1000 SKY staked annually.", time: "1 hour 45 min ago" },
      ],
    },
    {
      id: 2,
      title: "Payment failed on prediction market",
      category: "Payments",
      status: "In Progress",
      agent: "Guardian",
      priority: "Critical",
      created: "30 min ago",
      resolved: null,
      messages: [
        { author: "User", text: "My payment failed when trying to place a bet", time: "30 min ago" },
        { author: "Guardian", text: "I'm investigating this. Can you provide your transaction ID?", time: "28 min ago" },
        { author: "User", text: "TXN-2024-12345", time: "25 min ago" },
        { author: "Guardian", text: "Found the issue - your wallet had insufficient balance. I've refunded the failed transaction fee. Try again now.", time: "20 min ago" },
      ],
    },
    {
      id: 3,
      title: "NFT marketplace questions",
      category: "NFTs",
      status: "Waiting",
      agent: "Innovator",
      priority: "Medium",
      created: "1 hour ago",
      resolved: null,
      messages: [
        { author: "User", text: "Can I list my NFT on the marketplace?", time: "1 hour ago" },
        { author: "Innovator", text: "Yes! You can list NFTs in the Marketplace section. You'll need to set a price and pay a 2.5% listing fee.", time: "55 min ago" },
      ],
    },
  ];

  const agentStats = [
    { name: "Sage", resolved: 1245, avgTime: "4.2 min", rating: 4.9, status: "Online" },
    { name: "Guardian", resolved: 1087, avgTime: "5.1 min", rating: 4.8, status: "Online" },
    { name: "Innovator", resolved: 956, avgTime: "6.3 min", rating: 4.7, status: "Online" },
    { name: "Architect", resolved: 845, avgTime: "4.8 min", rating: 4.9, status: "Online" },
    { name: "Analyst", resolved: 723, avgTime: "5.5 min", rating: 4.6, status: "Online" },
    { name: "Healer", resolved: 654, avgTime: "7.2 min", rating: 4.5, status: "Online" },
  ];

  const categories = ["all", "staking", "payments", "nfts", "trading", "technical"];

  const filteredTickets = selectedCategory === "all" 
    ? supportTickets 
    : supportTickets.filter(t => t.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🤖 AI Global Helpdesk
        </h1>
        <p className="text-slate-400">24/7 autonomous support from your AI agents</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Support Tickets</h2>
          
          {/* Category Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs whitespace-nowrap font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Tickets */}
          <div className="space-y-2">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTicket === ticket.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm">{ticket.title}</h3>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                    ticket.status === "Resolved" ? "bg-green-500/20 text-green-400" :
                    ticket.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {ticket.status}
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  <div>{ticket.agent} • {ticket.created}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-2">
          {selectedTicket !== null && (
            <>
              {(() => {
                const ticket = supportTickets.find(t => t.id === selectedTicket);
                return (
                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="font-bold text-lg mb-1">{ticket?.title}</h3>
                      <div className="flex gap-4 text-xs text-slate-400">
                        <span>Agent: {ticket?.agent}</span>
                        <span>Status: {ticket?.status}</span>
                        <span>Priority: {ticket?.priority}</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {ticket?.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.author === "User" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs p-3 rounded-lg ${
                            msg.author === "User"
                              ? "bg-emerald-500/20 border border-emerald-500/30"
                              : "bg-slate-700/50 border border-slate-600"
                          }`}>
                            <div className="text-xs font-semibold mb-1">{msg.author}</div>
                            <div className="text-sm">{msg.text}</div>
                            <div className="text-xs text-slate-400 mt-1">{msg.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    {ticket?.status !== "Resolved" && (
                      <div className="p-4 border-t border-slate-700 flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-semibold transition-all">
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}

          {selectedTicket === null && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-slate-400">Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Performance */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">AI Agent Performance</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
            <div>Agent</div>
            <div>Resolved</div>
            <div>Avg Time</div>
            <div>Rating</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {agentStats.map((agent) => (
            <div key={agent.name} className="grid grid-cols-6 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
              <div className="font-semibold">{agent.name}</div>
              <div>{agent.resolved.toLocaleString()}</div>
              <div>{agent.avgTime}</div>
              <div className="text-yellow-400">⭐ {agent.rating}</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-green-400">{agent.status}</span>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Chat</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
