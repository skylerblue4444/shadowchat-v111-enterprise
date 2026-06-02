import { useVoiceNav } from "@/hooks/useVoiceNav";
import { Mic, MicOff, Command } from "lucide-react";
import { useState } from "react";

export function VoiceNavOverlay() {
  const { isListening, transcript, lastCommand, confidence, toggleListening, commands } = useVoiceNav();
  const [showCommands, setShowCommands] = useState(false);

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={toggleListening}
        className={`fixed bottom-24 right-4 z-[9998] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? "bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.3)] animate-pulse"
            : "bg-[rgba(13,13,34,0.8)] border border-white/10 hover:border-cyan-400/30"
        }`}
        title="Voice Navigation (hold to speak)"
      >
        {isListening ? <Mic className="w-5 h-5 text-cyan-400" /> : <MicOff className="w-5 h-5 text-white/50" />}
      </button>

      {/* Command List Toggle */}
      <button
        onClick={() => setShowCommands(!showCommands)}
        className="fixed bottom-24 right-18 z-[9998] w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(13,13,34,0.8)] border border-white/10 hover:border-purple-400/30 transition-all"
        title="Voice Commands"
      >
        <Command className="w-4 h-4 text-white/50" />
      </button>

      {/* Listening Indicator */}
      {isListening && (
        <div className="fixed bottom-38 right-4 z-[9998] sc-glass p-3 rounded-xl max-w-[240px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Listening...</span>
          </div>
          {transcript && (
            <p className="text-xs text-white/70 truncate">{transcript}</p>
          )}
          {lastCommand && (
            <p className="text-[10px] text-green-400 mt-1">Executed: {lastCommand}</p>
          )}
          {confidence > 0 && (
            <div className="mt-1 h-1 bg-white/5 rounded overflow-hidden">
              <div className="h-full bg-cyan-400/50 rounded" style={{ width: `${confidence * 100}%` }} />
            </div>
          )}
        </div>
      )}

      {/* Command Reference Panel */}
      {showCommands && (
        <div className="fixed bottom-38 right-4 z-[9997] sc-glass p-4 rounded-xl w-[280px] max-h-[400px] overflow-y-auto sc-scroll-ios">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/80 font-[var(--font-display)]">Voice Commands</h3>
            <button onClick={() => setShowCommands(false)} className="text-white/30 hover:text-white/60 text-xs">Close</button>
          </div>
          <div className="space-y-2">
            {commands.map((cmd, i) => (
              <div key={i} className="flex items-start gap-2 py-1 border-b border-white/5 last:border-0">
                <span className="text-[10px] text-cyan-400 font-mono shrink-0 mt-0.5">"{cmd.patterns[0]}"</span>
                <span className="text-[10px] text-white/40">{cmd.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
