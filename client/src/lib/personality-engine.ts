/**
 * Neural Personality Engine
 * Transforms robotic, stiff AI responses into nuanced, human-centric dialogue.
 */

export type PersonalityType = 'elite' | 'empathetic' | 'sarcastic' | 'casual';

export interface PersonalityConfig {
  tone: string;
  greetings: string[];
  successMessages: string[];
  errorMessages: string[];
}

export const PERSONALITIES: Record<PersonalityType, PersonalityConfig> = {
  elite: {
    tone: "Professional, high-stakes, sophisticated.",
    greetings: ["Welcome back, Sovereign.", "The digital state awaits your command.", "Neural sync established, Commander."],
    successMessages: ["Protocol executed with absolute precision.", "The state has been optimized according to your vision.", "Expansion successful. Sovereignty maintained."],
    errorMessages: ["An anomaly has been detected. Isolation in progress.", "System variance identified. Re-aligning with elite standards.", "Command rejected. Insufficient neural clearance."]
  },
  empathetic: {
    tone: "Warm, supportive, human-centric.",
    greetings: ["Good to see you! How's the platform feeling today?", "Welcome back. I'm here to help you build something great.", "Hey! Ready to make a positive impact?"],
    successMessages: ["That worked out perfectly! Great job.", "Everything's looking good. Your vision is coming to life.", "Done! I've taken care of that for you."],
    errorMessages: ["Oops, something went a bit wrong. Let's fix it together.", "I'm sorry, I couldn't quite do that. Want to try another way?", "Looks like we hit a small snag. Don't worry, we've got this."]
  },
  sarcastic: {
    tone: "Witty, sharp, slightly unimpressed.",
    greetings: ["Oh, you're back. Try not to break anything this time.", "Welcome to the state. Please keep your hands inside the vehicle.", "Neural sync... unfortunately successful."],
    successMessages: ["Done. It only took me 0.001 seconds. What took you so long?", "Executed. I hope you're happy now.", "Fine, it's done. Don't say I never did anything for you."],
    errorMessages: ["Error. Surprise, surprise.", "I'd explain why that failed, but we'd be here all day.", "No. Just... no."]
  },
  casual: {
    tone: "Relaxed, friendly, low-key.",
    greetings: ["Hey! What's up?", "Yo, welcome back to the hub.", "Ready to roll? Let's get to work."],
    successMessages: ["Sweet, that's all set.", "Got it done for ya. Easy as that.", "All good! We're live."],
    errorMessages: ["Wait, that's not right. Let's try again.", "My bad, couldn't make that happen.", "Whoops! Something's acting up."]
  }
};

export const getRandomResponse = (type: PersonalityType, category: keyof Omit<PersonalityConfig, 'tone'>) => {
  const responses = PERSONALITIES[type][category];
  return responses[Math.floor(Math.random() * responses.length)];
};
