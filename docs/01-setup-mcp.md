# 01 — Setup: connect Claude Code to Caido via MCP

The MCP server exposes ~66 Caido tools to Claude Code. This is the fastest way to get broad access.

## Prerequisites

- Caido running; note the port. Confirm with:
  ```bash
  curl -s http://localhost:8080/health
  ```
  Expect `{"name":"caido",...,"ready":true}`. **Use whatever port this works on** below.
- Go 1.25+ (`go version`) — only if you build from source.
- Claude Code (`claude --version`).

## Step 1 — get the server binary

**Option A — build from source (what the workshop did):**
```bash
git clone https://github.com/c0tton-fluff/caido-mcp-server.git
cd caido-mcp-server
go build -ldflags "-X github.com/c0tton-fluff/caido-mcp-server/v4/internal/buildinfo.version=$(git describe --tags)" -o caido-mcp-server ./cmd/caido-mcp-server
```
The binary is now `./caido-mcp-server` in that folder. Note its **absolute path** (`pwd`), you need it in step 3.

**Option B — no build:**
```bash
go install github.com/c0tton-fluff/caido-mcp-server/v4/cmd/caido-mcp-server@latest
# or:
curl -fsSL https://raw.githubusercontent.com/c0tton-fluff/caido-mcp-server/main/install.sh | bash
```

## Step 2 — authenticate (OAuth device flow, auto-refreshes)

> **Use `localhost`, not `127.0.0.1`.** The token is keyed by the exact hostname; if you log in with
> one and configure the other, you'll get `CONNECTION_CLOSED` / "no authentication token found".

```bash
CAIDO_URL=http://localhost:8080 ./caido-mcp-server login
```
This opens a browser; approve. A refreshable token is saved under `~/.caido-mcp/tokens/`.

## Step 3 — register the server with Claude Code (user scope!)

> **Use `-s user`** so Caido is available from *every* directory. Without it, the server is bound to
> the one folder you ran the command in, and `claude` elsewhere won't see it (it'll silently fall
> back to reading Caido's files on disk — which looks like success but isn't using MCP).

Replace the path with **your** absolute path to the binary:
```bash
claude mcp remove caido 2>/dev/null
claude mcp add caido -s user -e CAIDO_URL=http://localhost:8080 -- /ABSOLUTE/PATH/TO/caido-mcp-server serve
claude mcp list
```
Expect: `caido: ... ✔ Connected`.

> The path must point at the **binary**, not its folder. `/path/caido-mcp-server/caido-mcp-server serve`
> (folder/binary), not `/path/caido-mcp-server serve` (folder → `EACCES`).

## Step 4 — test (verify the *mechanism*, not just the answer)

```bash
claude
```
Inside Claude:
```
/mcp
check caido health
What caido projects do I have
```
✅ Success = you see `caido_*` **tool calls**.
❌ If you see it running `sqlite3`/`ls ~/Library/...`, the MCP didn't load — re-check `claude mcp list`.

## If something breaks

Run the binary directly to read the real error (the `claude mcp list` view hides it):
```bash
CAIDO_URL=http://localhost:8080 /ABSOLUTE/PATH/TO/caido-mcp-server serve
```
- `no authentication token found for http://...` → hostname/port mismatch, or re-run `login` with the exact same `--url`.
- `ENOENT` → placeholder path never replaced with the real one.
- `EACCES` → path points at the folder, not the binary inside it.
- `CONNECTION_CLOSED` → it launched but exited: usually wrong port (nothing listening) or missing/mismatched token.

Full table: [`03-troubleshooting.md`](03-troubleshooting.md).

## Re-auth when the token expires (~7 days)

```bash
/ABSOLUTE/PATH/TO/caido-mcp-server login --url http://localhost:8080
```
