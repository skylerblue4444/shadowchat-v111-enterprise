/**
 * Email Worker — Processes email queue
 */
interface EmailJob {
  to: string | string[];
  subject: string;
  template: string;
  variables: Record<string, any>;
  priority: "high" | "medium" | "low";
}

export class EmailWorker {
  private queue: EmailJob[] = [];
  private processing = false;
  private stats = { sent: 0, failed: 0, queued: 0 };

  async enqueue(job: EmailJob) {
    this.queue.push(job);
    this.stats.queued++;
    if (!this.processing) this.process();
  }

  private async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      try {
        await this.sendEmail(job);
        this.stats.sent++;
      } catch (error) {
        this.stats.failed++;
        if (job.priority === "high") this.queue.unshift(job); // Retry high priority
      }
    }
    this.processing = false;
  }

  private async sendEmail(job: EmailJob) {
    // Email sending logic
    await new Promise(r => setTimeout(r, 100));
  }

  getStats() { return this.stats; }
}

export const emailWorker = new EmailWorker();
