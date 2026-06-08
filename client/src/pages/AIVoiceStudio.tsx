import React, { useState } from "react";

/**
 * AI Voice Studio
 * Professional vocal customization and synthesis
 */

export default function AIVoiceStudio() {
  const [selectedVoice, setSelectedVoice] = useState<string>("hope-ai");
  const [textInput, setTextInput] = useState("Welcome to the AI Voice Studio. I am Hope AI, your autonomous assistant.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 1.0,
    speed: 1.0,
    emotion: "neutral",
    accent: "american",
  });

  const voices = [
    { id: "hope-ai", name: "Hope AI", type: "Premium", accent: "American", emotion: "Professional" },
    { id: "architect", name: "Architect", type: "Agent", accent: "British", emotion: "Analytical" },
    { id: "sage", name: "Sage", type: "Agent", accent: "Neutral", emotion: "Wise" },
    { id: "catalyst", name: "Catalyst", type: "Agent", accent: "American", emotion: "Energetic" },
    { id: "healer", name: "Healer", type: "Agent", accent: "Calm", emotion: "Soothing" },
  ];

  const emotions = ["neutral", "happy", "sad", "angry", "excited", "calm", "professional"];
  const accents = ["american", "british", "australian", "indian", "neutral"];

  const handleGenerateVoice = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Generated voice with ${selectedVoice} voice!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🎤 AI Voice Studio
        </h1>
        <p className="text-slate-400">Professional vocal synthesis and customization</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Voice Selection */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Select Voice</h2>
          <div className="space-y-2">
            {voices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedVoice === voice.id
                    ? "bg-emerald-500/20 border border-emerald-400"
                    : "bg-slate-800/50 border border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="font-semibold text-sm">{voice.name}</div>
                <div className="text-xs text-slate-400 mt-1">{voice.type}</div>
                <div className="text-xs text-emerald-400 mt-1">{voice.emotion}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Input & Settings */}
        <div className="col-span-2">
          {/* Text Input */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Text to Synthesize</label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              placeholder="Enter text to convert to speech..."
            />
          </div>

          {/* Voice Settings */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Pitch */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Pitch: {voiceSettings.pitch.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Speed */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Speed: {voiceSettings.speed.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.speed}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, speed: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Emotion */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Emotion</label>
              <select
                value={voiceSettings.emotion}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, emotion: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              >
                {emotions.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Accent */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Accent</label>
              <select
                value={voiceSettings.accent}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, accent: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              >
                {accents.map((a) => (
                  <option key={a} value={a}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVoice}
            disabled={isGenerating}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
              isGenerating
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isGenerating ? "🎤 Generating Voice..." : "🎤 Generate Voice"}
          </button>
        </div>
      </div>

      {/* Preset Voices */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Preset Voices</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: "Professional", desc: "Corporate & Business" },
            { name: "Friendly", desc: "Warm & Approachable" },
            { name: "Narrator", desc: "Documentary Style" },
            { name: "Gaming", desc: "Energetic & Fun" },
          ].map((preset) => (
            <div
              key={preset.name}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-all"
            >
              <div className="font-semibold mb-1">{preset.name}</div>
              <div className="text-sm text-slate-400">{preset.desc}</div>
              <button className="mt-3 w-full bg-emerald-500/20 text-emerald-400 py-2 rounded text-sm font-semibold hover:bg-emerald-500/30 transition-all">
                Try Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
