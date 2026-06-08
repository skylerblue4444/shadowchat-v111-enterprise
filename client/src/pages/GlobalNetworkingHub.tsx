import React, { useState } from "react";

/**
 * Global Networking & Event Hub
 * AI-facilitated virtual events and networking
 */

export default function GlobalNetworkingHub() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("events");

  const upcomingEvents = [
    {
      id: 1,
      title: "Crypto Market Outlook 2026",
      date: "2026-02-20",
      time: "3:00 PM UTC",
      host: "Analyst",
      attendees: 2345,
      type: "Webinar",
      description: "Deep dive into market trends and predictions",
      speakers: ["Analyst", "Sage", "Optimizer"],
      registrationStatus: "Registered",
    },
    {
      id: 2,
      title: "Smart Contract Security Workshop",
      date: "2026-02-22",
      time: "5:00 PM UTC",
      host: "Architect",
      attendees: 1234,
      type: "Workshop",
      description: "Learn best practices for secure contract development",
      speakers: ["Architect", "Guardian"],
      registrationStatus: "Available",
    },
    {
      id: 3,
      title: "AI Trading Bot Masterclass",
      date: "2026-02-25",
      time: "2:00 PM UTC",
      host: "Innovator",
      attendees: 567,
      type: "Masterclass",
      description: "Build and deploy your own trading bot",
      speakers: ["Innovator", "Analyst"],
      registrationStatus: "Available",
    },
    {
      id: 4,
      title: "Community Governance AMA",
      date: "2026-02-28",
      time: "6:00 PM UTC",
      host: "Guardian",
      attendees: 3456,
      type: "AMA",
      description: "Ask anything about platform governance",
      speakers: ["Guardian", "Sage", "Architect"],
      registrationStatus: "Available",
    },
  ];

  const networkingProfiles = [
    { name: "Alex Chen", title: "Crypto Trader", connections: 234, mutual: 12, status: "Online" },
    { name: "Sarah Johnson", title: "Smart Contract Dev", connections: 567, mutual: 8, status: "Online" },
    { name: "Marcus Williams", title: "DeFi Analyst", connections: 345, mutual: 15, status: "Away" },
    { name: "Emma Rodriguez", title: "AI Researcher", connections: 456, mutual: 6, status: "Online" },
    { name: "James Park", title: "NFT Collector", connections: 234, mutual: 20, status: "Online" },
  ];

  const pastEvents = [
    { title: "Introduction to DeFi", date: "2026-02-10", attendees: 4567, rating: 4.8 },
    { title: "NFT Market Analysis", date: "2026-02-05", attendees: 2345, rating: 4.7 },
    { title: "Blockchain Basics", date: "2026-01-30", attendees: 5678, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🌐 Global Networking & Event Hub
        </h1>
        <p className="text-slate-400">Connect with traders, developers, and AI enthusiasts worldwide</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["events", "networking", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              selectedTab === tab
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
          </button>
        ))}
      </div>

      {/* Events Tab */}
      {selectedTab === "events" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Event List */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Upcoming Events</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedEvent === event.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      event.type === "Webinar" ? "bg-blue-500/20 text-blue-400" :
                      event.type === "Workshop" ? "bg-purple-500/20 text-purple-400" :
                      event.type === "Masterclass" ? "bg-orange-500/20 text-orange-400" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {event.type}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{event.date} • {event.time}</span>
                    <span>👥 {event.attendees.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="col-span-1">
            {selectedEvent !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                <h3 className="font-bold mb-4 text-emerald-400">Event Details</h3>
                {(() => {
                  const event = upcomingEvents.find(e => e.id === selectedEvent);
                  return (
                    <>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Date & Time</div>
                          <div className="font-semibold">{event?.date} • {event?.time}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Host</div>
                          <div className="font-semibold text-emerald-400">{event?.host}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Speakers</div>
                          <div className="space-y-1">
                            {event?.speakers.map((speaker) => (
                              <div key={speaker} className="text-xs bg-slate-700/30 px-2 py-1 rounded">
                                {speaker}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Attendees</div>
                          <div className="font-semibold text-cyan-400">{event?.attendees.toLocaleString()}</div>
                        </div>
                      </div>
                      <button className={`w-full py-2 rounded font-bold transition-all ${
                        event?.registrationStatus === "Registered"
                          ? "bg-slate-700 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}>
                        {event?.registrationStatus === "Registered" ? "✓ Registered" : "Register Now"}
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedEvent === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Networking Tab */}
      {selectedTab === "networking" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Connect with Members</h2>
          <div className="grid grid-cols-5 gap-4">
            {networkingProfiles.map((profile) => (
              <div key={profile.name} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${profile.status === "Online" ? "bg-green-400" : "bg-yellow-400"}`}></div>
                </div>
                <h3 className="font-bold text-sm mb-1">{profile.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{profile.title}</p>
                <div className="space-y-1 text-xs mb-3">
                  <div className="text-slate-400">{profile.connections} connections</div>
                  <div className="text-emerald-400">{profile.mutual} mutual</div>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-1 rounded text-xs font-bold transition-all">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events Tab */}
      {selectedTab === "past" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Past Events</h2>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
              <div>Event</div>
              <div>Date</div>
              <div>Attendees</div>
              <div>Rating</div>
            </div>
            {pastEvents.map((event) => (
              <div key={event.title} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
                <div className="font-semibold">{event.title}</div>
                <div>{event.date}</div>
                <div className="text-cyan-400">{event.attendees.toLocaleString()}</div>
                <div className="text-yellow-400">⭐ {event.rating}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
