/**
 * @file server.js
 * @description Minimal Node.js backend for ShadowChat v1111
 * Implements the core loop: API Request → Event Created → Worker Processes → DB Updated → Result Returned
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// ============================================================================
// DATABASE SETUP
// ============================================================================

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('[DB] Connected to SQLite in-memory database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        skycoin_balance REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        user_id TEXT,
        payload TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        processed_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Transactions table
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
    `);

    // Feed table
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
    `);

    console.log('[DB] Database schema initialized');
  });
}

// ============================================================================
// IN-MEMORY EVENT QUEUE
// ============================================================================

const eventQueue = [];

function pushEvent(event) {
  eventQueue.push(event);
  console.log(`[Queue] Pushed event: ${event.id} (type: ${event.type})`);
}

function pullEvent() {
  return eventQueue.shift() || null;
}

// ============================================================================
// WORKER SYSTEM (AGENT V1)
// ============================================================================

async function processEvent(event) {
  console.log(`[Worker] Processing event: ${event.id} (type: ${event.type})`);

  return new Promise((resolve) => {
    if (event.type === 'user_earn_reward') {
      const { userId, rewardAmount } = event.payload;

      // Update user balance
      db.run(
        `UPDATE users SET skycoin_balance = skycoin_balance + ? WHERE id = ?`,
        [rewardAmount, userId],
        function (err) {
          if (err) {
            console.error(`[Worker] Error updating balance:`, err);
            resolve({ success: false, error: err.message });
            return;
          }

          // Log transaction
          const txnId = uuidv4();
          db.run(
            `INSERT INTO transactions (id, user_id, type, amount, reason) VALUES (?, ?, ?, ?, ?)`,
            [txnId, userId, 'credit', rewardAmount, 'User earned reward'],
            (err) => {
              if (err) {
                console.error(`[Worker] Error logging transaction:`, err);
                resolve({ success: false, error: err.message });
                return;
              }

              // Add to feed
              const feedId = uuidv4();
              db.run(
                `INSERT INTO feed (id, user_id, event_id, event_type, message) VALUES (?, ?, ?, ?, ?)`,
                [feedId, userId, event.id, event.type, `You earned ${rewardAmount} SkyCoin!`],
                (err) => {
                  if (err) {
                    console.error(`[Worker] Error adding to feed:`, err);
                    resolve({ success: false, error: err.message });
                    return;
                  }

                  // Mark event as completed
                  db.run(
                    `UPDATE events SET status = 'completed', processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    [event.id],
                    (err) => {
                      if (err) {
                        console.error(`[Worker] Error marking event as completed:`, err);
                        resolve({ success: false, error: err.message });
                        return;
                      }

                      console.log(`[Worker] Event processed successfully: ${event.id}`);
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
    } else {
      resolve({ success: false, error: `Unknown event type: ${event.type}` });
    }
  });
}

// ============================================================================
// WORKER LOOP
// ============================================================================

let workerRunning = false;

function startWorker() {
  if (workerRunning) return;
  workerRunning = true;

  const workerLoop = async () => {
    while (workerRunning) {
      const event = pullEvent();

      if (event) {
        const result = await processEvent(event);
        if (!result.success) {
          console.error(`[Worker] Event processing failed:`, result.error);
        }
      } else {
        // No events, wait before checking again
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };

  workerLoop().catch((error) => {
    console.error('[Worker] Worker loop error:', error);
    workerRunning = false;
  });

  console.log('[Worker] Worker loop started');
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create user
app.post('/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const userId = uuidv4();

  db.run(
    `INSERT INTO users (id, username, skycoin_balance) VALUES (?, ?, ?)`,
    [userId, username, 0],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

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

  if (!rewardAmount || rewardAmount <= 0) {
    return res.status(400).json({ error: 'Reward amount must be positive' });
  }

  // Check if user exists
  db.get(`SELECT id FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create event
    const eventId = uuidv4();
    const event = {
      id: eventId,
      type: 'user_earn_reward',
      userId,
      payload: { userId, rewardAmount },
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    // Store event in DB
    db.run(
      `INSERT INTO events (id, type, user_id, payload, status) VALUES (?, ?, ?, ?, ?)`,
      [event.id, event.type, userId, JSON.stringify(event.payload), event.status],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Push to queue for worker processing
        pushEvent(event);

        // Return immediately (async processing)
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
  const limit = req.query.limit || 50;

  db.all(
    `SELECT id, event_id, event_type, message, created_at FROM feed WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit],
    (err, rows) => {
      if (err) {
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
    `SELECT id, type, status, created_at, processed_at FROM events WHERE id = ?`,
    [eventId],
    (err, row) => {
      if (err) {
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
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`[Server] ShadowChat v1111 Backend listening on port ${PORT}`);
  startWorker();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[Server] Shutting down...');
  workerRunning = false;
  db.close();
  process.exit(0);
});
