# QuickSSRF plugin spec reference

The typed spec is published as the npm package `@caido-community/quickssrf`. Import
the `Spec` type and pass it to the client so every call is type-checked:

```ts
import type { Spec as QuickSSRFSpec } from "@caido-community/quickssrf";
const quickssrf = await client.plugin.pluginPackage<QuickSSRFSpec>("quickssrf");
// `quickssrf` is undefined if the plugin is not installed on the instance.
```

Source of truth: https://github.com/caido-community/quickssrf (`packages/shared/src`).

## Result type

Every function returns a `Result<T>`. Check `.kind` before reading the value:

```ts
type Result<T> =
  | { kind: "Ok"; value: T }
  | { kind: "Error"; error: string };
```

When called through the SDK handle, every function returns a `Promise` (even the
ones typed as synchronous in the spec), so always `await`.

## Functions (API)

Session functions used to get an SSRF URL:

| Function | Signature | Notes |
| --- | --- | --- |
| `createSession` | `(providerId?: string) => Result<Session>` | Omit `providerId` to let the backend pick the default provider. `session.url` is the SSRF/OAST URL. |
| `getSessions` | `() => Result<Session[]>` | |
| `getSession` | `(sessionId) => Result<Session>` | |
| `deleteSession` | `(sessionId) => Result<void>` | |
| `stopSession` | `(sessionId) => Result<void>` | |
| `resumeSession` | `(sessionId) => Result<void>` | |
| `pollSession` | `(sessionId) => Result<Interaction[]>` | One-shot poll instead of subscribing. |
| `updateSessionTitle` | `(sessionId, title) => Result<Session>` | |
| `getActiveSessionIds` | `() => Result<string[]>` | |

Provider functions (OAST backends: `interactsh`, `webhooksite`, `postbin`, `custom`):

| Function | Signature |
| --- | --- |
| `getProviders` | `() => Result<Provider[]>` |
| `getProvider` | `(providerId) => Result<Provider>` |
| `addProvider` | `(input: CreateProvider) => Result<Provider>` |
| `updateProvider` | `(providerId, updates: UpdateProvider) => Result<Provider>` |
| `deleteProvider` | `(providerId) => Result<void>` |

Interaction + polling + config functions also exist: `getInteractions(sessionId)`,
`deleteInteraction`, `clearInteractions`, `getConfig`, `updateConfig`,
`startPolling`, `stopPolling`, `getPollingStatus`.

## Events

Subscribe with `quickssrf.subscribeEvent("<name>")`, which yields a tuple per event.
Break out of the `for await` loop to unsubscribe.

```ts
for await (const [event] of quickssrf.subscribeEvent("interaction:received")) {
  // event: { sessionId: string; interactions: Interaction[] }
}
```

Available events: `session:created`, `session:updated`, `session:deleted`,
`interaction:received`, `provider:created`, `provider:updated`,
`provider:deleted`, `config:updated`.

## Shapes

```ts
type Session = {
  id: string;
  providerId: string;
  providerKind: "interactsh" | "webhooksite" | "postbin" | "custom";
  title: string;
  url: string;           // <- the SSRF URL
  status: "active" | "polling" | "stopped" | "expired" | "error";
  createdAt: string;
  interactionCount: number;
};

type Provider = {
  id: string;
  name: string;
  kind: "interactsh" | "webhooksite" | "postbin" | "custom";
  url: string;
  token?: string;
  enabled: boolean;
};

type Interaction = {
  id: string;
  sessionId: string;
  index: number;
  protocol: "dns" | "http" | "https" | "smtp" | "smtps" | "ftp" | "ftps" | "smb" | "ldap" | "responder" | "unknown";
  rawRequest: string;
  rawResponse: string;
  remoteAddress: string;
  timestamp: string;
  uniqueId: string;
  fullId: string;
  qType?: string;
};
```
