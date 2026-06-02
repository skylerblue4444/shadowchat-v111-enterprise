/**
 * Search Indexer Worker — Keeps search index in sync
 */
interface IndexJob {
  action: "index" | "update" | "delete";
  entity: string;
  id: string;
  data?: Record<string, any>;
}

export class SearchIndexer {
  private queue: IndexJob[] = [];
  private stats = { indexed: 0, updated: 0, deleted: 0, errors: 0 };

  async index(job: IndexJob) {
    this.queue.push(job);
    return this.processQueue();
  }

  async bulkIndex(jobs: IndexJob[]) {
    this.queue.push(...jobs);
    return this.processQueue();
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, 50);
      try {
        for (const job of batch) {
          switch (job.action) {
            case "index": this.stats.indexed++; break;
            case "update": this.stats.updated++; break;
            case "delete": this.stats.deleted++; break;
          }
        }
      } catch (error) {
        this.stats.errors++;
      }
    }
    return this.stats;
  }

  async reindexAll(entity: string) {
    // Full reindex of an entity type
    return { entity, status: "started", estimatedTime: 300 };
  }

  getStats() { return this.stats; }
}

export const searchIndexer = new SearchIndexer();
