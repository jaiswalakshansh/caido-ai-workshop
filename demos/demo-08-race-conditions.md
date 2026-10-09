# Demo 08 — Race conditions / limit bypass  🟠 HIGH

Fire many identical requests with a **synchronized last-byte send** so they hit the server inside the
same tiny window — bypassing "once only" limits (coupon reuse, double-spend, over-withdraw, invite/vote
stuffing, 2FA brute windows).
**Bridge:** MCP (`caido_race_window_send`). **Targets:** TOCTOU race conditions.

## The idea

Many "single-use" checks are **check-then-act** with a gap between them. If N requests arrive together,
several pass the check before any commits the state change → the limit is applied once but the effect
happens N times. `caido_race_window_send` sends raw HTTP/1.1 requests with last-byte synchronization
(the proven single-packet / last-byte technique), which Caido does at the socket level.

## Setup

1. Find a **single-use, state-changing** action you're authorized to test. Good candidates:
   - redeem a coupon / gift code
   - apply store credit / withdraw / transfer
   - accept a one-time invite, claim a limited item, cast a vote
2. Capture one successful such request in Caido (you'll race copies of it).

## Run it

```
Request <ID> redeems a one-time coupon. Using caido_race_window_send, send 20 copies of this exact request with synchronized last-byte delivery (single race window). Then show me, from the responses and from re-reading account state, whether the coupon was applied more than once. Do not modify the body except where I tell you.
```

If the action needs fresh state each run, reset between attempts (new coupon, re-login) and repeat.

## Why AI + Caido wins here

- `caido_race_window_send` handles the hard part (socket-level last-byte sync) deterministically — the
  LLM can't reliably hand-roll timing, so this is exactly the "use proven tooling" lesson.
- The model reads the batch of responses and the post-state to judge success, and writes it up.

## Human-in-the-loop & safety

- Races change state **for real**. Only run on test accounts / test coupons you own, in scope.
- Agree the request and the copy-count **before** firing; the agent should not escalate verbs or counts
  on its own.

## Success / impact

A single-use benefit applied multiple times (e.g. one coupon redeemed 5×, balance over-withdrawn).
Payment/limit races are commonly High–Critical.

## Talk track

"The LLM is terrible at microsecond timing — so we don't ask it to. Caido's last-byte sender does the
race deterministically; the AI just orchestrates and reads the result. Proven tool + smart driver."
