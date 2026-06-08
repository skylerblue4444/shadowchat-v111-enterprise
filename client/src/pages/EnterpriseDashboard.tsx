import React, { useState } from "react";

export default function EnterpriseDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const metrics = [
    { label: "Total Revenue", value: "$2.4M", change: "+12.5%", icon: "💰" },
    { label: "Active Users", value: "44.2K", change: "+8.3%", icon: "👥" },
    { label: "System Uptime", value: "99.98%", change: "+0.02%", icon: "✅" },
    { label: "AI Agents Active", value: "12/12", change: "100%", icon: "🤖" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 sc-text-gradient-emerald">
              📊 Enterprise Dashboard
            </h1>
            <p className="text-gray-400">Real-time business intelligence and performance metrics</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="sc-input"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => (
            <div key={idx} className="sc-glass p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{metric.icon}</span>
                <span className="text-emerald-400 text-sm font-semibold">{metric.change}</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="sc-glass p-6 rounded-lg">
            <h3 className="font-bold mb-4">Revenue Trend</h3>
            <div className="h-48 bg-gray-900/30 rounded flex items-center justify-center">
              <p className="text-gray-500">📈 Revenue chart placeholder</p>
            </div>
          </div>

          {/* User Growth */}
          <div className="sc-glass p-6 rounded-lg">
            <h3 className="font-bold mb-4">User Growth</h3>
            <div className="h-48 bg-gray-900/30 rounded flex items-center justify-center">
              <p className="text-gray-500">📊 User growth chart placeholder</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="sc-glass p-6 rounded-lg">
          <h3 className="font-bold mb-6">Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "API Response Time", value: "145ms", status: "optimal" },
              { label: "Database Query Time", value: "89ms", status: "optimal" },
              { label: "Cache Hit Rate", value: "94.2%", status: "optimal" },
            ].map((perf, idx) => (
              <div key={idx} className="bg-gray-900/30 p-4 rounded">
                <p className="text-gray-400 text-sm mb-2">{perf.label}</p>
                <p className="text-2xl font-bold text-emerald-400">{perf.value}</p>
                <p className="text-xs text-emerald-400 mt-2">✓ {perf.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
