import React, { useState } from "react";

/**
 * Autonomous Workforce & HR Management System
 * AI-driven human capital and organizational optimization
 */

export default function WorkforceManagementHub() {
  const [activeTab, setActiveTab] = useState("employees");

  const hrMetrics = [
    { label: "Total Workforce", value: "12,450", status: "Active" },
    { label: "Productivity Score", value: "94.3%", status: "Optimal" },
    { label: "Retention Rate", value: "98.7%", status: "Excellent" },
    { label: "Avg Salary", value: "$185K", status: "Competitive" },
  ];

  const departments = [
    { name: "Engineering", headcount: 3245, utilization: 92, satisfaction: 9.2 },
    { name: "Product & Design", headcount: 1850, utilization: 88, satisfaction: 8.9 },
    { name: "Sales & Marketing", headcount: 2340, utilization: 95, satisfaction: 8.7 },
    { name: "Operations", headcount: 2015, utilization: 90, satisfaction: 9.1 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Workforce<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous HR // Organizational Intelligence
          </p>
        </div>
        <div className="text-right">
          <button className="bg-emerald-500 text-black px-8 py-3 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all">
            Hire Now
          </button>
        </div>
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {hrMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{metric.value}</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase">{metric.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Department Overview */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Department Performance</h2>
          <div className="space-y-4">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 group hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-500 transition-colors">{dept.name}</h3>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{dept.headcount} Employees</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-500 mb-1">{dept.satisfaction}/10</div>
                    <div className="text-[10px] font-bold text-slate-600 uppercase">Satisfaction</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-600 font-bold mb-1">Utilization</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${dept.utilization}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Acquisition */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Talent Acquisition</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              AI-powered recruitment matching top 0.1% talent with 98.2% cultural fit prediction and 3-day onboarding.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-sm">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Open Positions</div>
                <div className="text-2xl font-black text-emerald-500">47</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">All Critical Roles</div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Candidates
              </button>
              <button className="w-full bg-emerald-500 text-black py-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Post Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
