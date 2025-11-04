# ChatGPT Integration Guide for Navifare MCP Tools

## Overview

This guide helps you optimize your MCP server for ChatGPT integration by improving tool descriptions, adding better examples, and providing clear usage patterns.

## What We've Improved

### 1. Enhanced Tool Descriptions

**Before**: Generic descriptions that didn't clearly explain when to use each tool
**After**: Clear, actionable descriptions with specific use cases and examples

### 2. Better Examples

**Before**: Minimal examples in tool schemas
**After**: Comprehensive examples showing different ways users might input flight information

### 3. Clear Usage Patterns

**Before**: No guidance on when to use which tool
**After**: Clear patterns for different user scenarios

## Key Improvements Made

### 1. Tool Descriptions

#### `format_flight_pricecheck_request`
- **Clear use case**: When user mentions a flight conversationally
- **Examples**: "I found LX 1612 from MXP to FCO for 150 EUR"
- **Automatic processing**: Parses input and automatically searches for better prices

#### `extract_flight_from_image`
- **Clear use case**: When user uploads flight booking screenshots
- **AI vision**: Analyzes images to extract flight details
- **Automatic processing**: Extracts details and automatically searches for better prices

#### `flight_pricecheck`
- **Clear use case**: When you have complete, structured flight data
- **Direct comparison**: Searches multiple booking sources for better prices

### 2. Enhanced Metadata

Added better metadata to help ChatGPT understand:
- When to use each tool
- What the expected input format is
- What the output will be
- How to handle different scenarios

### 3. Comprehensive Documentation

Created multiple documentation files:
- `CHATGPT_USAGE_GUIDE.md`: Detailed usage patterns and examples
- `CHATGPT_SYSTEM_PROMPT.md`: System prompt for ChatGPT
- `CHATGPT_INTEGRATION_README.md`: This overview document

## How to Use These Improvements

### 1. For ChatGPT Users

When configuring your MCP server in ChatGPT, the enhanced descriptions will help ChatGPT:
- Understand when to use each tool
- Provide better responses to users
- Handle different input formats more effectively

### 2. For Developers

The documentation provides:
- Clear examples of how each tool should be used
- Error handling patterns
- Best practices for integration

### 3. For Testing

Use the test script to verify everything is working:
```bash
node test-chatgpt-integration.js
```

## Best Practices for ChatGPT Integration

### 1. Clear Tool Descriptions

Make sure each tool description:
- Explains when to use it
- Provides clear examples
- Specifies the expected input format
- Describes the output

### 2. Handle Different Input Formats

Users might provide flight information in various ways:
- Natural language: "I found a flight from Paris to Tokyo for 800 euros"
- Structured data: Complete flight details with all fields
- Images: Screenshots of flight bookings

### 3. Provide Context

Help ChatGPT understand:
- What each tool does
- When to use each tool
- How to handle missing information
- What to do if something goes wrong

### 4. Use Examples

Provide concrete examples:
- Different ways users might input flight information
- Expected responses from each tool
- Error handling scenarios

## Testing Your Integration

### 1. Test the MCP Server

```bash
# Start the server
npm run serve

# Test the endpoints
curl http://localhost:2091/health
curl http://localhost:2091/mcp
```

### 2. Test with ngrok

```bash
# Start ngrok tunnel
ngrok http 2091

# Test the public URL
curl https://your-ngrok-url.ngrok.app/health
```

### 3. Test ChatGPT Integration

1. Configure the MCP server URL in ChatGPT
2. Try different types of flight requests
3. Test image uploads
4. Verify error handling

## Common Issues and Solutions

### 1. ChatGPT Doesn't Understand When to Use Tools

**Solution**: Improve tool descriptions with clear use cases and examples

### 2. Users Provide Incomplete Information

**Solution**: Use the natural language parsing tool to ask for missing details

### 3. Image Analysis Fails

**Solution**: Provide clear error messages and suggest manual input

### 4. Price Comparison Fails

**Solution**: Explain the issue and suggest trying again

## Monitoring and Debugging

### 1. Check ngrok Web Interface

Visit http://localhost:4040 to see all requests and responses

### 2. Monitor Server Logs

Check the console output for any errors or issues

### 3. Test Individual Endpoints

Use the test script to verify each tool is working correctly

## Next Steps

1. **Deploy to Production**: Consider using a proper hosting service instead of ngrok for production
2. **Add Authentication**: Implement API keys or other authentication methods
3. **Monitor Usage**: Track how users are interacting with your tools
4. **Gather Feedback**: Collect user feedback to improve the integration

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [OpenAI Apps SDK](https://platform.openai.com/docs/guides/app-sdk)
- [ngrok Documentation](https://ngrok.com/docs)

## Support

If you need help with the integration:
1. Check the logs for error messages
2. Verify the MCP server is running correctly
3. Test individual endpoints
4. Review the documentation for troubleshooting tips

The enhanced tool descriptions and documentation should significantly improve ChatGPT's understanding of how to use your flight comparison tools effectively.

