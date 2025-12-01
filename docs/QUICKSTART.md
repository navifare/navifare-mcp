# 🚀 Quick Start Guide – Navifare MCP Server

This guide shows how to run the Navifare MCP server locally and connect it to any MCP‑compatible client (Claude, Claude Desktop, Claude Code, MCP Inspector, etc.).  
It is **not** specific to any one provider and does **not** require ngrok.

For a full overview of the server and tools, see the main README in the npm package or repo: [`navifare-mcp`](https://www.npmjs.com/package/navifare-mcp) and [`README.md`](./../README.md).

---

## 1. Prerequisites

```bash
# Node.js 18+ is required
node --version

# npm
npm --version
```

You will also need:

- A **Navifare API key** for flight price discovery
- A **Gemini API key** (for image/natural language parsing, if you use the image-based flows)

---

## 2. Install & Build the MCP Server

From the root of the MCP server repo (or after installing the npm package and cd’ing into it):

```bash
cd /Users/simonenavifare/navifare/frontend/front-end/mcp/navifare-mcp

# Install dependencies
npm install

# Build TypeScript → JavaScript
npm run build
```

If you are using the npm package in another project:

```bash
npm install navifare-mcp
```

Then use the `dist/index.js` entrypoint as your MCP server binary.

---

## 3. Configure Environment Variables

Create a `.env` file (or set environment variables in your hosting platform):

```bash
cd /Users/simonenavifare/navifare/frontend/front-end/mcp/navifare-mcp

cat > .env << 'EOF'
NAVIFARE_API_KEY=your_navifare_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=10000
NODE_ENV=development
EOF
```

Key variables:

- `NAVIFARE_API_KEY` (**required**): Navifare API key
- `GEMINI_API_KEY` (**required** for image/natural language flows)
- `PORT` (optional): HTTP server port (defaults to 10000 in production examples)
- `NODE_ENV` (optional): `development` or `production`

---

## 4. Start the MCP Server

You can run the server in two main modes:

### Option A – STDIO MCP Server (for local MCP clients)

This is the standard way for MCP‑compatible clients that launch a local process (e.g., Claude Desktop, Claude Code, MCP Inspector):

```bash
# After build
npx @modelcontextprotocol/inspector node dist/index.js
```

Or directly:

```bash
node dist/index.js
```

Use this command as the MCP server executable in your MCP client configuration.

### Option B – HTTP MCP Server (for remote use)

To expose the MCP server over HTTP (e.g., for hosted MCP clients), run:

```bash
# Ensure build is done
npm run build

# Start HTTP server
npm run serve
```

This will start the HTTP server (by default on the port configured via `PORT`, e.g., 10000).

Key endpoints:

- `GET /health` – Health check
- `GET /mcp` – MCP metadata (name, version, tools)
- `POST /mcp` – MCP JSON‑RPC endpoint (`tools/list`, `tools/call`, etc.)

In production (e.g., Render, Fly.io), the MCP endpoint will look like:

```text
https://your-service-name.onrender.com/mcp
```

See [`RENDER_DEPLOYMENT_GUIDE.md`](./RENDER_DEPLOYMENT_GUIDE.md) for deployment details.

---

## 5. Connect from an MCP Client

Below are generic patterns for connecting this server to MCP‑compatible clients. Always refer to your client’s documentation for the exact configuration format.

### Claude Desktop / Claude Code

Claude Desktop and Claude Code can run local MCP servers via STDIO.  
Use a configuration entry roughly like:

```jsonc
{
  "mcpServers": {
    "navifare-mcp": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "NAVIFARE_API_KEY": "your_navifare_api_key_here",
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

(The exact config file path and shape depends on the Claude client version you’re using.)

Once configured, Claude will list the `navifare-mcp` tools (`flight_pricecheck`, `format_flight_pricecheck_request`) and can call them as needed.

### MCP Inspector (local testing)

You can inspect and test the server using the MCP Inspector:

```bash
cd /Users/simonenavifare/navifare/frontend/front-end/mcp/navifare-mcp

npx @modelcontextprotocol/inspector node dist/index.js
```

This provides a UI to:

- List tools (`tools/list`)
- Inspect schemas
- Call tools (`tools/call`) with custom arguments

### Generic HTTP MCP Clients

If you are running the HTTP server (via `npm run serve` or a deployed service), configure your MCP client with:

- **Endpoint**: `https://your-service-name.onrender.com/mcp`
- **Protocol**: JSON‑RPC 2.0 over HTTP

Example `tools/list` request:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

Example `tools/call` request is shown in the main [`README.md`](./../README.md).

---

## 6. Troubleshooting

**Server won’t start?**

```bash
# Check if port is in use (for HTTP mode)
lsof -i :10000
kill -9 <PID>
```

**Tools not visible in your MCP client?**

- Verify the server process is running (STDIO or HTTP).
- Call `tools/list` manually (via MCP Inspector or HTTP) to confirm the server responds.
- Check that your MCP client config points to the correct command/URL.

**Authentication errors?**

- Ensure `NAVIFARE_API_KEY` and `GEMINI_API_KEY` are set correctly in your environment.
- Restart the server after changing `.env`.

For more details, see:

- [`docs/LOCAL_DEPLOYMENT.md`](./LOCAL_DEPLOYMENT.md)
- [`docs/RENDER_DEPLOYMENT_GUIDE.md`](./RENDER_DEPLOYMENT_GUIDE.md)
- [`docs/USAGE_EXAMPLES.md`](./USAGE_EXAMPLES.md)

---

You now have the Navifare MCP server running and connected to MCP clients.  
From here, you can:

- Use `format_flight_pricecheck_request` to parse user flight descriptions.
- Use `flight_pricecheck` to search for better prices for specific flights.


