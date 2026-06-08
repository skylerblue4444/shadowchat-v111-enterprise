import React, { useState } from "react";

/**
 * Education & Skill Development Academy
 * AI-powered personalized learning and certification
 */

export default function EducationAcademy() {
  const [activeLevel, setActiveLevel] = useState("advanced");

  const academyMetrics = [
    { label: "Active Learners", value: "5.2M", status: "Growing" },
    { label: "Courses Available", value: "12,450", status: "Expanding" },
    { label: "Completion Rate", value: "94.3%", status: "Excellent" },
    { label: "Job Placement", value: "98.7%", status: "Leading" },
  ];

  const courses = [
    { name: "Quantum Computing Mastery", level: "Advanced", duration: "12 weeks", students: 45000, rating: 4.9 },
    { name: "AI/ML Engineering", level: "Advanced", duration: "16 weeks", students: 125000, rating: 4.8 },
    { name: "Blockchain Development", level: "Intermediate", duration: "10 weeks", students: 78000, rating: 4.7 },
    { name: "Data Science Fundamentals", level: "Beginner", duration: "8 weeks", students: 250000, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Academy<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Personalized Learning // Skill Mastery
          </p>
        </div>
        <div className="text-right">
          <button className="bg-emerald-500 text-black px-8 py-3 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all">
            Enroll Now
          </button>
        </div>
      </div>

      {/* Academy Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {academyMetrics.map((metric, idx) => (
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
        {/* Featured Courses */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Featured Courses</h2>
          <div className="space-y-4">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 group hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-500 transition-colors">{course.name}</h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-1 uppercase">{course.level}</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Duration: {course.duration}</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Students: {course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-500">{course.rating}</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Dashboard */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">AI Learning Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              Adaptive learning paths personalized to your goals, learning style, and career aspirations with real-time progress tracking.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-sm">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Your Progress</div>
                <div className="text-2xl font-black text-emerald-500">67%</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">AI Engineering Path</div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                Continue Learning
              </button>
              <button className="w-full bg-emerald-500 text-black py-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Get Certified
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
