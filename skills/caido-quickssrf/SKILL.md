---
name: caido-quickssrf
description: >-
  Generate an out-of-band SSRF / OAST payload URL from the QuickSSRF plugin
  running in a Caido instance, via a headless CLI built on the Caido client SDK
  authenticated with a Personal Access Token (PAT). Use this whenever the user
  wants an SSRF test URL, OAST/OOB interaction URL, a "Collaborator-style"
  callback URL, or wants to script QuickSSRF (create a session, fetch the
  payload URL, or watch incoming DNS/HTTP interactions) from the command line
  instead of the Caido GUI — even if they only say "give me an SSRF URL",
  "interactsh URL", "oast url", or mention QuickSSRF, Caido, or OOB testing.
---

# Caido QuickSSRF CLI

Produce an SSRF/OAST URL by driving the QuickSSRF Caido plugin from a script. The
CLI authenticates to a Caido instance with a Personal Access Token, loads the
typed QuickSSRF plugin spec, creates a session, and prints `session.url` — the
payload URL you put into the target application. Optionally it keeps streaming the
interactions (DNS, HTTP, …) that hit that URL.

This is for authorized security testing. QuickSSRF is Caido's out-of-band
interaction monitor; the URL is a canary you place in a request you are
permitted to test, exactly like Burp Collaborator.

## Prerequisites

- **Node.js 18+** (the workshop uses 24) and a package manager (`npm`/`pnpm`/`yarn`).
- **A running Caido instance.** Default `http://localhost:8080`. Verify it is up:
  `curl -s http://localhost:8080/health` should return `{"...","ready":true}`.
- **QuickSSRF installed** in that instance (Caido → Plugins → Store → "QuickSSRF").
- **A Personal Access Token (PAT).** Create it in Caido → Developer → Personal
  Access Tokens. The PAT drives an automatic device-authorization flow. Export it,
  never commit it:
  ```bash
  export CAIDO_PAT=<token>
  ```

## Setup

The runnable CLI lives in `scripts/`. From that directory:

```bash
cd scripts
npm install          # installs @caido/sdk-client + @caido-community/quickssrf
```

## Usage

```bash
# Generate an SSRF URL (backend picks the default provider):
CAIDO_PAT=<token> npm run --silent ssrf

# Equivalent direct invocation, with options:
CAIDO_PAT=<token> npx tsx quickssrf.ts [options]
```

Options:

- `--url <url>` — instance URL (default `$CAIDO_INSTANCE_URL` or `http://localhost:8080`).
- `--provider-kind <kind>` — pick the first enabled provider of a kind:
  `interactsh` | `webhooksite` | `postbin` | `custom`.
- `--provider <id>` — use a specific provider id.
- `--watch` — after printing the URL, stream interactions (full raw request/response) until Ctrl-C.
- `--json` — print the full session object instead of just the URL.

The SSRF URL is written to **stdout** (session metadata and status go to stderr),
so it is easy to capture:

```bash
SSRF_URL=$(CAIDO_PAT=$CAIDO_PAT npm run --silent ssrf)
```

## How it works (the SDK calls)

1. `new Client({ url, auth: { pat, cache: { file } } })` — construct the client.
   The `cache` file stores tokens so repeat runs skip re-authenticating.
2. `await client.connect()` — polls `/health` until ready, then authenticates.
3. `const pkg = await client.plugin.pluginPackage<QuickSSRFSpec>("quickssrf")` —
   the typed plugin handle (`undefined` if the plugin is not installed).
4. `await pkg.createSession(providerId?)` — returns `Result<Session>`; the SSRF URL
   is `session.value.url`. **Call it with no argument when no provider is chosen** —
   passing `undefined` serializes to JSON `null`, which the backend rejects.
5. `pkg.subscribeEvent("interaction:received")` — async iterable of interactions
   (used by `--watch`); filter events by `session.value.id`.

Every function returns a `Result<T>` (`{ kind: "Ok", value } | { kind: "Error", error }`),
and through the SDK handle every call returns a `Promise`, so always `await` and
check `.kind === "Error"` before reading `.value`. Full spec in
`references/quickssrf-api.md`.

## Troubleshooting

- **`CAIDO_PAT is not set`** — export the token (see Prerequisites).
- **`QuickSSRF is not installed`** — install the plugin in the instance.
- **`connect()` hangs / health check fails** — wrong `--url`, or the instance
  isn't running. Confirm with the `curl .../health` check above.
- **`createSession failed: ...`** — the chosen OAST provider is unreachable or
  disabled. Try `--provider-kind interactsh`, or check Providers in the plugin UI.
- **`postbin` provider** — those bins expire after ~30 minutes.
