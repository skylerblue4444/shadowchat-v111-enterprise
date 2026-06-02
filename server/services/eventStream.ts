/**
 * Event Stream Service — Real-time event processing
 */
type EventHandler = (event: any) => void | Promise<void>;

interface StreamConfig {
  topic: string;
  partition?: number;
  group?: string;
  fromBeginning?: boolean;
}

export class EventStreamService {
  private topics: Map<string, EventHandler[]> = new Map();
  private deadLetterQueue: any[] = [];
  private processedCount = 0;

  subscribe(config: StreamConfig, handler: EventHandler) {
    const handlers = this.topics.get(config.topic) || [];
    handlers.push(handler);
    this.topics.set(config.topic, handlers);
    return () => {
      const h = this.topics.get(config.topic) || [];
      this.topics.set(config.topic, h.filter(fn => fn !== handler));
    };
  }

  async publish(topic: string, event: any, options?: { key?: string; headers?: Record<string, string> }) {
    const handlers = this.topics.get(topic) || [];
    for (const handler of handlers) {
      try {
        await handler({ ...event, _topic: topic, _timestamp: Date.now(), _headers: options?.headers });
        this.processedCount++;
      } catch (error) {
        this.deadLetterQueue.push({ topic, event, error, timestamp: Date.now() });
      }
    }
  }

  getStats() {
    return {
      topics: this.topics.size,
      totalHandlers: Array.from(this.topics.values()).reduce((sum, h) => sum + h.length, 0),
      processed: this.processedCount,
      deadLetterSize: this.deadLetterQueue.length,
    };
  }
}

export const eventStream = new EventStreamService();
