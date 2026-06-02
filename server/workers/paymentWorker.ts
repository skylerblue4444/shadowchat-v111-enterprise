/**
 * Payment Worker — Processes payment queue with retry logic
 */
interface PaymentJob {
  id: string;
  type: "charge" | "refund" | "transfer" | "payout";
  amount: number;
  currency: string;
  fromId?: string;
  toId?: string;
  metadata: Record<string, any>;
  retryCount: number;
  maxRetries: number;
}

export class PaymentWorker {
  private queue: PaymentJob[] = [];
  private deadLetter: PaymentJob[] = [];
  private stats = { processed: 0, succeeded: 0, failed: 0, retried: 0 };

  async enqueue(job: Omit<PaymentJob, "retryCount" | "maxRetries">) {
    this.queue.push({ ...job, retryCount: 0, maxRetries: 3 });
    return this.processNext();
  }

  private async processNext() {
    const job = this.queue.shift();
    if (!job) return null;

    try {
      const result = await this.processPayment(job);
      this.stats.processed++;
      this.stats.succeeded++;
      return result;
    } catch (error) {
      if (job.retryCount < job.maxRetries) {
        job.retryCount++;
        this.stats.retried++;
        // Exponential backoff
        setTimeout(() => this.queue.push(job), Math.pow(2, job.retryCount) * 1000);
      } else {
        this.deadLetter.push(job);
        this.stats.failed++;
      }
      return null;
    }
  }

  private async processPayment(job: PaymentJob) {
    await new Promise(r => setTimeout(r, 200));
    return { id: job.id, status: "completed", processedAt: new Date().toISOString() };
  }

  getDeadLetter() { return this.deadLetter; }
  getStats() { return { ...this.stats, queueSize: this.queue.length, deadLetterSize: this.deadLetter.length }; }
}

export const paymentWorker = new PaymentWorker();
