import React, { useState } from "react";

/**
 * Elite Theme Engine
 * Deep UI personalization and custom themes
 */

export default function EliteThemeEngine() {
  const [selectedTheme, setSelectedTheme] = useState("dark-luxury");
  const [customColors, setCustomColors] = useState({
    primary: "#10b981",
    secondary: "#06b6d4",
    accent: "#f59e0b",
    background: "#0f172a",
  });

  const themes = [
    {
      id: "dark-luxury",
      name: "Dark Luxury",
      description: "Premium obsidian and emerald aesthetic",
      preview: "🌙",
      colors: { primary: "#10b981", secondary: "#06b6d4", background: "#0f172a" },
      premium: false,
    },
    {
      id: "neon-cyberpunk",
      name: "Neon Cyberpunk",
      description: "High-contrast neon vibes",
      preview: "⚡",
      colors: { primary: "#00ff00", secondary: "#ff00ff", background: "#0a0a0a" },
      premium: true,
    },
    {
      id: "ocean-breeze",
      name: "Ocean Breeze",
      description: "Calm blues and aqua tones",
      preview: "🌊",
      colors: { primary: "#0ea5e9", secondary: "#06b6d4", background: "#082f49" },
      premium: true,
    },
    {
      id: "sunset-glow",
      name: "Sunset Glow",
      description: "Warm oranges and purples",
      preview: "🌅",
      colors: { primary: "#f97316", secondary: "#d946ef", background: "#1f0f2e" },
      premium: true,
    },
    {
      id: "forest-green",
      name: "Forest Green",
      description: "Natural greens and earth tones",
      preview: "🌲",
      colors: { primary: "#16a34a", secondary: "#84cc16", background: "#0c1f0f" },
      premium: false,
    },
    {
      id: "midnight-purple",
      name: "Midnight Purple",
      description: "Deep purples and lavender",
      preview: "🌌",
      colors: { primary: "#a855f7", secondary: "#ec4899", background: "#1e0a3a" },
      premium: true,
    },
  ];

  const customizationOptions = [
    { label: "Primary Color", key: "primary", description: "Main accent color" },
    { label: "Secondary Color", key: "secondary", description: "Supporting accent" },
    { label: "Accent Color", key: "accent", description: "Highlights and alerts" },
    { label: "Background Color", key: "background", description: "Main background" },
  ];

  const fontOptions = [
    { name: "Inter", description: "Modern and clean", selected: true },
    { name: "Poppins", description: "Rounded and friendly" },
    { name: "Playfair", description: "Elegant and serif" },
    { name: "Courier", description: "Monospace and technical" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🎨 Elite Theme Engine
        </h1>
        <p className="text-slate-400">Personalize your ShadowChat experience with custom themes</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Theme Selection */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Available Themes</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{theme.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{theme.description}</p>
                  </div>
                  <div className="text-2xl">{theme.preview}</div>
                </div>
                <div className="flex gap-2 mb-2">
                  {[theme.colors.primary, theme.colors.secondary, theme.colors.background].map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded border border-slate-600"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
                {theme.premium && (
                  <div className="text-xs text-purple-400 font-semibold">✨ Premium</div>
                )}
              </div>
            ))}
          </div>

          {/* Color Customization */}
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Custom Colors</h2>
          <div className="grid grid-cols-2 gap-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            {customizationOptions.map((option) => (
              <div key={option.key}>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">{option.label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColors[option.key as keyof typeof customColors]}
                    onChange={(e) =>
                      setCustomColors({
                        ...customColors,
                        [option.key]: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-xs text-slate-400">{option.description}</div>
                    <div className="text-sm font-mono text-emerald-400">
                      {customColors[option.key as keyof typeof customColors]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Font Selection */}
          <h2 className="text-xl font-bold mb-4 text-emerald-400 mt-8">Font Family</h2>
          <div className="grid grid-cols-2 gap-4">
            {fontOptions.map((font) => (
              <div
                key={font.name}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  font.selected
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="font-bold mb-1" style={{ fontFamily: font.name }}>
                  {font.name}
                </div>
                <div className="text-xs text-slate-400">{font.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview & Settings */}
        <div className="col-span-1">
          {/* Preview */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="font-bold mb-4 text-emerald-400">Preview</h3>
            <div
              className="p-4 rounded-lg mb-4 text-center"
              style={{ backgroundColor: customColors.background }}
            >
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: customColors.primary }}
              >
                ShadowChat
              </div>
              <div
                className="text-sm mb-3"
                style={{ color: customColors.secondary }}
              >
                Your Theme Preview
              </div>
              <button
                className="px-4 py-2 rounded font-bold text-white"
                style={{ backgroundColor: customColors.primary }}
              >
                Sample Button
              </button>
            </div>
          </div>

          {/* Theme Info */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3 text-emerald-400">Theme Info</h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-slate-400 mb-1">Current Theme</div>
                <div className="font-semibold">
                  {themes.find(t => t.id === selectedTheme)?.name}
                </div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Status</div>
                <div className="text-emerald-400 font-semibold">✓ Active</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
              Apply Theme
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold transition-all">
              Save as Custom
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold transition-all">
              Reset to Default
            </button>
          </div>

          {/* Premium Themes */}
          <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-sm">
              <div className="font-bold text-purple-400 mb-2">✨ Premium Themes</div>
              <p className="text-xs text-slate-400 mb-3">
                Unlock exclusive themes with Elite membership
              </p>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded font-bold text-sm transition-all">
                Upgrade to Elite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
