import React, { useState } from "react";

/**
 * Personal AI Concierge
 * AI-powered task management and scheduling
 */

export default function PersonalAIConcierge() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [newTask, setNewTask] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");

  const tasks = [
    {
      id: 1,
      title: "Review investment portfolio",
      description: "Check performance of all crypto positions",
      priority: "High",
      dueDate: "Today",
      assignedAgent: "Analyst",
      status: "In Progress",
      progress: 65,
      subtasks: [
        { title: "Check BTC position", completed: true },
        { title: "Review ETH performance", completed: true },
        { title: "Analyze SKY holdings", completed: false },
      ],
    },
    {
      id: 2,
      title: "Claim staking rewards",
      description: "Harvest rewards from liquidity pools",
      priority: "Medium",
      dueDate: "Tomorrow",
      assignedAgent: "Optimizer",
      status: "Pending",
      progress: 0,
      subtasks: [
        { title: "Check pending rewards", completed: false },
        { title: "Claim rewards", completed: false },
        { title: "Reinvest earnings", completed: false },
      ],
    },
    {
      id: 3,
      title: "Participate in DAO vote",
      description: "Vote on platform governance proposal",
      priority: "High",
      dueDate: "2 days",
      assignedAgent: "Guardian",
      status: "Pending",
      progress: 0,
      subtasks: [
        { title: "Review proposal details", completed: false },
        { title: "Cast vote", completed: false },
      ],
    },
    {
      id: 4,
      title: "Explore new NFT collection",
      description: "Check latest drops on the marketplace",
      priority: "Low",
      dueDate: "This week",
      assignedAgent: "Innovator",
      status: "Pending",
      progress: 0,
      subtasks: [
        { title: "Browse marketplace", completed: false },
        { title: "Evaluate collection", completed: false },
      ],
    },
  ];

  const schedule = [
    { time: "09:00 AM", event: "Market Analysis Brief", agent: "Analyst" },
    { time: "11:30 AM", event: "Staking Rewards Claim", agent: "Optimizer" },
    { time: "02:00 PM", event: "DAO Voting Session", agent: "Guardian" },
    { time: "04:30 PM", event: "Portfolio Review", agent: "Sage" },
    { time: "06:00 PM", event: "NFT Market Update", agent: "Innovator" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🤵 Personal AI Concierge
        </h1>
        <p className="text-slate-400">AI-powered task management and scheduling</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tasks & Schedule */}
        <div className="col-span-2">
          {/* Quick Add Task */}
          <div className="mb-6 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-bold transition-all">
                Add
              </button>
            </div>
          </div>

          {/* Tasks */}
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Your Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTask === task.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    task.priority === "High" ? "bg-red-500/20 text-red-400" :
                    task.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {task.priority}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{task.assignedAgent} • {task.dueDate}</span>
                  <span>{task.status}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Details & Schedule */}
        <div className="col-span-1 space-y-6">
          {/* Task Details */}
          {selectedTask !== null && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <h3 className="font-bold mb-4 text-emerald-400">Task Details</h3>
              {(() => {
                const task = tasks.find(t => t.id === selectedTask);
                return (
                  <>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-slate-400 mb-1">Title</div>
                        <div className="font-semibold">{task?.title}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Assigned Agent</div>
                        <div className="font-semibold text-emerald-400">{task?.assignedAgent}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Due Date</div>
                        <div className="font-semibold">{task?.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-2">Subtasks</div>
                        <div className="space-y-1">
                          {task?.subtasks.map((sub, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="checkbox" checked={sub.completed} className="w-4 h-4" />
                              <span className={sub.completed ? "line-through text-slate-500" : ""}>{sub.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                      Mark Complete
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* Daily Schedule */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
            <h3 className="font-bold mb-4 text-emerald-400">Today's Schedule</h3>
            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div key={idx} className="p-2 bg-slate-700/30 rounded text-sm">
                  <div className="font-semibold text-emerald-400">{item.time}</div>
                  <div className="text-slate-300">{item.event}</div>
                  <div className="text-xs text-slate-400">{item.agent}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
            <h3 className="font-bold mb-3 text-emerald-400">AI Recommendations</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded">
                <div className="font-semibold text-emerald-400">💡 Optimize Staking</div>
                <div className="text-xs text-slate-400 mt-1">Move 5K SKY to 180-day pool for +7% APY</div>
              </div>
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
                <div className="font-semibold text-cyan-400">📈 Market Opportunity</div>
                <div className="text-xs text-slate-400 mt-1">ETH showing bullish signals, consider DCA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
