#!/usr/bin/env node

import { readFileSync } from 'fs';
import { extname } from 'path';

// Test the image extraction functionality
async function testImageExtraction() {
  try {
    // Read the logo image and convert to base64
    const imagePath = '../../src/assets/logo_squared.png';
    const imageBuffer = readFileSync(imagePath);
    const base64Data = imageBuffer.toString('base64');
    const mimeType = 'image/png';
    
    // Create the MCP request payload
    const mcpPayload = {
      method: "tools/call",
      params: {
        name: "extract_flight_from_image",
        arguments: {
          images: [
            {
              data: base64Data,
              mimeType: mimeType
            }
          ]
        }
      }
    };
    
    console.log('🧪 Testing image extraction with MCP server...');
    console.log('📤 Sending request to MCP server...');
    
    // Send request to the HTTP server
    const response = await fetch('http://localhost:2091/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mcpPayload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Response received:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing image extraction:', error.message);
  }
}

// Run the test
testImageExtraction();
