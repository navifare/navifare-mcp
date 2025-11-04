#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

// Simple script to convert images to base64 for MCP testing
function convertImageToBase64(imagePath) {
  try {
    // Read the image file
    const imageBuffer = readFileSync(imagePath);
    
    // Convert to base64
    const base64 = imageBuffer.toString('base64');
    
    // Determine MIME type from file extension
    const ext = extname(imagePath).toLowerCase();
    let mimeType;
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.webp':
        mimeType = 'image/webp';
        break;
      default:
        mimeType = 'image/jpeg'; // Default
    }
    
    return { base64, mimeType };
  } catch (error) {
    console.error('Error converting image:', error.message);
    return null;
  }
}

function generateMCPTestData(imagePath) {
  const result = convertImageToBase64(imagePath);
  if (!result) return null;
  
  const mcpTestData = {
    method: "tools/call",
    params: {
      name: "extract_flight_from_image",
      arguments: {
        images: [{
          data: result.base64,
          mimeType: result.mimeType
        }]
      }
    }
  };
  
  return mcpTestData;
}

// Main execution
if (process.argv.length < 3) {
  console.log(`
Usage: node convert-image.js <image-path> [output-format]

Examples:
  node convert-image.js screenshot.jpg
  node convert-image.js screenshot.jpg mcp
  node convert-image.js screenshot.jpg base64

Output formats:
  base64  - Just the base64 string (default)
  mcp     - Complete MCP test data JSON
  both    - Both base64 and MCP data
`);
  process.exit(1);
}

const imagePath = process.argv[2];
const outputFormat = process.argv[3] || 'base64';

if (!existsSync(imagePath)) {
  console.error(`Error: Image file not found: ${imagePath}`);
  process.exit(1);
}

const result = convertImageToBase64(imagePath);
if (!result) {
  process.exit(1);
}

switch (outputFormat) {
  case 'mcp':
    const mcpData = generateMCPTestData(imagePath);
    console.log(JSON.stringify(mcpData, null, 2));
    break;
    
  case 'both':
    console.log('=== Base64 ===');
    console.log(result.base64);
    console.log('\n=== MCP Test Data ===');
    const mcpData2 = generateMCPTestData(imagePath);
    console.log(JSON.stringify(mcpData2, null, 2));
    break;
    
  case 'base64':
  default:
    console.log(result.base64);
    break;
}
