import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Send, X, MessageSquare, Sparkles } from "lucide-react";
import { SovereignCard, SovereignButton } from "./SovereignUI";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Beta Feedback & Bug Reporter
 * Integrated directly into the Sovereign OS for high-value user feedback
 */

export default function BetaReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { addActivity, addXP } = useNeuralCore();

  const handleSubmit = () => {
    if (feedback.trim()) {
      addActivity("BETA", `Feedback submitted: ${feedback.substring(0, 30)}...`);
      addXP(100); // Reward beta testers
      setFeedback("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] z-50 border border-emerald-400/50"
      >
        <Bug className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <SovereignCard glowColor="emerald">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic">Beta Feedback</h3>
                      <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">ShadowChat v1111 // Sovereign OS</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <MessageSquare className="absolute left-6 top-6 w-5 h-5 text-white/20" />
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="DESCRIBE_BUG_OR_FEATURE_REQUEST..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-sm font-black outline-none focus:border-emerald-500/50 transition-all italic tracking-widest min-h-[160px] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest italic">Reward: 100 Neural XP per report</span>
                  </div>

                  <SovereignButton 
                    onClick={handleSubmit}
                    variant="primary" 
                    className="w-full py-5 text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-3"
                    disabled={!feedback.trim()}
                  >
                    SUBMIT_TO_SOVEREIGN_CORE <Send className="w-4 h-4" />
                  </SovereignButton>
                </div>
              </SovereignCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
