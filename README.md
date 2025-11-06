# Navifare MCP Server

This MCP server wraps the Navifare REST API as MCP tools for flight price comparison.

## Tools
- `flight_pricecheck`: Search multiple booking sources to find better prices for a specific flight
- `format_flight_pricecheck_request`: Parse and format flight details from natural language text

## Compliance

This server complies with Anthropic's MCP Directory Policy. See [COMPLIANCE.md](./COMPLIANCE.md) for details.

**Privacy Policy**: https://navifare.com/terms  
**Contact**: contact@navifare.com  
**Privacy Inquiries**: privacy@navifare.com

## Development
- Install: `npm i`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

## Environment
- `GEMINI_API_KEY` (required): Google Gemini API key for natural language parsing
- `NAVIFARE_API_BASE_URL` (optional): Defaults to https://api.navifare.com/api/v1/price-discovery/flights

## Examples

See [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for complete usage examples.

## Documentation

- [COMPLIANCE.md](./COMPLIANCE.md) - Anthropic MCP Directory compliance details
- [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - Complete usage examples
- [OPENAI_INTEGRATION.md](./OPENAI_INTEGRATION.md) - OpenAI Apps SDK integration guide

Reference: https://www.stainless.com/mcp/from-rest-api-to-mcp-server



