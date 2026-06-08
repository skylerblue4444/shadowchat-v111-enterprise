import React, { useState } from "react";

/**
 * Universal Crypto Payment Gateway
 * Accept payments in Skycoin4444 and other cryptocurrencies
 */

export default function CryptoPaymentGateway() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [paymentAmount, setPaymentAmount] = useState(100);
  const [selectedCurrency, setSelectedCurrency] = useState("SKY");

  const merchantStats = {
    totalRevenue: 245680,
    monthlyRevenue: 34560,
    transactionCount: 12450,
    conversionRate: 3.2,
  };

  const supportedCurrencies = [
    { symbol: "SKY", name: "Skycoin4444", rate: 1.0, icon: "💎" },
    { symbol: "ETH", name: "Ethereum", rate: 2450.5, icon: "Ξ" },
    { symbol: "BTC", name: "Bitcoin", rate: 42500.0, icon: "₿" },
    { symbol: "USDC", name: "USD Coin", rate: 1.0, icon: "💵" },
    { symbol: "HOPE", name: "Hope AI Token", rate: 2.75, icon: "🤖" },
  ];

  const recentTransactions = [
    { id: 1, merchant: "TechStore", amount: "250 SKY", currency: "SKY", status: "Completed", time: "2 min ago" },
    { id: 2, merchant: "GameHub", amount: "0.05 ETH", currency: "ETH", status: "Completed", time: "15 min ago" },
    { id: 3, merchant: "DigitalArt", amount: "1500 USDC", currency: "USDC", status: "Completed", time: "1 hour ago" },
    { id: 4, merchant: "CloudServices", amount: "500 SKY", currency: "SKY", status: "Pending", time: "2 hours ago" },
  ];

  const topMerchants = [
    { rank: 1, name: "TechStore", revenue: "45.2K SKY", transactions: 2345, rating: 4.9 },
    { rank: 2, name: "GameHub", revenue: "38.5K SKY", transactions: 1876, rating: 4.8 },
    { rank: 3, name: "DigitalArt", revenue: "32.1K SKY", transactions: 1543, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          💳 Crypto Payment Gateway
        </h1>
        <p className="text-slate-400">Accept Skycoin4444 and other cryptocurrencies instantly</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["dashboard", "payment", "merchants"].map((tab) => (
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

      {/* Dashboard Tab */}
      {selectedTab === "dashboard" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Total Revenue</div>
              <div className="text-3xl font-bold text-emerald-400">${merchantStats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Monthly Revenue</div>
              <div className="text-3xl font-bold text-cyan-400">${merchantStats.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Transactions</div>
              <div className="text-3xl font-bold text-purple-400">{merchantStats.transactionCount.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Conversion Rate</div>
              <div className="text-3xl font-bold text-orange-400">{merchantStats.conversionRate}%</div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-emerald-400">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Merchant</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Currency</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-sm">{tx.merchant}</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{tx.amount}</td>
                      <td className="px-4 py-3 text-sm">{tx.currency}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          tx.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Payment Tab */}
      {selectedTab === "payment" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-400">Create Payment Link</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  {supportedCurrencies.map((curr) => (
                    <option key={curr.symbol} value={curr.symbol}>
                      {curr.icon} {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <textarea
                  placeholder="Payment description..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 h-24"
                />
              </div>

              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded font-bold transition-all">
                Generate Payment Link
              </button>
            </div>
          </div>

          {/* Supported Currencies */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-400">Supported Currencies</h2>
            <div className="space-y-3">
              {supportedCurrencies.map((curr) => (
                <div key={curr.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{curr.icon}</span>
                    <div>
                      <div className="font-bold">{curr.name}</div>
                      <div className="text-xs text-slate-400">{curr.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">${curr.rate.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">1 {curr.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Merchants Tab */}
      {selectedTab === "merchants" && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Top Merchants</h2>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
              <div>Rank</div>
              <div>Merchant</div>
              <div>Revenue</div>
              <div>Transactions</div>
              <div>Rating</div>
            </div>
            {topMerchants.map((merchant) => (
              <div key={merchant.rank} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
                <div className="font-bold text-emerald-400">#{merchant.rank}</div>
                <div className="font-semibold">{merchant.name}</div>
                <div className="text-emerald-400 font-bold">{merchant.revenue}</div>
                <div>{merchant.transactions.toLocaleString()}</div>
                <div className="text-yellow-400">⭐ {merchant.rating}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
