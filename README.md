# Your AI Needs a Proxy — Caido + AI Pentesting Workshop

Give an AI agent (Claude Code) a **real pentest proxy** (Caido) instead of a raw shell.
Every request the AI makes is then **logged, searchable, scoped, and reversible**, and a
human stays in the loop — the opposite of letting an LLM fire blind `curl` commands ("slop").

This repo is a hands-on workshop: two ways to connect an agent to Caido (**MCP** and **Skills**),
then a set of demos that go from "hello world" to **finding real critical/high-severity bugs**
(IDOR/BOLA, blind SSRF, race conditions, mass assignment, hidden-endpoint auth bypass).

> Based on the DEF CON talk *"Your AI Needs a Proxy"* by Emile Fugulin (Caido) & Vitor (trace37),
> extended with higher-impact, bug-bounty-oriented demos and a clean, reproducible setup.

---

## What you'll be able to do

- Connect Claude Code to Caido two ways and know **when to use each**.
- Have the AI **read your captured traffic** and reason over it (find secrets, map the app).
- Reconstruct hidden API endpoints from **minified JS** and stage them in Replay.
- Run a **broken-access-control / IDOR sweep** across dozens of endpoints in seconds.
- Hunt **blind SSRF** at scale with an OAST canary you generate from a skill you built.
- Test **race conditions** with Caido's synchronized last-byte sender.
- Build your own **skill** that drives any Caido plugin via the SDK.

---

## Repo map

```
docs/      concepts + setup + troubleshooting + facilitator guide
demos/     numbered, runnable demos (01–05 foundations, 06–10 high-impact)
skills/    the caido-quickssrf skill (SDK + PAT, improved)
prompts/   copy-paste prompt library for each attack class
scripts/   bootstrap + session-trace helpers
sample-targets/  labcommerce.min.js (the JS-recon sample)
slides/    the deck (your-ai-needs-a-proxy.pptx) + outline
```

---

## Quick start (read these in order)

1. **Concepts** → [`docs/00-concepts.md`](docs/00-concepts.md) — proxy, MCP vs Skills, the auth model. Read this first.
2. **Install Caido** and open a project. Confirm it's up:
   ```bash
   curl -s -o /dev/null -w "Caido -> HTTP %{http_code}\n" http://localhost:8080
   ```
3. **Connect via MCP** → [`docs/01-setup-mcp.md`](docs/01-setup-mcp.md)
4. **Connect via Skill** → [`docs/02-setup-skill.md`](docs/02-setup-skill.md)
5. **Run the demos** → [`demos/`](demos/) in order.
6. Stuck? → [`docs/03-troubleshooting.md`](docs/03-troubleshooting.md) (every error we actually hit, with the fix).

Running the workshop for others? → [`docs/99-facilitator-guide.md`](docs/99-facilitator-guide.md).

---

## The demos at a glance

| # | Demo | Bridge | Targets | Why it matters |
|---|------|--------|---------|----------------|
| 01 | [Connect via MCP](demos/demo-01-connect-mcp.md) | MCP | — | Prove the MCP path works |
| 02 | [Connect via Skill](demos/demo-02-connect-skill.md) | Skill | — | Prove the Skill path + see the contrast |
| 03 | [Find the secret](demos/demo-03-find-the-secret.md) | both | secrets in traffic | AI reasons over your history; compare token cost |
| 04 | [JS recon → Replay](demos/demo-04-js-recon.md) | both | hidden endpoints | Reconstruct the API surface from minified JS |
| 05 | [Build an SSRF skill](demos/demo-05-build-ssrf-skill.md) | Skill | tooling | Build a skill that drives a Caido plugin (SDK+PAT) |
| **06** | [**IDOR / BOLA matrix**](demos/demo-06-idor-bola-matrix.md) | MCP | **Critical/High** | Swap tokens across every object-id endpoint, diff, flag |
| **07** | [**Blind SSRF at scale**](demos/demo-07-blind-ssrf-at-scale.md) | Skill+MCP | **Critical** | Inject one OAST canary into every URL-ish param, watch callbacks |
| **08** | [**Race conditions**](demos/demo-08-race-conditions.md) | MCP | **High** | Last-byte-synced duplicate requests → limit bypass |
| **09** | [**Mass assignment / hidden-endpoint authz**](demos/demo-09-mass-assignment.md) | MCP | **Critical/High** | Flip `role`, hit undocumented endpoints unauth'd |
| **10** | [**GraphQL / gRPC recon**](demos/demo-10-graphql-grpc-recon.md) | MCP | surface | Map opaque RPC/`batchexecute` from JS (the "hack Google" trick) |

Demos 06–10 are the point: **this is where AI + Caido actually saves hours and finds the bugs that pay.**

---

## Safety & ethics

Only test systems you are authorized to test (your own labs, a bounty program's in-scope assets,
a signed engagement). Use Caido **Scope** to fence the agent in (see concepts). Keep destructive
and state-changing actions **human-in-the-loop** — the demos are written so the AI *proposes and stages*,
and *you* fire. **Never commit a PAT or token.** This repo's `.gitignore` blocks the common ones; still, check.
