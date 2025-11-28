#!/usr/bin/env node

/**
 * Direct test of stdio-server.js without MCP Inspector UI
 * This helps debug if the issue is with the backend or the UI
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a small test image (1x1 pixel PNG in base64)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

console.log('🧪 Starting direct test of stdio-server.js...');
console.log('📷 Test image size:', testImageBase64.length, 'characters');

// Spawn the stdio-server.js process
const server = spawn('node', ['stdio-server.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('🚀 stdio-server.js started with PID:', server.pid);

// Handle server output
server.stdout.on('data', (data) => {
  console.log('📤 SERVER STDOUT:', data.toString().trim());
});

server.stderr.on('data', (data) => {
  console.log('📥 SERVER STDERR:', data.toString().trim());
});

// Send initialization request
setTimeout(() => {
  console.log('🔄 Sending initialize request...');
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      clientInfo: {
        name: 'direct-test',
        version: '1.0.0'
      }
    }
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 100);

// Send tools/list request
setTimeout(() => {
  console.log('🔄 Sending tools/list request...');
  const listRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };

  server.stdin.write(JSON.stringify(listRequest) + '\n');
}, 200);

// Send the actual tool call with a small test image
setTimeout(() => {
  console.log('🔄 Sending extract_flight_from_image tool call...');
  const toolRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'extract_flight_from_image',
      arguments: {
        images: [
          {
            data: testImageBase64,
            mimeType: 'image/png'
          }
        ]
      }
    }
  };

  console.log('📋 Tool call payload:', JSON.stringify(toolRequest, null, 2));
  server.stdin.write(JSON.stringify(toolRequest) + '\n');
}, 300);

// Cleanup after 10 seconds
setTimeout(() => {
  console.log('⏰ Test completed, terminating server...');
  server.kill('SIGTERM');
  process.exit(0);
}, 10000);

