# Repository Structure

This document describes the organization of the Navifare MCP server repository.

## Directory Structure

```
navifare-mcp/
├── README.md                 # Main documentation entry point
├── package.json              # Node.js dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── Dockerfile               # Docker build configuration
├── render.yaml             # Render.com deployment configuration
├── .dockerignore           # Docker ignore patterns
├── .gitignore              # Git ignore patterns
│
├── src/                    # Source code (TypeScript)
│   ├── index.ts            # Main MCP server entry point
│   ├── navifare.ts         # Navifare API integration
│   ├── extractService.ts   # Image extraction service
│   └── types.d.ts          # TypeScript type definitions
│
├── dist/                   # Compiled JavaScript (generated)
│   ├── index.js
│   ├── navifare.js
│   └── extractService.js
│
├── docs/                   # Documentation
│   ├── COMPLIANCE.md       # Compliance documentation
│   ├── USAGE_EXAMPLES.md   # Usage examples
│   ├── QUICKSTART.md       # Quick start guide
│   ├── LOCAL_DEPLOYMENT.md # Local deployment guide
│   ├── RENDER_DEPLOYMENT_GUIDE.md # Production deployment
│   ├── CLAUDE_SUBMISSION_CHECKLIST.md # Submission checklist
│   └── ...                 # Other documentation files
│
├── test/                   # Test files
│   ├── README.md           # Test documentation
│   ├── test-mcp.js         # MCP protocol tests
│   ├── test-*.js           # Various test files
│   ├── test-*.json         # Test data files
│   └── ...                 # Other test files
│
├── scripts/                # Helper scripts
│   ├── start-local.sh      # Start local development server
│   ├── deploy-to-render.sh # Prepare for Render deployment
│   ├── start-servers.sh    # Start multiple servers
│   └── stop-servers.sh     # Stop servers
│
├── http-server.js          # HTTP server implementation
├── stdio-server.js         # STDIO server implementation
└── mcp-server-wrapper.js   # MCP server wrapper
```

## Key Files

### Root Level
- **README.md**: Main entry point for documentation
- **package.json**: Project dependencies and npm scripts
- **Dockerfile**: Container build configuration
- **http-server.js**: Production HTTP server
- **stdio-server.js**: STDIO server for local development

### Source Code (`src/`)
- TypeScript source files
- Compiled to JavaScript in `dist/` directory

### Documentation (`docs/`)
- All markdown documentation files
- Organized by topic (deployment, compliance, usage, etc.)

### Tests (`test/`)
- All test files and test data
- See `test/README.md` for details

### Scripts (`scripts/`)
- Shell scripts for common tasks
- Deployment and development helpers

## File Organization Principles

1. **Source code** in `src/` directory
2. **Documentation** in `docs/` directory
3. **Tests** in `test/` directory
4. **Scripts** in `scripts/` directory
5. **Configuration files** at root level
6. **Generated files** in `dist/` (gitignored)

## Navigation

- Start here: [README.md](./README.md)
- Quick start: [docs/QUICKSTART.md](./docs/QUICKSTART.md)
- Full documentation: [docs/](./docs/)
- Tests: [test/README.md](./test/README.md)
- Scripts: [scripts/](./scripts/)

