# Demo 10 — GraphQL / gRPC / `batchexecute` recon (the "hack Google" trick)

Unlock attack surface that other hunters skip because it's unreadable. Modern apps don't always speak
plain REST — Google's Bard/Gemini UI uses `POST /_/.../batchexecute?rpcids=Te6DCf` (gRPC-web RPC
batching). The AI reads the app's own JS in Caido to decode what each opaque call does.
**Bridge:** MCP. **Targets:** hidden/underdocumented surface → feeds demos 06–09.

## The idea

If you can't read the protocol, you can't test it. The app's JavaScript *does* know the RPC names,
parameters, and response shapes. Point the AI at the captured JS in Caido and have it reverse the
mapping, then document it so you (and later demos) can attack it.

## Setup

1. Proxy a session with the target through Caido so its JS bundles and RPC/GraphQL calls are in History.
2. Pick one opaque request (an `rpcids=...` batchexecute call, a GraphQL `POST /graphql`, or a gRPC-web call).

## Run it

Reverse one RPC:
```
Check the request that contains rpcids=Te6DCf. Find out what that request is for, its parameters, and expected response. Draft a markdown file with everything you can gather about it. Most of the knowledge is in the JS files already captured in Caido — read them from history.
```

For GraphQL specifically:
```
Find the GraphQL endpoint in caido history. Try an introspection query; if disabled, reconstruct the schema (types, queries, mutations) from the operations and persisted-query hashes in the captured JS. List mutations that change state or touch other users' objects — those are our IDOR/authz targets.
```

## Make it deterministic (save tokens — the real lesson)

Once the AI has reversed the pattern, stop paying tokens to redo it: have it build a **Caido plugin**
that maps `rpcids` → RPC name automatically (right-click a request → extract id → resolve name), grounded
on the official developer docs:
```
Create a Caido plugin. Clone https://github.com/caido/doc-developer and use it as the documentation; ground all development in it. The plugin should take a request with rpcids, resolve the RPC name (e.g. /BardFrontendService.ListDiscoveryBanners), and save it. I can search in the plugin UI and right-click a request to extract the id and get the name. Implement it fully.
```
(Reference implementation: https://github.com/vitorfhc/caido-rpc-mapper)

## Why AI + Caido wins here

- Reading minified RPC/GraphQL JS by hand is brutal; the model does it in minutes.
- Caido already has the JS and the calls captured — the AI just needs to read and correlate.
- Crystallizing it into a plugin turns a token-hungry reasoning task into a one-click deterministic tool.

## Success / impact

A documented map of the hidden API, and (optionally) a reusable Caido plugin. This recon is what makes
demos 06–09 possible against apps that aren't plain REST — and it's how real bounties on Google-scale
targets started.

## Talk track

"Most people skip what they can't read. The app's own JavaScript is the Rosetta Stone — the AI reads it
for you. Then we bake the repeatable part into a plugin so it's deterministic and free. Explore with AI,
then harden into a tool: that's the whole philosophy of this workshop."
