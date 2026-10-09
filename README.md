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
- Build your own **skill** that drives any Caido plugin via the SDK (QuickSSRF).
- Drive real community plugins with AI: **AuthMatrix** (authz), **ParamFinder** (hidden params),
  **GraphQL-Analyzer**, **JS-Analyzer**.
- Mine **archive/Wayback** data for forgotten endpoints and triage thousands of URLs.
- Decode and tamper **gRPC-web / protobuf** on a live target by reading the app's own JS.

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
| **06** | [**AuthMatrix authz testing**](demos/demo-06-authmatrix-authz.md) | AuthMatrix + MCP | **Critical/High** | Grid-replay every request as every user; AI judges real leaks (BOLA/BFLA) |
| **07** | [**ParamFinder hidden params**](demos/demo-07-paramfinder-hidden-params.md) | ParamFinder + MCP | **Critical/High** | Brute hidden params/headers, then AI triages & weaponizes each |
| **08** | [**Archive / Wayback recon**](demos/demo-08-archive-recon.md) | gau/katana + MCP | **Critical/High** | Triage thousands of forgotten URLs → still-live sensitive endpoints |
| **09** | [**gRPC-web / protobuf**](demos/demo-09-grpc-protobuf.md) | JS-Analyzer + MCP | **Critical** | Read the app's JS to decode & tamper opaque binary RPC on a live target |
| **10** | [**GraphQL assault**](demos/demo-10-graphql-assault.md) | GraphQL-Analyzer + MCP | **Critical/High** | AI reasons over the schema → dangerous mutations, IDOR, batching bypass |

Demos 06–10 are the point: **real community plugins + AI on live targets — the bugs that pay, and the
work that's genuinely hard to automate.**

---

## Safety & ethics

Only test systems you are authorized to test (your own labs, a bounty program's in-scope assets,
a signed engagement). Use Caido **Scope** to fence the agent in (see concepts). Keep destructive
and state-changing actions **human-in-the-loop** — the demos are written so the AI *proposes and stages*,
and *you* fire. **Never commit a PAT or token.** This repo's `.gitignore` blocks the common ones; still, check.
