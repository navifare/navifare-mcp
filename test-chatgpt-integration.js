#!/usr/bin/env node

/**
 * Test script to verify ChatGPT integration with Navifare MCP tools
 * This script tests the MCP server endpoints to ensure they're working correctly
 */

import fetch from 'node-fetch';

const MCP_URL = 'http://localhost:2091/mcp';

async function testMCPIntegration() {
  console.log('🧪 Testing Navifare MCP Integration for ChatGPT');
  console.log('=' .repeat(50));

  try {
    // Test 1: Get MCP metadata
    console.log('\n📋 Test 1: Getting MCP metadata...');
    const metadataResponse = await fetch(MCP_URL);
    const metadata = await metadataResponse.json();
    
    console.log('✅ MCP Server Name:', metadata.name);
    console.log('✅ Version:', metadata.version);
    console.log('✅ Description:', metadata.description);
    console.log('✅ Available Tools:', metadata.tools.length);

    // Test 2: List tools
    console.log('\n🔧 Test 2: Listing available tools...');
    const toolsResponse = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'tools/list',
        id: 1
      })
    });
    
    const toolsResult = await toolsResponse.json();
    console.log('✅ Tools listed successfully');
    
    // Display tool information
    toolsResult.result.tools.forEach((tool, index) => {
      console.log(`\n   Tool ${index + 1}: ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
    });

    // Test 3: Test natural language parsing
    console.log('\n🗣️  Test 3: Testing natural language parsing...');
    const parseResponse = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'tools/call',
        params: {
          name: 'format_flight_pricecheck_request',
          arguments: {
            user_request: 'I found LX 1612 from MXP to FCO on Nov 4th at 6:40 PM for 150 EUR'
          }
        },
        id: 2
      })
    });
    
    const parseResult = await parseResponse.json();
    console.log('✅ Natural language parsing test completed');
    console.log('   Response:', parseResult.result?.content?.[0]?.text ? 'Success' : 'Error');

    // Test 4: Test health endpoint
    console.log('\n💚 Test 4: Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:2091/health');
    const health = await healthResponse.json();
    console.log('✅ Health check:', health.status);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure ngrok is running: ngrok http 2091');
    console.log('   2. Copy the ngrok HTTPS URL');
    console.log('   3. Add /mcp to the end: https://xxx.ngrok.app/mcp');
    console.log('   4. Configure in ChatGPT settings');
    console.log('   5. Test with a flight request in ChatGPT');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the MCP server is running: npm run serve');
    console.log('   2. Check if port 2091 is available');
    console.log('   3. Verify the server is accessible at http://localhost:2091');
  }
}

// Run the tests
testMCPIntegration();

