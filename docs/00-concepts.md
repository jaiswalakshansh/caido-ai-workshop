# 00 — Concepts (read this first)

## Why put a proxy between the AI and the target?

A web proxy (Caido, Burp) sits between a client and the server, so every HTTP request/response
flows through it and can be **seen, searched, edited, replayed, and scoped**. These are the
non-negotiables of professional testing. The moment you hand the keyboard to an AI agent that
just runs `curl`, you lose all of them. Routing the agent *through* Caido gives them back:

| Lesson | Without a proxy | With Caido in the loop |
|--------|-----------------|------------------------|
| **Observability** | AI's actions vanish into stdout | Every request is in History, ready for the report |
| **Search** | grep over scrollback | HTTPQL over the whole traffic DB |
| **Tools** | LLM re-invents a fuzzer badly | Reuse proven Automate / Match&Replace / plugins |
| **Scope** | "hack the planet" risk | Allow/deny host rules fence the agent in |
| **Human in the loop** | fire-and-pray | AI stages requests; you approve and fire |

Key trick: **any tool that supports a proxy can feed Caido.** `curl -x 127.0.0.1:8080 target` sends
curl's traffic through Caido. So does a browser set to the same proxy. The AI's requests become
first-class, inspectable traffic.

## What is an AI agent? ("a fancy loop")

An agent = **a prompt (the task) + some tools/skills (the hands) + a loop**: think → pick a tool →
run it → read the result → repeat until done. Claude Code is one. The whole workshop is about *what
tools you put in the agent's hands* and whether they keep you safe and observable.

## The two bridges: MCP vs Skills

Both let Claude drive Caido. They differ in mechanism and cost.

### MCP (Model Context Protocol)
A **server process** that speaks a standard protocol (JSON-RPC) to the agent. It advertises:
- **Tools** — typed, callable functions (`caido_send_request`, `caido_list_requests`, …). The Caido
  MCP server exposes ~66 of them.
- **Resources** — read-only data the model can pull cheaply (`caido://findings`, `caido://scopes`).
- **Prompts** — optional prompt templates.

The handshake: client sends `tools/list` → server returns all ~66 tool schemas → they now live in
the model's context. Great discoverability, but **heavy on tokens** (every schema is always loaded).

### Skills
A **folder on disk** the agent is told about:
- **Instructions** — a `SKILL.md` the model reads *only when relevant* (progressive disclosure).
- **A CLI tool** — a real command the model runs in the shell and **pipes** between calls.

Lighter context (load instructions on demand), and the model chains commands like a human at a
terminal — but someone has to build the CLI.

### Which to use?

| | Skills | MCP |
|---|--------|-----|
| Context cost | Low (on-demand) | High (~66 schemas always loaded) |
| Setup | Install a folder + CLI | Register a server |
| Style | Pipe CLI commands | Call typed tools |
| Best for | Token efficiency, tight control, custom workflows | Fast standardized access, discoverability |

Rule of thumb: **MCP to get going fast and for broad tool access; Skills when you care about token
cost or want a bespoke, deterministic workflow.** Demo 03 lets you measure the difference with `/cost`.

## The auth model (the #1 thing that breaks)

Two *different* credentials — do not mix them:

- **MCP server → local Caido access token** (or OAuth via `caido-mcp-server login`, which
  auto-refreshes). Stored under `~/.caido-mcp/tokens/`.
- **Skill (`caido-client.ts`, `quickssrf.ts`) → PAT** (Personal Access Token, prefix `caido_`),
  created in **Caido → Developer → Personal Access Tokens**, passed via `CAIDO_PAT`.

Two more gotchas we hit live:
- **Host must match the token.** `localhost` and `127.0.0.1` are *different keys*. Log in and
  configure with the **same** hostname (we use `localhost:8080`).
- **Port must match your instance.** The talk's slides use `8082`; a default Caido is `8080`.
  Use whatever `curl http://localhost:<port>/health` returns `ready:true` on.

## Caido features you'll use

- **History** + **HTTPQL** — the searchable traffic DB and its query language.
- **Replay** — edit and resend a captured request (keeps real auth).
- **Automate** — the fuzzer (deterministic payload sweeps).
- **Match & Replace** — auto-rewrite traffic (e.g. inject a header on every request).
- **Scope** — allow/deny host rules = your safety fence.
- **Findings** — stored vuln records the AI can file for your report.
- **Plugins** (e.g. QuickSSRF) — extend Caido; drivable from the SDK.

## Verifying the AI *actually* used Caido

Getting the right answer isn't proof. Confirm the **mechanism**:
- MCP: you see `caido_*` tool-call chips (and `/mcp` lists the server).
- Skill: you see it run `caido-client.ts …` / `quickssrf.ts …` shell commands.
- If you ever see it reading `~/Library/.../*.db` with `sqlite3` or `ls`, it **bypassed** the bridge —
  fix the connection (see troubleshooting) rather than trusting the output.
