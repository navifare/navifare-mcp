#!/usr/bin/env node

/**
 * Test extract_flight_from_image tool with a base64 image string
 * Usage: node test-base64-image.js <base64_string>
 * Or set BASE64_IMAGE environment variable
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base64 string from command line argument or environment variable
const base64Image = process.argv[2] || process.env.BASE64_IMAGE;

if (!base64Image) {
  console.error('❌ Please provide a base64 image string:');
  console.error('   node test-base64-image.js <base64_string>');
  console.error('   or');
  console.error('   BASE64_IMAGE=<base64_string> node test-base64-image.js');
  process.exit(1);
}

console.log('🧪 Testing extract_flight_from_image tool...');
console.log('📷 Image size:', base64Image.length, 'characters');
console.log('📷 Image preview:', base64Image.substring(0, 50) + '...');

// Spawn the stdio-server.js process
const server = spawn('node', ['stdio-server.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('🚀 stdio-server.js started with PID:', server.pid);

let requestId = 1;

// Handle server output
server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    try {
      const parsed = JSON.parse(output);
      console.log('📤 SERVER RESPONSE:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('📤 SERVER STDOUT:', output);
    }
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  // Print immediately without trimming to see all output
  process.stderr.write('📥 SERVER LOGS: ' + output);
});

// Send initialization request
setTimeout(() => {
  console.log('🔄 Sending initialize request...');
  const initRequest = {
    jsonrpc: '2.0',
    id: requestId++,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      clientInfo: {
        name: 'base64-test',
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
    id: requestId++,
    method: 'tools/list',
    params: {}
  };

  server.stdin.write(JSON.stringify(listRequest) + '\n');
}, 500);

// Send the actual tool call with the provided base64 image
setTimeout(() => {
  console.log('🔄 Sending extract_flight_from_image tool call...');
  const startTime = Date.now();
  
  const toolRequest = {
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'extract_flight_from_image',
      arguments: {
        images: [
          {
            data: base64Image,
            mimeType: 'image/png'
          }
        ]
      }
    }
  };

  console.log('📋 Tool call payload size:', JSON.stringify(toolRequest).length, 'characters');
  server.stdin.write(JSON.stringify(toolRequest) + '\n');
  
  // Track how long it takes
  setTimeout(() => {
    const elapsed = Date.now() - startTime;
    console.log(`⏰ Elapsed time: ${elapsed}ms`);
  }, 100);
}, 1000);

// Cleanup after 60 seconds (give enough time for processing)
setTimeout(() => {
  console.log('⏰ Test timeout reached, terminating server...');
  server.kill('SIGTERM');
  process.exit(0);
}, 60000);

// Handle server exit
server.on('exit', (code) => {
  console.log(`🏁 Server exited with code ${code}`);
  process.exit(code || 0);
});

