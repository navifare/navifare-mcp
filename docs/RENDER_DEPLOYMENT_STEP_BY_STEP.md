# 🚀 Step-by-Step Render Deployment Guide

This guide will walk you through deploying your Navifare MCP server to Render.com so that any MCP client (like ChatGPT, Claude, or other AI assistants) can access it.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] ✅ A Render.com account (sign up at [render.com](https://render.com) - free tier available)
- [ ] ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- [ ] ✅ Your API key ready:
  - `GEMINI_API_KEY` - Your Google Gemini API key for image extraction
- [ ] ✅ Node.js 18+ installed locally (for testing)

**Note:** The Navifare API does not require an API key. It uses a public endpoint.

---

## 🎯 Step 1: Prepare Your Code

### 1.1 Verify Your Files

Make sure your repository has these files in the `mcp/navifare-mcp/` directory:

- ✅ `package.json` - Dependencies and scripts
- ✅ `http-server.js` - HTTP-based MCP server (for Render deployment)
- ✅ `Dockerfile` - Docker configuration (optional, but recommended)
- ✅ `render.yaml` - Render configuration (optional)
- ✅ `.env.example` - Example environment variables (helpful for documentation)

### 1.2 Build Your Code Locally

Test that everything builds correctly:

```bash
cd mcp/navifare-mcp
npm install
npm run build
```

**Expected output:** Should complete without errors. The `dist/` folder should contain compiled files.

### 1.3 Test Your Server Locally

Start the HTTP server to make sure it works:

```bash
npm run serve
```

**Expected output:**
```
🚀 Navifare MCP HTTP Server Running
Local:     http://localhost:2091
MCP:       http://localhost:2091/mcp
Health:    http://localhost:2091/health
```

Test the health endpoint:
```bash
curl http://localhost:2091/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "navifare-mcp",
  "version": "0.1.0",
  "timestamp": "2025-01-27T..."
}
```

---

## 🌐 Step 2: Create Render Account & Connect Repository

### 2.1 Sign Up / Log In to Render

1. Go to [render.com](https://render.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose to sign up with GitHub/GitLab/Bitbucket (recommended) or email

### 2.2 Connect Your Repository

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your Git provider (GitHub/GitLab/Bitbucket)
3. Authorize Render to access your repositories
4. Select your repository containing the Navifare MCP code

---

## ⚙️ Step 3: Configure Your Render Service

### 3.1 Basic Settings

Fill in these fields:

```
Name: navifare-mcp
Region: Choose closest to your users (e.g., "Oregon (US West)" for US)
Branch: main (or your default branch)
```

### 3.2 Build & Start Commands

**Option A: Using Docker (Recommended)**

```
Environment: Docker
Dockerfile Path: ./mcp/navifare-mcp/Dockerfile
Docker Context: ./mcp/navifare-mcp
```

**Option B: Direct Node.js (Simpler)**

```
Environment: Node
Root Directory: ./mcp/navifare-mcp
Build Command: npm ci && npm run build
Start Command: npm run serve
```

**⚠️ Important:** Render will automatically set the `PORT` environment variable. Your `http-server.js` should use `process.env.PORT` (which it already does).

### 3.3 Environment Variables

Click **"Environment"** tab and add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `10000` | Server port (Render may override this) |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Your Google Gemini API key for image extraction |

**Optional:** You can also set `NAVIFARE_API_BASE_URL` if you want to use a different Navifare API endpoint (defaults to `https://api.navifare.com/api/v1/price-discovery/flights`).

**⚠️ Security Note:** Never commit API keys to your repository. Always use environment variables.

### 3.4 Advanced Settings

- **Auto-Deploy:** ✅ Yes (deploys automatically on every push)
- **Health Check Path:** `/health`
- **Health Check Timeout:** 3 seconds

---

## 🚀 Step 4: Deploy!

### 4.1 Create the Service

1. Click **"Create Web Service"**
2. Wait for deployment to start (takes 5-10 minutes)
3. Monitor the build logs in real-time

### 4.2 Watch the Build Logs

You'll see logs like:
```
==> Cloning from git...
==> Building...
==> Installing dependencies...
==> Building application...
==> Starting service...
```

**✅ Success indicators:**
- Build completes without errors
- Service starts successfully
- Health check passes

**❌ Common issues:**
- Build failures: Check that all dependencies are in `package.json`
- Missing environment variables: Verify all required vars are set
- Port conflicts: Ensure your code uses `process.env.PORT`

---

## 🌐 Step 5: Get Your Public URL

Once deployment completes, Render will give you a URL like:

```
https://navifare-mcp-abc123.onrender.com
```

### 5.1 Test Your Deployment

**Health Check:**
```bash
curl https://navifare-mcp-abc123.onrender.com/health
```

**MCP Endpoint:**
```bash
curl https://navifare-mcp-abc123.onrender.com/mcp
```

Should return your MCP server metadata with available tools.

---

## 🔧 Step 6: Configure MCP Clients

### 6.1 For ChatGPT (OpenAI)

1. Open ChatGPT (requires Plus or Team account)
2. Go to **Settings** → **Beta Features** or **Apps**
3. Enable **MCP (Model Context Protocol)**
4. Add your server:
   ```
   Name: Navifare Flight Price Finder
   URL: https://navifare-mcp-abc123.onrender.com/mcp
   Description: Find better flight prices from booking screenshots
   ```
5. Save and enable

### 6.2 For Claude (Anthropic)

1. Open Claude Desktop or Claude web
2. Go to **Settings** → **Developer**
3. Add MCP server:
   ```json
   {
     "mcpServers": {
       "navifare": {
         "url": "https://navifare-mcp-abc123.onrender.com/mcp",
         "transport": "http"
       }
     }
   }
   ```

### 6.3 For Other MCP Clients

Most MCP clients support HTTP-based servers. Use your Render URL:

```
https://navifare-mcp-abc123.onrender.com/mcp
```

---

## 🧪 Step 7: Test Your Deployment

### 7.1 Test Image Extraction

In your MCP client, try:
```
I have a flight booking screenshot. Can you help me find better prices?
```

Then upload a flight booking screenshot.

### 7.2 Test Price Check

Try:
```
I found flight AZ 573 from ZRH to FCO on Nov 19th at 7:15 PM for 200 EUR. Can you find a better price?
```

---

## 🔍 Step 8: Monitor & Debug

### 8.1 View Logs

1. Go to your service dashboard in Render
2. Click **"Logs"** tab
3. View real-time logs

### 8.2 Common Issues & Solutions

**Issue: Service won't start**
- Check logs for error messages
- Verify environment variables are set
- Ensure `PORT` is properly configured

**Issue: Build fails**
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally
- Check for syntax errors

**Issue: MCP client can't connect**
- Verify your service URL is correct
- Test the `/health` endpoint
- Check that the service is not sleeping (free tier sleeps after 15 min)

**Issue: Tool calls fail**
- Check logs for specific error messages
- Verify API keys are correct
- Test the tool locally first

---

## 💰 Step 9: Upgrade for Production (Optional)

### Free Tier Limitations

- ⚠️ Services sleep after 15 minutes of inactivity
- ⚠️ Cold starts take ~30 seconds
- ⚠️ Limited CPU and memory

### Paid Plans

- **Starter ($7/month):** Always-on services
- **Standard ($25/month):** More resources, better performance

**Recommendation:** For production use with ChatGPT/Claude, upgrade to keep the service always-on.

---

## 🔄 Step 10: Updates & Maintenance

### Automatic Deployments

With auto-deploy enabled:
1. Push changes to your repository
2. Render automatically rebuilds and redeploys
3. Monitor logs for any issues

### Manual Deployments

1. Go to service dashboard
2. Click **"Manual Deploy"**
3. Choose branch/commit to deploy

### Environment Variable Updates

1. Go to service dashboard
2. Click **"Environment"** tab
3. Update variables
4. Click **"Save Changes"**
5. Service restarts automatically

---

## ✅ Success Checklist

Before considering your deployment complete:

- [ ] ✅ Service deployed successfully on Render
- [ ] ✅ Health endpoint returns 200 OK
- [ ] ✅ MCP endpoint returns valid metadata
- [ ] ✅ All environment variables configured
- [ ] ✅ Service logs show no errors
- [ ] ✅ MCP client can connect to your server
- [ ] ✅ Test flight search works end-to-end
- [ ] ✅ Test image extraction works end-to-end

---

## 🆘 Troubleshooting

### Service Won't Start

```bash
# Check build logs in Render dashboard
# Common issues:
# - Missing dependencies → Check package.json
# - TypeScript errors → Run npm run build locally
# - Environment variables → Verify all required vars are set
```

### MCP Client Can't Connect

1. Verify MCP URL is correct: `https://your-service.onrender.com/mcp`
2. Test health endpoint: `curl https://your-service.onrender.com/health`
3. Check service logs for errors
4. Ensure service is not sleeping (free tier)

### Tool Calls Fail

1. Check logs for specific error messages
2. Verify API key is correct (`GEMINI_API_KEY`)
3. Test the tool locally first
4. Check that the tool is listed in `/mcp` endpoint response

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

## 🎉 You're Done!

Your Navifare MCP server is now deployed and accessible to any MCP client! 🚀✈️

**Your MCP Server URL:**
```
https://your-service-name.onrender.com/mcp
```

Share this URL with anyone who wants to use your flight price discovery service!

