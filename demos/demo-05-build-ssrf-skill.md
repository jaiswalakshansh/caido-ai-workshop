# Demo 05 — Build a skill that drives a Caido plugin (QuickSSRF)

**Goal:** go from *using* skills to *building* one — a CLI that talks to a Caido **plugin** via the SDK + PAT.
**Time:** ~10–15 min. **Bridge:** Skill (you create it). **Targets:** reusable tooling (sets up demo 07).

## Prereqs

- QuickSSRF installed in Caido (Plugins → Store → QuickSSRF).
- A PAT exported: `export CAIDO_PAT=caido_...`.

## Option A — use the finished skill (shipped in this repo)

```bash
cd skills/caido-quickssrf/scripts
npm install
CAIDO_PAT=$CAIDO_PAT npm run --silent ssrf          # prints an SSRF URL
CAIDO_PAT=$CAIDO_PAT npx tsx quickssrf.ts --watch    # also stream DNS/HTTP hits
```

## Option B — build it live with Claude (the real demo)

Fresh `claude`, then the grounding prompt (note **port 8080**, not the slides' 8082):
```
We are creating a skill for claude. The goal is to use the Caido plugin quickssrf. Create a cli using the sdk client with PAT. This script should use the quickssrf spec to call the plugin and retrieve a SSRF URL. Instance is running on: localhost:8080; https://github.com/caido-community/quickssrf; https://developer.caido.io/client-sdk/guides/install.html; https://developer.caido.io/client-sdk/guides/base_setup.html; https://developer.caido.io/client-sdk/guides/spec_typing.html;
```
Then:
```
Grab a quickssrf url
```

## The pattern to teach

1. **Ground the agent on real docs** (the SDK guide URLs + the plugin repo) so it doesn't hallucinate the API.
2. It should **verify against the installed packages**, not guess — i.e. install `@caido/sdk-client`
   and `@caido-community/quickssrf`, read their types, then write code that typechecks.
3. The runtime flow it produces:
   ```ts
   const client = new Client({ url, auth: { pat, cache: { file } } });
   await client.connect();                                  // polls /health, authenticates
   const pkg = await client.plugin.pluginPackage("quickssrf");
   const session = await pkg.createSession();               // call with NO arg if no provider
   console.log(session.value.url);                          // the SSRF URL
   // pkg.subscribeEvent("interaction:received")            // for --watch
   ```

## Gotcha baked into the shipped skill

`createSession(undefined)` serializes the arg as JSON `null`, which the backend rejects. Call
`createSession()` with **no argument** when no provider is chosen. (Already fixed in `quickssrf.ts`.)

## Talk track

"This is de-sloppified skill building: fetch the docs, verify against the real packages, ship something
that compiles — then it's yours, reusable, and extends to *any* Caido plugin. We'll weaponize it next."
