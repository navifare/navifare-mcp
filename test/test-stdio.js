#!/usr/bin/env node

import { spawn } from 'child_process';

const serverProcess = spawn('node', ['stdio-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

serverProcess.stdout.on('data', (data) => {
  console.log('[STDOUT]', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('[STDERR]', data.toString());
});

serverProcess.on('error', (error) => {
  console.error('[ERROR]', error);
});

// Send initialize request
const initRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

console.log('Sending initialize request...');
serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');

setTimeout(() => {
  // Send list tools request
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list'
  };
  
  console.log('Sending tools/list request...');
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  setTimeout(() => {
    // Send a test tool call
    const toolCallRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'extract_flight_from_image',
        arguments: {
          images: [{
            data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            mimeType: 'image/png'
          }]
        }
      }
    };
    
    console.log('Sending tool call request...');
    serverProcess.stdin.write(JSON.stringify(toolCallRequest) + '\n');
    
    setTimeout(() => {
      console.log('Closing...');
      serverProcess.kill();
      process.exit(0);
    }, 10000);
  }, 2000);
}, 2000);

