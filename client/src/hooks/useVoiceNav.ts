import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";

type VoiceCommand = {
  patterns: string[];
  action: () => void;
  description: string;
};

export function useVoiceNav() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);
  const [, navigate] = useLocation();

  // Navigation commands
  const commands: VoiceCommand[] = [
    { patterns: ["go to dashboard", "open dashboard", "show dashboard", "home"], action: () => navigate("/"), description: "Navigate to Dashboard" },
    { patterns: ["go to feed", "open feed", "social feed", "show posts"], action: () => navigate("/feed"), description: "Navigate to Social Feed" },
    { patterns: ["go to wallet", "open wallet", "show wallet", "my wallet"], action: () => navigate("/wallet"), description: "Navigate to Wallet" },
    { patterns: ["go to exchange", "open exchange", "trade", "trading"], action: () => navigate("/exchange"), description: "Navigate to Exchange" },
    { patterns: ["go to governance", "open governance", "voting", "proposals"], action: () => navigate("/governance"), description: "Navigate to Governance" },
    { patterns: ["go to marketplace", "open marketplace", "shop", "nft"], action: () => navigate("/marketplace"), description: "Navigate to Marketplace" },
    { patterns: ["go to ai", "open ai", "hope ai", "ai core", "talk to hope"], action: () => navigate("/ai"), description: "Navigate to AI Core" },
    { patterns: ["go to profile", "open profile", "my profile"], action: () => navigate("/profile"), description: "Navigate to Profile" },
    { patterns: ["go to settings", "open settings"], action: () => navigate("/settings"), description: "Navigate to Settings" },
    { patterns: ["go to notifications", "open notifications", "alerts"], action: () => navigate("/notifications"), description: "Navigate to Notifications" },
    { patterns: ["go to mining", "open mining", "mine", "mining pools"], action: () => navigate("/mining"), description: "Navigate to Mining" },
    { patterns: ["go to staking", "open staking", "stake"], action: () => navigate("/staking"), description: "Navigate to Staking" },
    { patterns: ["go to dev", "open dev", "developer", "code", "ide"], action: () => navigate("/dev"), description: "Navigate to Dev Workspace" },
    { patterns: ["go to security", "open security", "security center"], action: () => navigate("/security"), description: "Navigate to Security" },
    { patterns: ["go to analytics", "open analytics", "stats"], action: () => navigate("/analytics"), description: "Navigate to Analytics" },
    { patterns: ["go to dating", "open dating", "matches"], action: () => navigate("/dating"), description: "Navigate to Dating" },
    { patterns: ["go to live", "open live", "streaming", "live video"], action: () => navigate("/live"), description: "Navigate to Live Video" },
    { patterns: ["go to admin", "open admin", "admin panel"], action: () => navigate("/admin"), description: "Navigate to Admin" },
    // Action commands
    { patterns: ["scroll down", "page down"], action: () => window.scrollBy({ top: 400, behavior: "smooth" }), description: "Scroll down" },
    { patterns: ["scroll up", "page up"], action: () => window.scrollBy({ top: -400, behavior: "smooth" }), description: "Scroll up" },
    { patterns: ["go back", "back", "previous"], action: () => window.history.back(), description: "Go back" },
    { patterns: ["refresh", "reload"], action: () => window.location.reload(), description: "Refresh page" },
    { patterns: ["scroll to top", "top of page"], action: () => window.scrollTo({ top: 0, behavior: "smooth" }), description: "Scroll to top" },
  ];

  const processCommand = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();
    for (const cmd of commands) {
      for (const pattern of cmd.patterns) {
        if (lower.includes(pattern)) {
          cmd.action();
          setLastCommand(cmd.description);
          return true;
        }
      }
    }
    return false;
  }, [commands]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          setConfidence(result[0].confidence);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        processCommand(finalTranscript);
      } else if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [processCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    lastCommand,
    confidence,
    toggleListening,
    startListening,
    stopListening,
    commands: commands.map(c => ({ patterns: c.patterns, description: c.description })),
  };
}
