#!/usr/bin/env node

/**
 * Direct stdio test to see if debug logs appear
 */

import { spawn } from 'child_process';

console.log('🧪 Starting direct stdio test...');

const server = spawn('node', ['stdio-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

server.stdout.on('data', (data) => {
  console.log('📤 STDOUT:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('📥 STDERR:', data.toString());
});

server.on('error', (error) => {
  console.log('❌ Server error:', error);
});

// Send initialize request
setTimeout(() => {
  console.log('📝 Sending initialize...');
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-client', version: '1.0.0' }
    }
  };
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 1000);

// Send tool call
setTimeout(() => {
  console.log('📝 Sending tool call...');
  const toolCall = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'extract_flight_from_image',
      arguments: {
        images: [{
          data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          mimeType: 'image/png'
        }]
      }
    }
  };
  server.stdin.write(JSON.stringify(toolCall) + '\n');
}, 2000);

setTimeout(() => {
  console.log('📝 Closing stdin...');
  server.stdin.end();
}, 3000);
