# Demo 01 — Connect via MCP

**Goal:** prove Claude Code can drive Caido through the MCP server.
**Time:** ~10 min. **Bridge:** MCP.

## Steps

Full setup in [`../docs/01-setup-mcp.md`](../docs/01-setup-mcp.md). Short version:

```bash
# build (or `go install ...@latest`)
git clone https://github.com/c0tton-fluff/caido-mcp-server.git && cd caido-mcp-server
go build -ldflags "-X github.com/c0tton-fluff/caido-mcp-server/v4/internal/buildinfo.version=$(git describe --tags)" -o caido-mcp-server ./cmd/caido-mcp-server

# auth (use localhost, your port)
CAIDO_URL=http://localhost:8080 ./caido-mcp-server login

# register at user scope (real absolute path to the binary)
claude mcp add caido -s user -e CAIDO_URL=http://localhost:8080 -- "$(pwd)/caido-mcp-server" serve
claude mcp list
```

## Test

```
claude
```
```
/mcp
check caido health
What caido projects do I have
```

## What "success" looks like

Claude makes `caido_*` tool calls (e.g. `caido_get_instance`, `caido_list_projects`) and returns your
project list. If instead it runs `sqlite3`/`ls`, the MCP isn't loaded — see troubleshooting.

## Talk track

"No code — we registered a server and Claude instantly has 66 Caido tools. That convenience has a
cost: all 66 schemas are now in context. Hold that thought for demo 03."
