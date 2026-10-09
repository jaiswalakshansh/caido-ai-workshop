# Demo 09 — gRPC-web / protobuf decode & tamper on a live target  🔴 the genuinely hard one

Modern apps increasingly speak **gRPC-web / Connect / protobuf** or Google's `batchexecute` instead of
plain JSON. The bodies are **binary / opaque**, so most hunters skip them — which means the bugs behind
them are untouched. You can't fuzz what you can't read. **The AI reads the app's own JavaScript to
recover the message schema, decodes the request, lets you tamper fields in Replay, and re-encodes.**
This is the "hacking Google" technique, generalized to any gRPC-web target.

**Plugins:** [`JS-Analyzer`](https://github.com/caido-community/JS-Analyzer) (pull & analyze JS/static
files), plus `caido-rpc-mapper` pattern for `batchexecute`.
**MCP tools:** `caido_list_requests`, `caido_get_request`, `caido_convert_body`, `caido_send_request`, `caido_edit_request`.

## Why it's (really) hard to automate

- A protobuf body is just tag-length-value bytes with **no field names** — field numbers/types live only
  in the `.proto` or compiled into the minified JS. Generic tools show you gibberish. Recovering the
  schema means *reading the client code*, which is exactly what an LLM is good at and a scanner is not.
- `batchexecute?rpcids=...` hides the RPC name and arg layout in JS maps. Same story.

## Setup

1. Proxy a session with the live target through Caido so its **JS bundles** and gRPC/`batchexecute`
   calls are captured in history. Install **JS-Analyzer** to help collect/inspect the JS.
2. Pick one opaque request: a `application/grpc-web(+proto|-text)` call, a Connect RPC, or a
   `POST /_/.../batchexecute?rpcids=XXXX`.

## Run it

**Step 1 — recover the schema from JS:**
```
Request <ID> is a gRPC-web/protobuf (or batchexecute rpcids=XXXX) call to a live target. Read the app's JavaScript in caido history (JS-Analyzer output / the captured .js files) and reconstruct the message schema for this RPC: the RPC/method name, each field's number, type, and meaning, for request AND response. Show the decoded version of the captured request body.
```

**Step 2 — tamper a field and re-encode:**
```
I want to change <field, e.g. the user_id / role / amount>. Produce the modified request body (correctly protobuf/grpc-web encoded), create a Caido replay session with it, but DON'T send — I'll fire it. If base64/grpc-web framing is involved, show the exact bytes and framing.
```
(For `batchexecute`, the AI edits the `f.req` structure and the `rpcids` as needed.)

**Step 3 — test for impact in Replay:** fire the tampered call yourself and watch for IDOR (other users'
objects via a changed id), privilege fields the UI never exposes, or parameter tampering the JSON API
would have validated but the RPC path doesn't.

**Step 4 — make it deterministic (save tokens):** once the mapping is known, have the AI build a Caido
plugin that resolves/decodes these RPCs automatically (the `caido-rpc-mapper` pattern), grounded on
`https://github.com/caido/doc-developer`.

## Human-in-the-loop & safety

- Decoding/encoding is passive; **you** fire tampered calls, on in-scope targets only.
- Treat state-changing RPCs like any other dangerous verb — explicit go, test accounts.

## Success / impact

You can now read and tamper a protocol the rest of the app's testers couldn't touch — IDOR/authz/param
bugs behind gRPC are frequently Critical precisely because they're assumed "unreachable." This is how
real bounties on Google-scale targets started.

## Talk track

"Everyone skips the binary blobs. But the app's own JavaScript has to know how to build them — so the AI
reads that JS and hands me the decoded message. Now I can tamper a gRPC call like it was plain JSON. That
unlocked surface is where the uncontested bugs live."
