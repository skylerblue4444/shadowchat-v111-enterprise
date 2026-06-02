/**
 * Analytics Worker — Event processing and aggregation
 */
interface AnalyticsEvent {
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  deviceInfo: { platform: string; version: string; os: string };
}

export class AnalyticsWorker {
  private buffer: AnalyticsEvent[] = [];
  private flushInterval = 5000;
  private batchSize = 100;
  private stats = { processed: 0, flushed: 0, errors: 0 };

  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  track(event: AnalyticsEvent) {
    this.buffer.push(event);
    if (this.buffer.length >= this.batchSize) this.flush();
  }

  private async flush() {
    if (this.buffer.length === 0) return;
    const batch = this.buffer.splice(0, this.batchSize);
    try {
      await this.writeBatch(batch);
      this.stats.processed += batch.length;
      this.stats.flushed++;
    } catch (error) {
      this.stats.errors++;
      this.buffer.unshift(...batch); // Put back on failure
    }
  }

  private async writeBatch(events: AnalyticsEvent[]) {
    // Write to data warehouse
    await new Promise(r => setTimeout(r, 50));
  }

  getStats() { return { ...this.stats, bufferSize: this.buffer.length }; }
}

export const analyticsWorker = new AnalyticsWorker();
