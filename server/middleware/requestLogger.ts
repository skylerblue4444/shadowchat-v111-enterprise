/**
 * Request Logger Middleware — Structured logging with performance tracking
 */
interface RequestLog {
  id: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  userId?: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  error?: string;
}

export class RequestLogger {
  private logs: RequestLog[] = [];
  private maxLogs = 10000;

  log(entry: Omit<RequestLog, "timestamp">) {
    const log: RequestLog = { ...entry, timestamp: new Date().toISOString() };
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) this.logs.shift();
    
    // Console output in structured format
    const level = log.status >= 500 ? "ERROR" : log.status >= 400 ? "WARN" : "INFO";
    console.log(JSON.stringify({ level, ...log }));
  }

  getRecent(limit = 100) { return this.logs.slice(-limit); }
  getErrors() { return this.logs.filter(l => l.status >= 500); }
  getSlowRequests(thresholdMs = 1000) { return this.logs.filter(l => l.duration > thresholdMs); }
  
  getStats() {
    const total = this.logs.length;
    const errors = this.logs.filter(l => l.status >= 500).length;
    const avgDuration = this.logs.reduce((sum, l) => sum + l.duration, 0) / total || 0;
    return { total, errors, errorRate: errors / total || 0, avgDuration: Math.round(avgDuration) };
  }
}

export const requestLogger = new RequestLogger();
