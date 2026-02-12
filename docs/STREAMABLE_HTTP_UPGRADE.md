# Streamable HTTP Upgrade Guide - MCP Compliant

## Current State

✅ **Implementation Complete**: `http-server.js` now fully supports MCP-compliant SSE streaming per specification 2025-06-18.

## What Streamable HTTP Requires (MCP Spec)

Streamable HTTP is an MCP transport that supports:
1. **JSON responses** for quick operations ✅
2. **SSE streams** (`text/event-stream`) for long-running tasks with progress updates ✅
3. **Session management** via `Mcp-Session-Id` header ✅
4. **Default message events** (no custom event types) ✅
5. **Standard notifications** (`notifications/progress`) ✅
6. **Structured content** (both text and structuredContent fields) ✅

## Implementation Pattern

### 1. Detect Streaming Requests

```javascript
app.post('/mcp', async (req, res) => {
  const wantsStreaming = req.headers['accept']?.includes('text/event-stream') ||
                         req.query.stream === 'true' ||
                         req.headers['mcp-stream'] === 'true';

  if (wantsStreaming && method === 'tools/call' && name === 'flight_pricecheck') {
    // Use SSE streaming
  } else {
    // Use standard JSON response
  }
});
```

### 2. Implement MCP-Compliant SSE Streaming

For `flight_pricecheck`, stream progress updates using standard MCP methods:

```javascript
if (wantsStreaming) {
  // Set MCP-compliant SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Mcp-Session-Id', sessionId);
  res.setHeader('MCP-Protocol-Version', '2025-06-18');

  // Extract progressToken from request _meta (if provided)
  const progressToken = params._meta?.progressToken;

  // Stream progress updates using standard MCP notifications/progress
  let progressCount = 0;
  const onProgress = (progressResults) => {
    const resultCount = progressResults.totalResults || progressResults.results?.length || 0;
    const status = progressResults.status || 'IN_PROGRESS';

    // Only send progress notifications if client provided progressToken
    if (progressToken) {
      progressCount = resultCount;
      const progressNotification = {
        jsonrpc: '2.0',
        method: 'notifications/progress',  // Standard MCP method
        params: {
          progressToken: progressToken,
          progress: resultCount,
          total: 100,  // Estimated total
          message: `Found ${resultCount} booking sources (status: ${status})`
        }
      };

      // MCP spec: send as default message event (no event: field)
      res.write(`data: ${JSON.stringify(progressNotification)}\n\n`);
    }
  };

  try {
    const searchResult = await submit_and_poll_session(sanitizedRequest, onProgress);

    // Format final result
    const finalResult = {
      message: formattedMessage.trim(),
      searchResult: searchResult,
      status: searchResult.status || 'COMPLETED'
    };

    // Send final JSON-RPC response with both text and structuredContent
    const response = {
      jsonrpc: '2.0',
      id: req.body.id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(finalResult, null, 2)  // For backwards compatibility
          }
        ],
        structuredContent: finalResult  // For modern clients
      }
    };

    // MCP spec: send final response as default message event, then close stream
    res.write(`data: ${JSON.stringify(response)}\n\n`);
    res.end();
  } catch (error) {
    // Send error response (also as default message event)
    const errorResponse = {
      jsonrpc: '2.0',
      id: req.body.id,
      error: {
        code: -32603,
        message: error.message
      }
    };
    res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
    res.end();
  }
} else {
  // Standard JSON response (current implementation)
  res.json(response);
}
```

### 3. Add Session Management

Support `Mcp-Session-Id` header for session tracking:

```javascript
const sessionId = req.headers['mcp-session-id'] || 
                  `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Use sessionId for tracking if needed
res.setHeader('Mcp-Session-Id', sessionId);
```

### 4. Update server.json

If deploying as remote HTTP server, update transport type:

```json
{
  "transport": {
    "type": "http",
    "endpoint": "https://your-server.com/mcp",
    "streamable": true
  }
}
```

## Benefits

- ✅ **Better UX**: Clients receive real-time progress updates
- ✅ **Compliance**: Meets Anthropic's Streamable HTTP requirement
- ✅ **Scalability**: Stateless operation reduces server load
- ✅ **Flexibility**: Supports both quick and long-running operations

## Implementation Priority

**For stdio transport (current)**: No changes needed - stdio already supports streaming ✅

**For remote HTTP**: 
- If you want Claude web support, implement SSE streaming
- If only using stdio, you can skip this upgrade

## Testing

Test streaming with:
```bash
curl -N -H "Accept: text/event-stream" \
     -H "Content-Type: application/json" \
     -X POST https://your-server.com/mcp \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"flight_pricecheck","arguments":{...}}}'
```

The `-N` flag keeps the connection open to receive SSE events.




