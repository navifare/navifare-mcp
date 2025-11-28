#!/usr/bin/env node

/**
 * Simple test to see if stdio-server.js is even receiving input
 */

import { spawn } from 'child_process';

console.log('🧪 Starting simple stdio test...');

// Spawn the stdio-server.js process
const server = spawn('node', ['stdio-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('🚀 stdio-server.js started with PID:', server.pid);

// Handle server output
server.stdout.on('data', (data) => {
  console.log('📤 STDOUT:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('📥 STDERR:', data.toString());
});

server.on('error', (error) => {
  console.log('❌ Server error:', error);
});

// Send some test data
setTimeout(() => {
  console.log('📝 Sending test data...');
  server.stdin.write('{"test": "hello"}\n');
}, 100);

setTimeout(() => {
  console.log('📝 Sending JSON-RPC initialize...');
  const init = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo: { name: 'test', version: '1.0.0' }
    }
  });
  server.stdin.write(init + '\n');
}, 200);

// Cleanup
setTimeout(() => {
  console.log('⏰ Terminating...');
  server.kill();
  process.exit(0);
}, 2000);

