#!/usr/bin/env -S npx tsx
/**
 * quickssrf-url — generate an out-of-band SSRF URL from Caido's QuickSSRF plugin.
 *
 * Connects to a running Caido instance with the client SDK (authenticating with a
 * Personal Access Token), loads the typed QuickSSRF plugin spec, creates a session,
 * and prints the generated OAST/SSRF URL. With --watch it then streams any
 * interactions (DNS/HTTP/etc.) that hit that URL.
 *
 * Usage:
 *   CAIDO_PAT=<token> npx tsx quickssrf.ts [options]
 *
 * Options:
 *   --url <url>          Caido instance URL        (env CAIDO_INSTANCE_URL, default http://localhost:8080)
 *   --provider <id>      Use a specific provider id (default: let the backend choose)
 *   --provider-kind <k>  Pick the first enabled provider of this kind
 *                        (interactsh | webhooksite | postbin | custom)
 *   --watch              Keep listening and print interactions as they arrive
 *   --json               Print the session as JSON instead of a human-readable line
 *   -h, --help           Show this help
 */
import { Client } from "@caido/sdk-client";
import type { Spec as QuickSSRFSpec } from "@caido-community/quickssrf";

type Args = {
  url: string;
  provider?: string;
  providerKind?: string;
  watch: boolean;
  json: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    url: process.env["CAIDO_INSTANCE_URL"] ?? "http://localhost:8080",
    watch: false,
    json: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--url":
        args.url = argv[++i] ?? args.url;
        break;
      case "--provider":
        args.provider = argv[++i];
        break;
      case "--provider-kind":
        args.providerKind = argv[++i];
        break;
      case "--watch":
        args.watch = true;
        break;
      case "--json":
        args.json = true;
        break;
      case "-h":
      case "--help":
        args.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

const HELP = `quickssrf-url — generate an SSRF URL from Caido's QuickSSRF plugin

Env:
  CAIDO_PAT            Personal Access Token (required)
  CAIDO_INSTANCE_URL   Caido instance URL (default http://localhost:8080)

Options:
  --url <url>          Override the instance URL
  --provider <id>      Use a specific provider id
  --provider-kind <k>  Pick the first enabled provider of a kind
                       (interactsh | webhooksite | postbin | custom)
  --watch              Stream interactions after creating the session
  --json               Print the session object as JSON
  -h, --help           Show this help
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }

  const pat = process.env["CAIDO_PAT"];
  if (!pat) {
    throw new Error(
      "CAIDO_PAT is not set. Create a Personal Access Token in Caido and export it:\n" +
        "  export CAIDO_PAT=<token>",
    );
  }

  const client = new Client({
    url: args.url,
    auth: {
      pat,
      // Cache tokens so repeat runs skip the device-authorization flow.
      cache: { file: ".caido-token.json" },
    },
  });

  // connect() polls /health until the instance is ready, then authenticates.
  await client.connect();

  // Load the typed QuickSSRF plugin handle. undefined means it isn't installed.
  const quickssrf = await client.plugin.pluginPackage<QuickSSRFSpec>("quickssrf");
  if (quickssrf === undefined) {
    throw new Error(
      "QuickSSRF is not installed on this instance. Install it from the Caido plugin store.",
    );
  }

  // Resolve which provider to use, if the caller asked for a specific one.
  let providerId = args.provider;
  if (!providerId && args.providerKind) {
    const providers = await quickssrf.getProviders();
    if (providers.kind === "Error") {
      throw new Error(`getProviders failed: ${providers.error}`);
    }
    const match = providers.value.find(
      (p) => p.kind === args.providerKind && p.enabled,
    );
    if (!match) {
      throw new Error(
        `No enabled provider of kind "${args.providerKind}". Available: ` +
          providers.value.map((p) => `${p.name} (${p.kind})`).join(", "),
      );
    }
    providerId = match.id;
  }

  // Create a session — this registers with the OAST provider and returns the URL.
  // Pass no argument when no provider was chosen: sending `undefined` would be
  // serialized as JSON `null`, which the backend rejects (it wants a string).
  const session =
    providerId === undefined
      ? await quickssrf.createSession()
      : await quickssrf.createSession(providerId);
  if (session.kind === "Error") {
    throw new Error(`createSession failed: ${session.error}`);
  }

  if (args.json) {
    process.stdout.write(JSON.stringify(session.value, null, 2) + "\n");
  } else {
    process.stdout.write(`SSRF URL: ${session.value.url}\n`);
    process.stderr.write(
      `(session ${session.value.id}, provider ${session.value.providerKind})\n`,
    );
  }

  if (!args.watch) {
    return;
  }

  process.stderr.write("Watching for interactions (Ctrl-C to stop)...\n");
  for await (const [event] of quickssrf.subscribeEvent("interaction:received")) {
    if (event.sessionId !== session.value.id) continue;
    for (const interaction of event.interactions) {
      const qType = interaction.qType ? ` ${interaction.qType}` : "";
      process.stdout.write(
        `\n=== [${interaction.timestamp}] ${interaction.protocol.toUpperCase()}${qType} ` +
          `from ${interaction.remoteAddress} (${interaction.fullId}) ===\n`,
      );
      // rawRequest carries the full HTTP request (method, path, headers, body)
      // for HTTP/S, or the decoded query for DNS. Print it so headers are visible.
      if (interaction.rawRequest.trim().length > 0) {
        process.stdout.write("--- request ---\n" + interaction.rawRequest + "\n");
      }
      if (interaction.rawResponse.trim().length > 0) {
        process.stdout.write("--- response ---\n" + interaction.rawResponse + "\n");
      }
    }
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
