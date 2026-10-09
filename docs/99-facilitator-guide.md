# 99 — Facilitator guide

A run sheet for delivering the workshop. Pair it with the deck in `slides/`.

## Arc (why it lands)

1. **Why** a proxy (observability, search, tools, scope, human-in-loop) — and how AI throws them away.
2. **How** to put them back: the two bridges (MCP, Skills) and the agent loop.
3. **Practical**: connect (demos 01–02), prove value (03–05).
4. **Impact**: the bugs that pay (demos 06–10).
5. **Philosophy**: explore with AI, then crystallize into deterministic tooling.

## Timing (≈2h, adjust)

| Block | Time | Content |
|-------|------|---------|
| Intro / Why | 15m | slides 1–5 equiv; the 5 lessons |
| How | 20m | MCP vs Skills, the loop, scale |
| Setup MCP | 15m | demo 01 (+ troubleshooting live) |
| Setup Skill | 10m | demo 02 |
| Find secret + cost | 10m | demo 03, `/cost` compare |
| JS recon | 10m | demo 04 |
| Build SSRF skill | 15m | demo 05 |
| **IDOR matrix** | 15m | **demo 06** |
| **Blind SSRF** | 10m | **demo 07** |
| Race / mass-assign / RPC | 15m | demos 08–10 (pick per audience) |
| Q&A | 10m | |

## Pre-flight (morning of)

```bash
./scripts/bootstrap.sh
```
Then confirm: Caido project open; browser proxied (History shows rows after visiting the labs page);
`claude mcp list` shows caido ✔; `CAIDO_PAT` exported; QuickSSRF plugin installed; `nvm use 24`.
Pre-run demos 03, 04, 06 once so you know they land. Keep a finished `claude --resume` session as a fallback.

## Live-demo survival kit

- **Verify the mechanism**, not the answer: look for `caido_*` tool chips (MCP) or `caido-client.ts`
  commands (Skill). If you see `sqlite3`, the bridge isn't loaded.
- **MCP won't connect?** Run the binary by hand to read the real error:
  `CAIDO_URL=http://localhost:8080 /path/caido-mcp-server serve`.
- **Use `localhost:8080` everywhere** (host + port must match the token). The slides' `8082` is *their* port.
- **Empty results** on demo 03/06/07 → browser wasn't actually proxied; History is empty.

## The errors we hit (teach them — attendees will too)

`ENOENT` (placeholder path) → `EACCES` (folder vs binary) → `CONNECTION_CLOSED` (wrong port) →
`CONNECTION_CLOSED` (localhost vs 127.0.0.1 token) → "answered but used sqlite" (local vs user scope).
Full table in `docs/03-troubleshooting.md`.

## FAQ

- **MCP or Skills?** Skills = cheaper tokens + tighter control; MCP = standardized + broad access fast.
  Measure it live with `/cost` (demo 03).
- **Why not just let it run curl?** You lose logging/search/scope/human-in-loop; proxy keeps all four.
- **Is this safe?** Scope fences the host; the impact demos stage/propose and you fire; races/escalation
  only on test accounts you own.
- **Auth failing?** MCP = access token/OAuth; Skill = PAT. Different credentials.
- **Why build a plugin at the end (demo 10)?** Determinism + token savings: harden the repeatable part.

## Ethics reminder to say out loud

Everything here is for authorized testing only — your labs, in-scope bounty assets, signed engagements.
And: a PAT pasted into a prompt lands in the transcript and on disk — rotate it. (We learned that the hard way.)
