/**
 * HealthPortal Page — Telehealth, patient records, and wearable data
 * ShadowChat Enterprise Platform v110
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export default function HealthPortalPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      setData([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  const handleCreate = useCallback(async (formData: any) => {
    setIsCreateOpen(false);
    await loadData();
  }, [loadData]);

  const handleBulkAction = useCallback(async (action: string) => {
    setSelectedItems([]);
    await loadData();
  }, [selectedItems, loadData]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button onClick={loadData} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              HealthPortal
            </h1>
            <div className="hidden md:flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              {["overview", "analytics", "settings"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              {(["list", "grid", "kanban"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded ${viewMode === mode ? "bg-gray-700" : ""}`}
                >
                  {mode === "list" ? "☰" : mode === "grid" ? "⊞" : "◫"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              + Create
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: "12,847", change: "+12%", color: "blue" },
            { label: "Active", value: "10,234", change: "+8%", color: "green" },
            { label: "Processing", value: "1,456", change: "-3%", color: "yellow" },
            { label: "Revenue", value: "$847K", change: "+23%", color: "purple" },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className={`text-sm ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm">{selectedItems.length} items selected</span>
            <div className="flex gap-2">
              <button onClick={() => handleBulkAction("activate")} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Activate</button>
              <button onClick={() => handleBulkAction("archive")} className="px-3 py-1 bg-yellow-600 text-white rounded text-sm">Archive</button>
              <button onClick={() => handleBulkAction("delete")} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              <button onClick={() => setSelectedItems([])} className="px-3 py-1 bg-gray-700 text-white rounded text-sm">Clear</button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No data yet</h3>
              <p className="text-gray-400 mb-4">Get started by creating your first item</p>
              <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                + Create First Item
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => setSortBy("name")}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => setSortBy("createdAt")}>Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded bg-gray-700 border-gray-600" /></td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.priority}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-400 hover:text-blue-300 mr-3 text-sm">Edit</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">Showing {filteredData.length} of {data.length} results</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-700">Previous</button>
            <span className="px-3 py-1.5 bg-blue-600 rounded-lg text-sm">{currentPage}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:bg-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Create New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg" placeholder="Enter name..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg h-24" placeholder="Enter description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg">
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tags</label>
                  <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg" placeholder="tag1, tag2" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
              <button onClick={() => handleCreate({})} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
