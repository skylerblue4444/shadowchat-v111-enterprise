# ShadowChat v1111 - Minimal Working Backend

## Overview

This is the **Minimal Working System (MWS)** for ShadowChat v1111, built with a focus on execution-first engineering. The backend implements the core loop: **API Request → Event Created → Worker Processes → DB Updated → Result Returned**.

## Core Components

- **API Server**: Express.js server handling HTTP requests
- **Event Queue**: In-memory queue for event processing
- **Worker System**: Single-process agent executor for events
- **Database**: SQLite for persistence
- **Economy**: Simple SkyCoin balance management
- **Feed**: User activity feed

## Quick Start

### Prerequisites

- Node.js 14+
- npm

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3001`.

### Testing the Flow

In a new terminal, run the test script:

```bash
node test-flow.js
```

This will execute the complete "User Earns Reward" flow end-to-end.

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Create User

```
POST /users
Content-Type: application/json

{
  "username": "testuser"
}
```

Creates a new user and returns their ID.

### Get User

```
GET /users/:userId
```

Retrieves user details including balance.

### User Earns Reward (CORE FLOW)

```
POST /users/:userId/earn
Content-Type: application/json

{
  "rewardAmount": 100
}
```

Submits a reward event for processing. Returns immediately with event ID.

### Get User Feed

```
GET /users/:userId/feed?limit=50
```

Retrieves user's activity feed.

### Get Event Status

```
GET /events/:eventId
```

Checks the status of a specific event.

## System Architecture

### Event Flow

1. **Request**: User submits `/users/:userId/earn` request
2. **Event Creation**: Event is created and stored in database
3. **Queue**: Event is pushed to in-memory queue
4. **Worker**: Worker pulls event and processes it
5. **Update**: User balance is updated, transaction logged, feed entry created
6. **Completion**: Event marked as completed
7. **Response**: User can check event status and see updated balance/feed

### Database Schema

- **users**: User accounts with SkyCoin balances
- **events**: All system events with status tracking
- **transactions**: Economic transaction log
- **feed**: User activity feed entries

## Failure Handling

- **Duplicate Events**: Idempotent operations prevent double-crediting
- **Worker Crashes**: Events remain in queue for retry
- **Invalid Operations**: Pre-condition checks prevent invalid state changes
- **Database Errors**: Proper error handling and logging

## Observability

- **Logs**: Structured logging for all operations
- **Metrics**: Event queue size, processing latency, success/failure rates
- **Status Tracking**: Event status transitions (pending → completed/failed)

## Next Steps

1. **Scale Queue**: Replace in-memory queue with Redis
2. **Add More Events**: Implement additional event types (transfer, stake, etc.)
3. **Expand Economy**: Add more complex economy rules
4. **Deploy**: Move to production environment
5. **Monitor**: Integrate with observability stack

## Development

### Project Structure

```
shadowchat-v111-backend/
├── server.js          # Main server with core loop
├── test-flow.js       # End-to-end test script
├── package.json       # Dependencies
└── README.md          # This file
```

### Key Files

- **server.js**: Contains all core logic (API, Event Queue, Worker, DB)
- **test-flow.js**: Demonstrates the complete "User Earns Reward" flow

## License

ISC
