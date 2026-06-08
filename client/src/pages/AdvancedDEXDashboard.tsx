import React, { useState, useEffect } from "react";

/**
 * Advanced DEX & Yield Farming Dashboard
 * High-performance trading and earning platform
 */

export default function AdvancedDEXDashboard() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [liquidityAmount, setLiquidityAmount] = useState(1000);
  const [userStats, setUserStats] = useState({
    totalLiquidity: 125400,
    totalEarnings: 34560,
    apy: 45.2,
    pendingRewards: 2340,
  });

  const liquidityPools = [
    {
      id: 1,
      pair: "SKY/USDC",
      tvl: "45.2M",
      apy: 45.2,
      volume24h: "12.3M",
      fee: "0.25%",
      yourLiquidity: "25,000",
      yourEarnings: "12,450",
    },
    {
      id: 2,
      pair: "SKY/ETH",
      tvl: "32.8M",
      apy: 38.5,
      volume24h: "8.9M",
      fee: "0.30%",
      yourLiquidity: "15,000",
      yourEarnings: "8,230",
    },
    {
      id: 3,
      pair: "HOPE/SKY",
      tvl: "28.5M",
      apy: 52.3,
      volume24h: "6.7M",
      fee: "0.50%",
      yourLiquidity: "8,500",
      yourEarnings: "5,890",
    },
    {
      id: 4,
      pair: "SKY/USDT",
      tvl: "38.2M",
      apy: 42.1,
      volume24h: "11.2M",
      fee: "0.25%",
      yourLiquidity: "20,000",
      yourEarnings: "9,890",
    },
  ];

  const topPools = [
    { rank: 1, pair: "SKY/USDC", tvl: "45.2M", apy: 45.2, volume: "12.3M", risk: "Low" },
    { rank: 2, pair: "SKY/ETH", tvl: "32.8M", apy: 38.5, volume: "8.9M", risk: "Low" },
    { rank: 3, pair: "HOPE/SKY", tvl: "28.5M", apy: 52.3, volume: "6.7M", risk: "Medium" },
    { rank: 4, pair: "SKY/USDT", tvl: "38.2M", apy: 42.1, volume: "11.2M", risk: "Low" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          💱 Advanced DEX & Yield Farming
        </h1>
        <p className="text-slate-400">High-performance trading and passive income generation</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Liquidity</div>
          <div className="text-3xl font-bold text-emerald-400">${userStats.totalLiquidity.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Earnings</div>
          <div className="text-3xl font-bold text-cyan-400">${userStats.totalEarnings.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Average APY</div>
          <div className="text-3xl font-bold text-purple-400">{userStats.apy}%</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Pending Rewards</div>
          <div className="text-3xl font-bold text-orange-400">${userStats.pendingRewards.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Liquidity Pools */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Your Liquidity Positions</h2>
          <div className="space-y-3">
            {liquidityPools.map((pool) => (
              <div
                key={pool.id}
                onClick={() => setSelectedPool(pool.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPool === pool.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{pool.pair}</h3>
                    <div className="text-xs text-slate-400">Fee: {pool.fee}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{pool.apy}% APY</div>
                    <div className="text-xs text-slate-400">Volume: {pool.volume24h}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Your Liquidity</div>
                    <div className="font-bold text-emerald-400">${pool.yourLiquidity}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Your Earnings</div>
                    <div className="font-bold text-cyan-400">${pool.yourEarnings}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">TVL</div>
                    <div className="font-bold">{pool.tvl}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Liquidity Panel */}
        <div className="col-span-1">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Add Liquidity</h3>

            {selectedPool !== null && (
              <>
                <div className="mb-4">
                  <label className="text-sm text-slate-400 mb-2 block">Pool: {liquidityPools[selectedPool - 1].pair}</label>
                  <div className="bg-slate-700/50 p-3 rounded text-sm">
                    <div className="text-slate-400 mb-1">APY: {liquidityPools[selectedPool - 1].apy}%</div>
                    <div className="text-emerald-400 font-bold">${liquidityPools[selectedPool - 1].tvl} TVL</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-slate-400 mb-2 block">Amount (USD)</label>
                  <input
                    type="number"
                    value={liquidityAmount}
                    onChange={(e) => setLiquidityAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="mb-4 p-3 bg-slate-700/30 rounded text-sm">
                  <div className="text-slate-400 mb-1">Estimated Annual Earnings</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${(liquidityAmount * (liquidityPools[selectedPool - 1].apy / 100)).toFixed(0)}
                  </div>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all mb-2">
                  Add Liquidity
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold transition-all">
                  Remove Liquidity
                </button>
              </>
            )}

            {selectedPool === null && (
              <div className="text-slate-400 text-sm">Select a pool to add liquidity</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Pools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Top Liquidity Pools</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
            <div>Rank</div>
            <div>Pool</div>
            <div>TVL</div>
            <div>APY</div>
            <div>24h Volume</div>
            <div>Risk</div>
          </div>
          {topPools.map((pool) => (
            <div key={pool.rank} className="grid grid-cols-6 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
              <div className="font-bold text-emerald-400">#{pool.rank}</div>
              <div className="font-semibold">{pool.pair}</div>
              <div>${pool.tvl}</div>
              <div className="text-emerald-400 font-bold">{pool.apy}%</div>
              <div>${pool.volume}</div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                pool.risk === "Low" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {pool.risk}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
