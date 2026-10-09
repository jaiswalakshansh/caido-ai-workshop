# Deck outline — "Your AI Needs a Proxy" (improved)

Source for the .pptx. Each `##` is a slide; bullets are the on-slide text; _Notes:_ is the speaker track.

## 1. Title — Your AI Needs a Proxy
- De-sloppify AI-assisted hacking with Caido
- Caido + Claude Code · MCP & Skills · real bugs
_Notes: Hook — "Everyone's letting AI fire blind curl at targets. Let's make it observable, safe, and actually good at finding bugs."_

## 2. Part 1 — Why?
_Notes: Set the stakes before any tooling._

## 3. Why a proxy
- Scope with paths · manual check of every request
- Rate limiting · full logging of all traffic
_Notes: These are table stakes for pro testing._

## 4. Why AI
- Make it go brrrr — speed and scale
_Notes: AI is the accelerant. But..._

## 5. Re-learning the lessons
- Observability — log all traffic (for the report)
- Search — a searchable DB of that traffic
- Tools — reuse proven, deterministic tooling
- Scope — don't hack the planet, don't drop tables
- Human in the loop — easy to take over
_Notes: Bolt AI on and you lose all five — unless the AI goes THROUGH the proxy. That's the whole talk._

## 6. Part 2 — How?
_Notes: Now the architecture._

## 7. The primitive
- Any tool with a proxy flag feeds Caido
- `curl -x 127.0.0.1:8080 target` · `-c cookie_jar.txt`
_Notes: Browser or curl or the AI — all become inspectable traffic._

## 8. The two bridges
- MCP — a server of typed Tools + Resources
- Skills — a SKILL.md + a CLI the agent runs
_Notes: Both let Claude drive Caido; different mechanism and cost._

## 9. MCP on the wire
- `tools/list` → ~66 tool schemas returned
- All of them now live in context
_Notes: Great discoverability, heavy token cost. Remember that._

## 10. Skills vs MCP
- Skills: on-demand context · pipe CLI calls · need a CLI
- MCP: all tools in context · more tokens · zero-build
- Rule: MCP to start fast; Skills to save tokens / go custom
_Notes: We'll MEASURE this in demo 03 with /cost._

## 11. A fancy loop
- Prompt (task) + Tools/Skills (hands) + Loop
_Notes: That's all an "agent" is. Leverage = the tools you give it._

## 12. Scale
- Agents on a VPS → Caido proxy → target
- Fan out: many agents / many VPSs, one searchable history
_Notes: Make it go brrrr — still observable because it all lands in Caido._

## 13. The auth model (what breaks)
- MCP → local access token / OAuth login
- Skill → PAT (caido_...)
- Host must match token (localhost ≠ 127.0.0.1); port must match instance
_Notes: 90% of setup pain is right here._

## 14. Part 3 — Practical
- Repo: github.com/jaiswalakshansh/caido-ai-workshop
_Notes: Everything we run is in the repo._

## 15. Connect (demos 01–02)
- MCP: build → login → `mcp add -s user` → test
- Skill: `skills add` → npm i → PAT → test
_Notes: Register MCP at USER scope or it only works in one folder._

## 16. Find the secret + cost (demo 03)
- Proxy browser → run lab → "find the secret in history"
- `/cost` + `/context`: Skill vs MCP
_Notes: Same job, Skill is leaner. Context engineering = the cost story._

## 17. JS recon (demo 04)
- "Reconstruct replay sessions from file.js. Don't fix content length. Don't send."
- Hidden endpoints + body shapes, staged for you
_Notes: Reading the client is the highest-leverage recon._

## 18. Build an SSRF skill (demo 05)
- Ground on real SDK docs → verify against packages → ship
- A skill that drives the QuickSSRF plugin (SDK + PAT)
_Notes: De-sloppified skill building. Now it's reusable._

## 19. Part 4 — Impact: the bugs that pay
_Notes: This is the part most AI-hacking talks skip._

## 20. AuthMatrix authz testing (demo 06) 🔴
- Plugin replays every request as every user (deterministic grid)
- AI reads bodies → real leak vs legit (BOLA/BFLA)
_Notes: OWASP API #1. Plugin does replay; AI makes the semantic call._

## 21. ParamFinder hidden params (demo 07) 🔴
- Plugin brute-forces hidden query/body/header params
- AI triages: ?url→SSRF, ?file→LFI, ?debug→leak, header→cache poison; weaponizes
_Notes: Discovery + instant impact testing with the QuickSSRF canary._

## 22. Archive / Wayback recon (demo 08) 🟠
- gau/waybackurls/katana → thousands of historical URLs
- AI triages → still-live, still-sensitive forgotten endpoints
_Notes: The archive remembers what they meant to delete._

## 23. gRPC-web / protobuf decode & tamper (demo 09) 🔴
- Opaque binary RPC on a live target — most skip it
- AI reads the app's JS → decode → tamper → re-encode → test
_Notes: The genuinely hard one. Can't fuzz what you can't read. Hack-Google technique._

## 24. GraphQL assault (demo 10) 🔴
- GraphQL-Analyzer maps the schema
- AI finds dangerous mutations + IDOR queries; tests authz & batching bypass
_Notes: One endpoint, thousand-type schema; plugin draws the map, AI finds the bugs._

## 25. The philosophy
- Explore fast with AI → crystallize the repeatable part into deterministic tooling
- The proxy is the chokepoint: observable, scoped, reversible
_Notes: That's de-sloppified AI hacking in one line._

## 26. Resources
- github.com/jaiswalakshansh/caido-ai-workshop
- caido/skills · c0tton-fluff/caido-mcp-server
- caido-community/quickssrf · vitorfhc/caido-rpc-mapper
- labs.trace37.com/blog/caido-ai-hunting-platform

## 27. Thank you / Q&A
- Only test what you're authorized to. Rotate leaked tokens.
