import React, { useState } from "react";

/**
 * Events & Tournaments Hub
 * Platform-wide challenges and high-stakes competitions
 */

export default function EventsHub() {
  const [activeFilter, setActiveFilter] = useState("all");

  const eventMetrics = [
    { label: "Active Events", value: "12", status: "Ongoing" },
    { label: "Total Prize Pool", value: "25M", status: "Skycoin4444" },
    { label: "Participants", value: "850K", status: "Active" },
    { label: "Next Event In", value: "04:32:15", status: "Countdown" },
  ];

  const events = [
    { id: 1, title: "Global Puzzle Championship", prize: "5,000,000 SKY", start: "2024-06-10", type: "Tournament", status: "Registering" },
    { id: 2, title: "Skycoin Hackathon", prize: "2,500,000 SKY", start: "2024-06-15", type: "Competition", status: "Open" },
    { id: 3, title: "Neural Network Sprint", prize: "1,000,000 SKY", start: "2024-06-20", type: "Sprint", status: "Upcoming" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Events<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Global Tournaments // High-Stakes Rewards
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Participation</div>
          <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● 850,245 Online</div>
        </div>
      </div>

      {/* Event Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {eventMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black">{metric.value}</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase">{metric.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Event List */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Active & Upcoming Events</h2>
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-slate-900/20 border-l-4 border-slate-800 p-8 flex justify-between items-center group hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-black uppercase italic group-hover:text-emerald-500 transition-colors">{event.title}</h3>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-1 uppercase tracking-widest">{event.type}</span>
                  </div>
                  <div className="flex gap-6 mt-3">
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Prize Pool</div>
                      <div className="text-lg font-black text-emerald-500">{event.prize}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Starts On</div>
                      <div className="text-lg font-black text-slate-300">{event.start}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4 inline-block ${
                    event.status === "Registering" ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-500"
                  }`}>
                    {event.status}
                  </div>
                  <br />
                  <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all">View Event Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Stream / Activity */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Live Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 items-start border-b border-slate-800 pb-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 animate-pulse"></div>
                  <div>
                    <p className="text-[10px] text-slate-300 leading-tight">
                      <span className="font-black uppercase italic">User_{1234 + i}</span> just registered for the <span className="text-emerald-500 font-bold">Global Puzzle Championship</span>
                    </p>
                    <span className="text-[8px] text-slate-600 font-mono uppercase mt-1 inline-block">2m ago</span>
                  </div>
                </div>
              ))}
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                Join Community Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
