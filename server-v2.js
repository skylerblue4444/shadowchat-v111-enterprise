/**
 * @file server-v2.js
 * @description Enhanced Node.js backend for ShadowChat v1111 with production-grade error handling
 * Implements the core loop: API Request → Event Created → Worker Processes → DB Updated → Result Returned
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// ============================================================================
// LOGGING & MONITORING
// ============================================================================

const logs = [];

function log(level, component, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, component, message, data };
  logs.push(logEntry);
  console.log(`[${timestamp}] [${level}] [${component}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`);
}

// ============================================================================
// DATABASE SETUP
// ============================================================================

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    log('ERROR', 'DB', 'Database connection error', err);
  } else {
    log('INFO', 'DB', 'Connected to SQLite in-memory database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        skycoin_balance REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) log('ERROR', 'DB', 'Failed to create users table', err);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        user_id TEXT,
        payload TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        processed_at TEXT,
        error_message TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) log('ERROR', 'DB', 'Failed to create events table', err);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) log('ERROR', 'DB', 'Failed to create transactions table', err);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS feed (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        event_id TEXT,
        event_type TEXT,
        message TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(event_id) REFERENCES events(id)
      )
    `, (err) => {
      if (err) log('ERROR', 'DB', 'Failed to create feed table', err);
    });

    log('INFO', 'DB', 'Database schema initialized');
  });
}

// ============================================================================
// IN-MEMORY EVENT QUEUE WITH METRICS
// ============================================================================

const eventQueue = [];
const queueMetrics = {
  totalProcessed: 0,
  totalFailed: 0,
  currentSize: 0,
};

function pushEvent(event) {
  eventQueue.push(event);
  queueMetrics.currentSize = eventQueue.length;
  log('DEBUG', 'Queue', `Event pushed: ${event.id}`, { type: event.type, queueSize: queueMetrics.currentSize });
}

function pullEvent() {
  const event = eventQueue.shift();
  if (event) {
    queueMetrics.currentSize = eventQueue.length;
  }
  return event || null;
}

// ============================================================================
// WORKER SYSTEM (AGENT V1) WITH RETRY LOGIC
// ============================================================================

const MAX_RETRIES = 3;
const failedEvents = new Map();

async function processEvent(event) {
  log('INFO', 'Worker', `Processing event: ${event.id}`, { type: event.type, userId: event.userId });

  return new Promise((resolve) => {
    if (event.type === 'user_earn_reward') {
      const { userId, rewardAmount } = event.payload;

      // Validation
      if (!userId || !rewardAmount || rewardAmount <= 0) {
        const error = 'Invalid event payload';
        log('ERROR', 'Worker', `Event validation failed: ${event.id}`, { error });
        db.run(
          `UPDATE events SET status = 'failed', error_message = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [error, event.id],
          () => {
            queueMetrics.totalFailed++;
            resolve({ success: false, error });
          }
        );
        return;
      }

      // Check user exists
      db.get(`SELECT id FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) {
          const error = 'User not found';
          log('ERROR', 'Worker', `User validation failed: ${event.id}`, { userId, error });
          db.run(
            `UPDATE events SET status = 'failed', error_message = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [error, event.id],
            () => {
              queueMetrics.totalFailed++;
              resolve({ success: false, error });
            }
          );
          return;
        }

        // Update balance
        db.run(
          `UPDATE users SET skycoin_balance = skycoin_balance + ? WHERE id = ?`,
          [rewardAmount, userId],
          function (err) {
            if (err) {
              log('ERROR', 'Worker', `Balance update failed: ${event.id}`, err);
              handleRetry(event, resolve);
              return;
            }

            // Log transaction
            const txnId = uuidv4();
            db.run(
              `INSERT INTO transactions (id, user_id, type, amount, reason) VALUES (?, ?, ?, ?, ?)`,
              [txnId, userId, 'credit', rewardAmount, 'User earned reward'],
              (err) => {
                if (err) {
                  log('ERROR', 'Worker', `Transaction logging failed: ${event.id}`, err);
                  handleRetry(event, resolve);
                  return;
                }

                // Add to feed
                const feedId = uuidv4();
                db.run(
                  `INSERT INTO feed (id, user_id, event_id, event_type, message) VALUES (?, ?, ?, ?, ?)`,
                  [feedId, userId, event.id, event.type, `You earned ${rewardAmount} SkyCoin!`],
                  (err) => {
                    if (err) {
                      log('ERROR', 'Worker', `Feed entry creation failed: ${event.id}`, err);
                      handleRetry(event, resolve);
                      return;
                    }

                    // Mark event as completed
                    db.run(
                      `UPDATE events SET status = 'completed', processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
                      [event.id],
                      (err) => {
                        if (err) {
                          log('ERROR', 'Worker', `Event completion failed: ${event.id}`, err);
                          handleRetry(event, resolve);
                          return;
                        }

                        log('INFO', 'Worker', `Event processed successfully: ${event.id}`, { rewardAmount, userId });
                        queueMetrics.totalProcessed++;
                        failedEvents.delete(event.id);
                        resolve({
                          success: true,
                          message: `Reward of ${rewardAmount} SkyCoin added to user ${userId}`,
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    } else {
      const error = `Unknown event type: ${event.type}`;
      log('ERROR', 'Worker', error);
      db.run(
        `UPDATE events SET status = 'failed', error_message = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [error, event.id],
        () => {
          queueMetrics.totalFailed++;
          resolve({ success: false, error });
        }
      );
    }
  });
}

function handleRetry(event, resolve) {
  const retryCount = (failedEvents.get(event.id) || 0) + 1;

  if (retryCount <= MAX_RETRIES) {
    log('WARN', 'Worker', `Retrying event: ${event.id}`, { retryCount, maxRetries: MAX_RETRIES });
    failedEvents.set(event.id, retryCount);
    pushEvent(event); // Re-queue for retry
    resolve({ success: false, retrying: true, retryCount });
  } else {
    log('ERROR', 'Worker', `Event failed after max retries: ${event.id}`, { retryCount });
    db.run(
      `UPDATE events SET status = 'failed', error_message = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [`Failed after ${MAX_RETRIES} retries`, event.id],
      () => {
        queueMetrics.totalFailed++;
        failedEvents.delete(event.id);
        resolve({ success: false, error: 'Max retries exceeded' });
      }
    );
  }
}

// ============================================================================
// WORKER LOOP
// ============================================================================

let workerRunning = false;
let workerStats = { processed: 0, failed: 0 };

function startWorker() {
  if (workerRunning) return;
  workerRunning = true;

  const workerLoop = async () => {
    while (workerRunning) {
      const event = pullEvent();

      if (event) {
        const result = await processEvent(event);
        if (result.success) {
          workerStats.processed++;
        } else if (!result.retrying) {
          workerStats.failed++;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  workerLoop().catch((error) => {
    log('ERROR', 'Worker', 'Worker loop error', error);
    workerRunning = false;
  });

  log('INFO', 'Worker', 'Worker loop started');
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    workerRunning,
    queueSize: queueMetrics.currentSize,
    metrics: queueMetrics,
  });
});

// Logs endpoint
app.get('/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json(logs.slice(-limit));
});

// Create user
app.post('/users', (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    log('WARN', 'API', 'Invalid username provided');
    return res.status(400).json({ error: 'Username is required and must be a non-empty string' });
  }

  const userId = uuidv4();

  db.run(
    `INSERT INTO users (id, username, skycoin_balance) VALUES (?, ?, ?)`,
    [userId, username, 0],
    function (err) {
      if (err) {
        log('ERROR', 'API', 'User creation failed', err);
        return res.status(400).json({ error: err.message });
      }

      log('INFO', 'API', `User created: ${userId}`, { username });
      res.status(201).json({
        userId,
        username,
        skycoin_balance: 0,
      });
    }
  );
});

// Get user
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;

  db.get(
    `SELECT id, username, skycoin_balance, created_at FROM users WHERE id = ?`,
    [userId],
    (err, row) => {
      if (err) {
        log('ERROR', 'API', 'User retrieval failed', err);
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(row);
    }
  );
});

// User earns reward (CORE FLOW)
app.post('/users/:userId/earn', (req, res) => {
  const { userId } = req.params;
  const { rewardAmount } = req.body;

  if (!rewardAmount || typeof rewardAmount !== 'number' || rewardAmount <= 0) {
    log('WARN', 'API', 'Invalid reward amount provided', { rewardAmount });
    return res.status(400).json({ error: 'Reward amount must be a positive number' });
  }

  db.get(`SELECT id FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      log('ERROR', 'API', 'User lookup failed', err);
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const eventId = uuidv4();
    const event = {
      id: eventId,
      type: 'user_earn_reward',
      userId,
      payload: { userId, rewardAmount },
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    db.run(
      `INSERT INTO events (id, type, user_id, payload, status) VALUES (?, ?, ?, ?, ?)`,
      [event.id, event.type, userId, JSON.stringify(event.payload), event.status],
      (err) => {
        if (err) {
          log('ERROR', 'API', 'Event creation failed', err);
          return res.status(500).json({ error: err.message });
        }

        pushEvent(event);
        log('INFO', 'API', `Reward event submitted: ${eventId}`, { userId, rewardAmount });

        res.status(202).json({
          eventId,
          status: 'pending',
          message: 'Reward request submitted for processing',
        });
      }
    );
  });
});

// Get user feed
app.get('/users/:userId/feed', (req, res) => {
  const { userId } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 50, 1000);

  db.all(
    `SELECT id, event_id, event_type, message, created_at FROM feed WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit],
    (err, rows) => {
      if (err) {
        log('ERROR', 'API', 'Feed retrieval failed', err);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows || []);
    }
  );
});

// Get event status
app.get('/events/:eventId', (req, res) => {
  const { eventId } = req.params;

  db.get(
    `SELECT id, type, status, created_at, processed_at, error_message FROM events WHERE id = ?`,
    [eventId],
    (err, row) => {
      if (err) {
        log('ERROR', 'API', 'Event retrieval failed', err);
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(row);
    }
  );
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  log('ERROR', 'Express', 'Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  log('INFO', 'Server', `ShadowChat v1111 Backend listening on port ${PORT}`);
  startWorker();
});

// Graceful shutdown
process.on('SIGINT', () => {
  log('INFO', 'Server', 'Shutting down gracefully...');
  workerRunning = false;
  db.close((err) => {
    if (err) log('ERROR', 'Server', 'Database close error', err);
    log('INFO', 'Server', 'Shutdown complete');
    process.exit(0);
  });
});

module.exports = app;
