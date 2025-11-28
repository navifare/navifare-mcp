# Test Files

This directory contains all test files for the Navifare MCP server.

## Test Files

### MCP Protocol Tests
- `test-mcp.js` - Main MCP protocol test
- `test-mcp-quick.js` - Quick MCP test
- `test-mcp-simple.js` - Simple MCP test
- `test-stdio.js` - STDIO server test
- `test-stdio-debug.js` - STDIO server debug test
- `test-streamable-http.js` - Streamable HTTP test
- `test-streaming-quick.js` - Quick streaming test

### Image Extraction Tests
- `test-image-extraction.js` - Image extraction functionality test
- `test-base64-image.js` - Base64 image encoding test
- `test-real-image.js` - Real image processing test

### Direct API Tests
- `test-direct.js` - Direct API call test
- `test-simple.js` - Simple functionality test
- `simple-test.js` - Basic test

### Test Data (JSON)
- `test-extract-image.json` - Sample image extraction input
- `test-submit-session.json` - Sample session submission input
- `test-get-results.json` - Sample results retrieval input

### HTML Tests
- `image-to-base64-test.html` - Browser-based image to base64 conversion test

## Running Tests

### MCP Inspector Tests
```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

### Individual Test Files
```bash
# Run a specific test
node test/test-mcp.js

# Run quick test
node test/test-mcp-quick.js
```

### HTTP Server Tests
```bash
# Start the server first
npm run serve

# Then run HTTP tests
node test/test-streamable-http.js
```

## Test Data

Test JSON files contain sample inputs for testing the MCP tools. Use these with the MCP Inspector or in your test scripts.

## Notes

- Most tests require the server to be running
- Some tests require API keys in `.env` file
- HTTP tests require the server to be accessible (localhost or deployed)

