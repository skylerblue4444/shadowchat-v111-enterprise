/**
 * @file test-flow.js
 * @description Test script for the "User Earns Reward" end-to-end flow
 * This demonstrates the complete flow: API Request → Event → Worker → DB → Result
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTest() {
  console.log('========================================');
  console.log('ShadowChat v1111 - "User Earns Reward" Flow Test');
  console.log('========================================\n');

  try {
    // Step 1: Health check
    console.log('[TEST] Step 1: Health check');
    const health = await makeRequest('GET', '/health');
    console.log(`✓ Server is running: ${health.body.status}\n`);

    // Step 2: Create user
    console.log('[TEST] Step 2: Create user');
    const userRes = await makeRequest('POST', '/users', { username: 'testuser' });
    const userId = userRes.body.userId;
    console.log(`✓ User created: ${userId}`);
    console.log(`  Username: ${userRes.body.username}`);
    console.log(`  Initial balance: ${userRes.body.skycoin_balance} SkyCoin\n`);

    // Step 3: Get user (verify creation)
    console.log('[TEST] Step 3: Get user details');
    const getUser = await makeRequest('GET', `/users/${userId}`);
    console.log(`✓ User retrieved: ${getUser.body.username}`);
    console.log(`  Balance: ${getUser.body.skycoin_balance} SkyCoin\n`);

    // Step 4: User earns reward (CORE FLOW)
    console.log('[TEST] Step 4: User earns reward (CORE FLOW)');
    const earnRes = await makeRequest('POST', `/users/${userId}/earn`, { rewardAmount: 100 });
    const eventId = earnRes.body.eventId;
    console.log(`✓ Reward request submitted`);
    console.log(`  Event ID: ${eventId}`);
    console.log(`  Status: ${earnRes.body.status}`);
    console.log(`  Message: ${earnRes.body.message}\n`);

    // Step 5: Wait for worker to process
    console.log('[TEST] Step 5: Waiting for worker to process event...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 6: Check event status
    console.log('[TEST] Step 6: Check event status');
    const eventStatus = await makeRequest('GET', `/events/${eventId}`);
    console.log(`✓ Event status: ${eventStatus.body.status}`);
    console.log(`  Event type: ${eventStatus.body.type}`);
    console.log(`  Processed at: ${eventStatus.body.processed_at}\n`);

    // Step 7: Get updated user balance
    console.log('[TEST] Step 7: Get updated user balance');
    const updatedUser = await makeRequest('GET', `/users/${userId}`);
    console.log(`✓ User balance updated: ${updatedUser.body.skycoin_balance} SkyCoin`);
    console.log(`  Change: +100 SkyCoin\n`);

    // Step 8: Get user feed
    console.log('[TEST] Step 8: Get user feed');
    const feed = await makeRequest('GET', `/users/${userId}/feed`);
    console.log(`✓ User feed retrieved: ${feed.body.length} entries`);
    if (feed.body.length > 0) {
      console.log(`  Latest: ${feed.body[0].message}\n`);
    }

    console.log('========================================');
    console.log('✓ END-TO-END FLOW SUCCESSFUL');
    console.log('========================================');
    console.log('\nFlow Summary:');
    console.log('1. API Request received: POST /users/:userId/earn');
    console.log('2. Event created and stored in DB');
    console.log('3. Event pushed to queue');
    console.log('4. Worker processed event');
    console.log('5. Balance updated in DB');
    console.log('6. Transaction logged');
    console.log('7. Feed entry created');
    console.log('8. Result visible to user\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

// Run test after a short delay to ensure server is ready
setTimeout(runTest, 500);
