import React, { useState } from "react";

/**
 * AI-Powered Academy
 * Learn crypto and coding from your 12 AI agents
 */

export default function AIPoweredAcademy() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const courses = [
    {
      id: 1,
      title: "Crypto Fundamentals",
      instructor: "Sage",
      level: "Beginner",
      duration: "4 weeks",
      students: 12450,
      rating: 4.9,
      progress: 65,
      lessons: [
        { id: 1, title: "What is Blockchain?", duration: "15 min", completed: true },
        { id: 2, title: "Understanding Bitcoin", duration: "20 min", completed: true },
        { id: 3, title: "Ethereum & Smart Contracts", duration: "25 min", completed: true },
        { id: 4, title: "DeFi Protocols", duration: "30 min", completed: false },
        { id: 5, title: "NFTs & Tokenomics", duration: "25 min", completed: false },
      ],
    },
    {
      id: 2,
      title: "Advanced Trading Strategies",
      instructor: "Analyst",
      level: "Advanced",
      duration: "6 weeks",
      students: 5234,
      rating: 4.8,
      progress: 0,
      lessons: [
        { id: 1, title: "Technical Analysis Basics", duration: "30 min", completed: false },
        { id: 2, title: "Chart Patterns & Indicators", duration: "40 min", completed: false },
        { id: 3, title: "Risk Management", duration: "35 min", completed: false },
        { id: 4, title: "Portfolio Optimization", duration: "45 min", completed: false },
      ],
    },
    {
      id: 3,
      title: "Smart Contract Development",
      instructor: "Architect",
      level: "Advanced",
      duration: "8 weeks",
      students: 3456,
      rating: 4.9,
      progress: 0,
      lessons: [
        { id: 1, title: "Solidity Basics", duration: "45 min", completed: false },
        { id: 2, title: "Contract Security", duration: "50 min", completed: false },
        { id: 3, title: "Gas Optimization", duration: "40 min", completed: false },
        { id: 4, title: "Building DeFi Protocols", duration: "60 min", completed: false },
      ],
    },
    {
      id: 4,
      title: "AI & Machine Learning for Trading",
      instructor: "Innovator",
      level: "Expert",
      duration: "10 weeks",
      students: 2123,
      rating: 4.7,
      progress: 0,
      lessons: [
        { id: 1, title: "ML Fundamentals", duration: "50 min", completed: false },
        { id: 2, title: "Predictive Models", duration: "60 min", completed: false },
        { id: 3, title: "Neural Networks", duration: "70 min", completed: false },
        { id: 4, title: "Building Trading Bots", duration: "80 min", completed: false },
      ],
    },
  ];

  const achievements = [
    { title: "Crypto Scholar", description: "Complete 3 courses", icon: "📚", earned: true },
    { title: "Trading Master", description: "Achieve 80% on all quizzes", icon: "📈", earned: true },
    { title: "Code Wizard", description: "Deploy 5 smart contracts", icon: "🧙", earned: false },
    { title: "AI Expert", description: "Complete AI course", icon: "🤖", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🎓 AI-Powered Academy
        </h1>
        <p className="text-slate-400">Learn from your 12 AI agents - Crypto, Trading, and Coding</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Available Courses</h2>
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course.id);
                  setSelectedLesson(null);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedCourse === course.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm">{course.title}</h3>
                  <div className="text-yellow-400 text-xs">⭐ {course.rating}</div>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  {course.instructor} • {course.level}
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{course.progress}% complete</div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Details */}
        <div className="col-span-2">
          {selectedCourse !== null && (
            <>
              {(() => {
                const course = courses.find(c => c.id === selectedCourse);
                return (
                  <div className="space-y-6">
                    {/* Course Header */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
                      <h2 className="text-2xl font-bold mb-2">{course?.title}</h2>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Instructor</div>
                          <div className="font-semibold text-emerald-400">{course?.instructor}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Level</div>
                          <div className="font-semibold">{course?.level}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Duration</div>
                          <div className="font-semibold">{course?.duration}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Students</div>
                          <div className="font-semibold text-cyan-400">{course?.students.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-4 text-emerald-400">Course Lessons</h3>
                      <div className="space-y-2">
                        {course?.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              selectedLesson === lesson.id
                                ? "bg-emerald-500/20 border-emerald-400"
                                : "bg-slate-700/30 border-slate-600 hover:border-emerald-500/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-xl">
                                {lesson.completed ? "✓" : "○"}
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{lesson.title}</div>
                                <div className="text-xs text-slate-400">{lesson.duration}</div>
                              </div>
                            </div>
                            <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold hover:bg-emerald-500/30">
                              {lesson.completed ? "Review" : "Start"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">Completion</div>
                        <div className="text-2xl font-bold text-emerald-400">{course?.progress}%</div>
                      </div>
                      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">Lessons</div>
                        <div className="text-2xl font-bold text-cyan-400">{course?.lessons.length}</div>
                      </div>
                      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">Rating</div>
                        <div className="text-2xl font-bold text-yellow-400">⭐ {course?.rating}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {selectedCourse === null && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-12 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-slate-400">Select a course to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Achievements</h2>
        <div className="grid grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className={`p-4 rounded-lg border text-center transition-all ${
                achievement.earned
                  ? "bg-emerald-500/20 border-emerald-400"
                  : "bg-slate-800/50 border-slate-700 opacity-50"
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
              <p className="text-xs text-slate-400">{achievement.description}</p>
              {achievement.earned && (
                <div className="text-xs text-emerald-400 font-semibold mt-2">✓ Earned</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
