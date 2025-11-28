# Navifare MCP Server

This MCP server wraps the Navifare REST API as MCP tools for flight price comparison.

## Tools
- `flight_pricecheck`: Search multiple booking sources to find better prices for a specific flight
- `format_flight_pricecheck_request`: Parse and format flight details from natural language text

## Compliance

This server complies with Anthropic's MCP Directory Policy. See [COMPLIANCE.md](./COMPLIANCE.md) for details.

**Privacy Policy and Terms of Service**: https://navifare.com/terms  
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

See [docs/USAGE_EXAMPLES.md](./docs/USAGE_EXAMPLES.md) for complete usage examples.

## Documentation

All documentation is in the [`docs/`](./docs/) directory:

- [COMPLIANCE.md](./docs/COMPLIANCE.md) - Anthropic MCP Directory compliance details
- [USAGE_EXAMPLES.md](./docs/USAGE_EXAMPLES.md) - Complete usage examples
- [QUICKSTART.md](./docs/QUICKSTART.md) - Quick start guide
- [LOCAL_DEPLOYMENT.md](./docs/LOCAL_DEPLOYMENT.md) - Local deployment guide
- [RENDER_DEPLOYMENT_GUIDE.md](./docs/RENDER_DEPLOYMENT_GUIDE.md) - Production deployment guide
- [CLAUDE_SUBMISSION_CHECKLIST.md](./docs/CLAUDE_SUBMISSION_CHECKLIST.md) - Claude submission checklist

## Testing

Test files are located in the [`test/`](./test/) directory. See individual test files for usage examples.

## Scripts

Helper scripts are in the [`scripts/`](./scripts/) directory:
- `start-local.sh` - Start local development server
- `deploy-to-render.sh` - Prepare for Render deployment

Reference: https://www.stainless.com/mcp/from-rest-api-to-mcp-server



