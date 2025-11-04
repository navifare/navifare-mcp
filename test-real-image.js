#!/usr/bin/env node

/**
 * Test script with the real image provided by user
 */

import { spawn } from 'child_process';

console.log('🧪 Testing with real image data...');

const realImageBase64 = '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2/lpl2RXV01szelaj9ra3Ya7V9ahdYq6nj2pey7tDdzbVO9Qv20fc1/ZfrBfsf/ZgbQD1w6GH2w9xD5U/6Plj5sOMw6XNiANcxr6GrMau5qSmzqOhB1pbfZuPvyT40+7Wkxbqo7qHl15jHqs+NjA8cLj/SekJ3pPZp582Dq99fapyaeunI453X4m/My5n4N/PnWWc/b4OZ9zLee9zh/5hf1L4wX3Cw1tbm2Hf3X79XC7e3vDRY+LTZc8LzV3TOw41unXefJy4OWfr/CuXLgaebXjWsK1G9dTr3fdEN54ejP35stbBbc+3F50h3Cn9K7m3fJ7hveqf7P9bV+Xe9fR+4H32x7EPbj9UPDw+SP5o4/dxY9pj8ufmDypfer8tKUnuOfSsynPup9Ln3/oLfld6/dNL2xe/PiH/x9tfZP7ul/KXg78ufyV/qtdf7n+1dof3X/vdd7rD29K3+q/rXnHfnf2fdL7Jx9mfSR9rPhk+6n5c/jnOwN5AwNSvow/+CuAAeXWJgOAP3cBQEsGgAH3jdQpqv3hoCGqPe0gAv8Jq/aQg+YOQD38p4/phX831wHYvwMAK6hPTwUgmgZAvCdAXVxG2vBebnDfqTQi3Bt8H/cpPS8d/BtT7Um/inv0GShVXcHo878AeMODBajKaxEAAACKZVhJZk1NACoAAAAIAAQBGgAFAAAAAQAAAD4BGwAFAAAAAQAAAEYBKAADAAAAAQACAACHaQAEAAAAAQAAAE4AAAAAAAAAkAAAAAEAAACQAAAAAQADkoYABwAAABIAAAB4oAIABAAAAAEAAAZMoAMABAAAAAEAAAP8AAAAAEFTQ0lJAAAAU2NyZWVuc2hvdOfbIJ0AAAAJcEhZcwAAFiUAABYlAUlSJPAAAAHYaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjEwMjA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTYxMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo=';

console.log('📷 Image size:', realImageBase64.length, 'characters');

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

// Send initialize
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

// Send tool call with real image
setTimeout(() => {
  console.log('📝 Sending tool call with real image...');
  const toolCall = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'extract_flight_from_image',
      arguments: {
        images: [{
          data: realImageBase64,
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
}, 10000);
