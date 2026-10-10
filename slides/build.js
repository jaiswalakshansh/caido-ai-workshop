// Generator for "Your AI Needs a Proxy" deck. Run: node build.js
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
p.author = "jaiswalakshansh";
p.title = "Your AI Needs a Proxy";

// ---- palette ----
const BG = "0E1116", PANEL = "161B22", LINE = "30363D";
const TX = "E6EDF3", MUT = "8B949E";
const ACC = "FB7E14";   // Caido orange
const GRN = "3FB950";   // success / skill
const DAN = "F85149";   // critical
const LBG = "FFFFFF", LTX = "11161D", LMUT = "57606A", LPANEL = "F3F5F8";
const HFONT = "Century Schoolbook", BFONT = "Calibri", MONO = "Courier New";

const W = 13.33, H = 7.5, MX = 0.7;
const notes = {};
function tb(extra) { return Object.assign({ isTextBox: true, margin: 0 }, extra); }

// ---- slide helpers ----
function bgFill(slide, color) { slide.background = { color }; }

// dark title / divider / closing title block
function kicker(slide, text, color, x, y, w) {
  slide.addText(text.toUpperCase(), tb({ x, y, w: w || 4, h: 0.3, fontFace: BFONT,
    bold: true, color, fontSize: 12, charSpacing: 3 }));
}

// Content slide header (light bg), consistent position across content slides
function contentHeader(slide, kick, title) {
  kicker(slide, kick, ACC, MX, 0.5, 8);
  slide.addText(title, tb({ x: MX, y: 0.82, w: W - 2 * MX, h: 0.9, fontFace: HFONT,
    bold: true, color: LTX, fontSize: 32, align: "left" }));
}
function darkHeader(slide, kick, title) {
  kicker(slide, kick, ACC, MX, 0.5, 8);
  slide.addText(title, tb({ x: MX, y: 0.82, w: W - 2 * MX, h: 0.9, fontFace: HFONT,
    bold: true, color: TX, fontSize: 32, align: "left" }));
}

// numbered chip (filled circle with number) — the repeated motif
function chip(slide, n, x, y, color) {
  slide.addShape(p.ShapeType.ellipse, { x, y, w: 0.5, h: 0.5, fill: { color },
    line: { type: "none" } });
  slide.addText(String(n), tb({ x, y, w: 0.5, h: 0.5, align: "center", valign: "middle",
    bold: true, color: "0E1116", fontSize: 18, fontFace: BFONT }));
}

// ============ 1. TITLE ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  s.addText("YOUR AI NEEDS A PROXY", tb({ x: MX, y: 2.35, w: 11, h: 1.1, fontFace: HFONT,
    bold: true, color: TX, fontSize: 52 }));
  s.addText([{ text: "De-sloppify AI-assisted hacking with ", options: { color: MUT } },
             { text: "Caido", options: { color: ACC, bold: true } }],
    tb({ x: MX, y: 3.5, w: 11, h: 0.5, fontFace: BFONT, fontSize: 20 }));
  // mono command line as motif
  s.addShape(p.ShapeType.roundRect, { x: MX, y: 4.5, w: 8.6, h: 0.7, rectRadius: 0.06,
    fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText([{ text: "$ ", options: { color: GRN } },
             { text: "curl ", options: { color: TX } },
             { text: "-x 127.0.0.1:8080", options: { color: ACC } },
             { text: " target.com", options: { color: MUT } }],
    tb({ x: MX + 0.25, y: 4.5, w: 8.2, h: 0.7, valign: "middle", fontFace: MONO, fontSize: 18 }));
  s.addText("Claude Code  ·  MCP & Skills  ·  real critical/high bugs",
    tb({ x: MX, y: 6.6, w: 8, h: 0.4, color: MUT, fontFace: BFONT, fontSize: 13 }));
  // QR to the repo (white panel for scan contrast)
  const qx = 10.25, qy = 2.1, qs = 2.25;
  s.addShape(p.ShapeType.roundRect, { x: qx - 0.18, y: qy - 0.18, w: qs + 0.36, h: qs + 0.36,
    rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { type: "none" } });
  s.addImage({ path: "assets-qr.png", x: qx, y: qy, w: qs, h: qs });
  s.addText("Scan → the workshop repo", tb({ x: qx - 0.4, y: qy + qs + 0.28, w: qs + 1.1, h: 0.35,
    align: "center", color: TX, fontFace: BFONT, fontSize: 12, bold: true }));
  s.addText("github.com/jaiswalakshansh/caido-ai-workshop", tb({ x: qx - 0.6, y: qy + qs + 0.6, w: qs + 1.5, h: 0.35,
    align: "center", color: MUT, fontFace: MONO, fontSize: 9 }));
  s.addNotes("Hook: everyone's letting AI fire blind curl at targets. Let's make it observable, safe, and actually good at finding bugs. Point out the QR for the repo.");
})();

// ============ section divider factory ============
function sectionSlide(num, part, title, sub) {
  const s = p.addSlide(); bgFill(s, BG);
  chip(s, num, MX, 2.6, ACC);
  kicker(s, part, ACC, MX + 0.75, 2.62, 6);
  s.addText(title, tb({ x: MX, y: 3.2, w: 11.5, h: 1.0, fontFace: HFONT, bold: true,
    color: TX, fontSize: 44 }));
  if (sub) s.addText(sub, tb({ x: MX, y: 4.3, w: 11, h: 0.5, color: MUT, fontFace: BFONT, fontSize: 18 }));
  return s;
}

// ============ 2. PART 1 ============
sectionSlide(1, "Part 1", "Why?", "What professional testing requires — and how AI throws it away")
  .addNotes("Set the stakes before any tooling.");

// ============ 3. Why a proxy ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Part 1 · Why", "A proxy gives you the non-negotiables");
  const items = [
    ["Scope", "Fence testing to allowed hosts and paths"],
    ["Inspection", "Manually check every request and response"],
    ["Rate limiting", "Throttle so you don't hammer the target"],
    ["Full logging", "Every byte of traffic, kept for the report"],
  ];
  let y = 2.1;
  items.forEach((it, i) => {
    s.addShape(p.ShapeType.roundRect, { x: MX, y, w: W - 2 * MX, h: 1.0, rectRadius: 0.05,
      fill: { color: LPANEL }, line: { type: "none" } });
    s.addShape(p.ShapeType.ellipse, { x: MX + 0.25, y: y + 0.25, w: 0.5, h: 0.5, fill: { color: ACC }, line: { type: "none" } });
    s.addText(String(i + 1), tb({ x: MX + 0.25, y: y + 0.25, w: 0.5, h: 0.5, align: "center", valign: "middle", bold: true, color: "FFFFFF", fontSize: 18 }));
    s.addText(it[0], tb({ x: MX + 1.0, y: y + 0.14, w: 3.2, h: 0.4, bold: true, color: LTX, fontSize: 18, fontFace: BFONT }));
    s.addText(it[1], tb({ x: MX + 4.2, y: y + 0.14, w: 7.0, h: 0.7, color: LMUT, fontSize: 15, fontFace: BFONT, valign: "middle" }));
    y += 1.15;
  });
  s.addNotes("These are table stakes for pro testing.");
})();

// ============ 4. Why AI ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  kicker(s, "Part 1 · Why", ACC, MX, 0.5, 8);
  s.addText("Make it go", tb({ x: MX, y: 2.4, w: 11, h: 1, fontFace: HFONT, bold: true, color: TX, fontSize: 40 }));
  s.addText("brrrrrrrr", tb({ x: MX, y: 3.3, w: 11, h: 1.3, fontFace: HFONT, bold: true, color: ACC, fontSize: 80 }));
  s.addText("AI is the accelerant — speed and scale. But…", tb({ x: MX, y: 4.9, w: 11, h: 0.5, color: MUT, fontSize: 18, fontFace: BFONT }));
  s.addNotes("AI is the accelerant. But it costs you the fundamentals unless you keep the proxy.");
})();

// ============ 5. Re-learning the lessons ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Part 1 · Why", "Bolt on AI and you lose all five — unless it goes through the proxy");
  const cards = [
    ["Observability", "Log all traffic — for the report"],
    ["Search", "A searchable DB of that traffic"],
    ["Tools", "Reuse proven, deterministic tooling"],
    ["Scope", "Don't hack the planet, don't drop tables"],
    ["Human in the loop", "Stay able to take over easily"],
  ];
  const cw = 3.78, ch = 1.9, gap = 0.28;
  cards.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = MX + col * (cw + gap), y = 2.2 + row * (ch + gap);
    s.addShape(p.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.05, fill: { color: LPANEL }, line: { type: "none" } });
    s.addText(String(i + 1), tb({ x: x + 0.25, y: y + 0.2, w: 0.8, h: 0.6, bold: true, color: ACC, fontSize: 30, fontFace: HFONT }));
    s.addText(c[0], tb({ x: x + 0.25, y: y + 0.85, w: cw - 0.5, h: 0.4, bold: true, color: LTX, fontSize: 17, fontFace: BFONT }));
    s.addText(c[1], tb({ x: x + 0.25, y: y + 1.25, w: cw - 0.5, h: 0.55, color: LMUT, fontSize: 13, fontFace: BFONT }));
  });
  s.addNotes("The five lessons. This is the thesis: the AI must go THROUGH the proxy.");
})();

// ============ 6. PART 2 ============
sectionSlide(2, "Part 2", "How?", "The architecture: two bridges and a loop")
  .addNotes("Now the how.");

// ============ 7. The primitive ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  darkHeader(s, "Part 2 · How", "Any tool with a proxy flag feeds Caido");
  const cmds = [
    ["$ curl -x 127.0.0.1:8080 target.com", "route curl's traffic through Caido"],
    ["$ curl -x 127.0.0.1:8080 -c jar.txt target.com", "persist cookies across calls"],
  ];
  let y = 2.4;
  cmds.forEach(c => {
    s.addShape(p.ShapeType.roundRect, { x: MX, y, w: 9.8, h: 0.8, rectRadius: 0.06, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(c[0], tb({ x: MX + 0.3, y, w: 9.4, h: 0.8, valign: "middle", fontFace: MONO, color: TX, fontSize: 16 }));
    s.addText(c[1], tb({ x: MX, y: y + 0.85, w: 10, h: 0.4, color: MUT, fontFace: BFONT, fontSize: 14, italic: true }));
    y += 1.5;
  });
  s.addText("Browser, curl, or the AI agent — all become inspectable Caido traffic.",
    tb({ x: MX, y: 5.7, w: 11, h: 0.5, color: ACC, fontFace: BFONT, fontSize: 16, bold: true }));
  s.addNotes("The key primitive. If it supports a proxy, it can feed Caido.");
})();

// ============ 8. two bridges ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Part 2 · How", "Two bridges from the agent to Caido");
  const col = [
    ["MCP", ACC, "A server of typed tools", ["~66 Tools + 6 Resources", "Standardized protocol", "Zero build — just register", "All schemas live in context"]],
    ["Skills", GRN, "A SKILL.md + a CLI", ["Instructions load on demand", "Agent pipes CLI commands", "Lean on tokens", "You must build the CLI"]],
  ];
  col.forEach((c, i) => {
    const x = MX + i * 6.0;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.1, w: 5.6, h: 4.6, rectRadius: 0.04, fill: { color: LPANEL }, line: { type: "none" } });
    s.addShape(p.ShapeType.ellipse, { x: x + 0.4, y: 2.45, w: 0.55, h: 0.55, fill: { color: c[1] }, line: { type: "none" } });
    s.addText(c[0], tb({ x: x + 1.15, y: 2.45, w: 4, h: 0.55, bold: true, color: LTX, fontSize: 24, fontFace: HFONT, valign: "middle" }));
    s.addText(c[2], tb({ x: x + 0.4, y: 3.1, w: 5, h: 0.4, color: c[1], bold: true, fontSize: 14, fontFace: BFONT }));
    s.addText(c[3].map((t, j) => ({ text: t, options: { bullet: { indent: 15 }, color: LTX, fontSize: 14, fontFace: BFONT, breakLine: true, paraSpaceAfter: 8 } })),
      tb({ x: x + 0.45, y: 3.6, w: 5.0, h: 2.9 }));
  });
  s.addNotes("Both let Claude drive Caido. Different mechanism, different cost.");
})();

// ============ 9. MCP on the wire ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  darkHeader(s, "Part 2 · How", "MCP on the wire: discoverable, but heavy");
  s.addShape(p.ShapeType.roundRect, { x: MX, y: 2.1, w: 11.9, h: 3.1, rectRadius: 0.04, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  const lines = [
    ["→ SENT:  ", GRN, '{ "method": "tools/list" }'],
    ["", TX, ""],
    ["← RECV:  ", ACC, '{ "tools": [ { "name": "caido_send_request", ... }, ... x66 ] }'],
  ];
  let y = 2.4;
  lines.forEach(l => {
    if (l[0] === "" && l[2] === "") { y += 0.35; return; }
    s.addText([{ text: l[0], options: { color: l[1], bold: true } }, { text: l[2], options: { color: TX } }],
      tb({ x: MX + 0.35, y, w: 11.2, h: 0.5, fontFace: MONO, fontSize: 15, valign: "middle" }));
    y += 0.7;
  });
  s.addText("All ~66 tool schemas now live in the model's context — great discoverability, real token cost.",
    tb({ x: MX, y: 5.5, w: 11.5, h: 0.6, color: ACC, bold: true, fontFace: BFONT, fontSize: 16 }));
  s.addNotes("Remember this: the whole tool list sits in context. That's the catch.");
})();

// ============ 10. Skills vs MCP decision ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Part 2 · How", "Which bridge? Measure it, don't guess");
  const rows = [
    ["", "Skills", "MCP"],
    ["Context cost", "Low — on demand", "High — all tools loaded"],
    ["Setup", "Install folder + CLI", "Register a server"],
    ["Style", "Pipe CLI commands", "Call typed tools"],
    ["Best for", "Token efficiency, custom", "Fast, broad access"],
  ];
  const x = MX, y0 = 2.2, cw = [3.1, 4.4, 4.4], rh = 0.72;
  rows.forEach((r, ri) => {
    let cx = x;
    r.forEach((cell, ci) => {
      const head = ri === 0, keycol = ci === 0;
      const fill = head ? LTX : (keycol ? LPANEL : "FFFFFF");
      s.addShape(p.ShapeType.rect, { x: cx, y: y0 + ri * rh, w: cw[ci], h: rh, fill: { color: fill }, line: { color: "E1E4E8", width: 1 } });
      const color = head ? "FFFFFF" : (keycol ? LTX : LMUT);
      s.addText(cell, tb({ x: cx + 0.18, y: y0 + ri * rh, w: cw[ci] - 0.3, h: rh, valign: "middle",
        bold: head || keycol, color: (head && ci === 1) ? GRN : (head && ci === 2) ? ACC : color, fontSize: 14, fontFace: BFONT }));
      cx += cw[ci];
    });
  });
  s.addText("Rule of thumb: MCP to start fast; Skills to save tokens and go custom. Prove it live with /cost.",
    tb({ x: MX, y: 6.1, w: 11.8, h: 0.5, color: LTX, bold: true, fontSize: 15, fontFace: BFONT }));
  s.addNotes("We measure this in demo 03.");
})();

// ============ 11. the loop ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  darkHeader(s, "Part 2 · How", "An agent is a fancy loop");
  const steps = ["Prompt\n(the task)", "Tools / Skills\n(the hands)", "Loop\nuntil done"];
  steps.forEach((t, i) => {
    const x = MX + i * 4.1;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.7, w: 3.5, h: 1.6, rectRadius: 0.06, fill: { color: PANEL }, line: { color: ACC, width: 1.5 } });
    s.addText(t, tb({ x: x + 0.2, y: 2.7, w: 3.1, h: 1.6, align: "center", valign: "middle", color: TX, bold: true, fontSize: 18, fontFace: BFONT }));
    if (i < 2) s.addText("→", tb({ x: x + 3.55, y: 2.7, w: 0.5, h: 1.6, align: "center", valign: "middle", color: ACC, fontSize: 30 }));
  });
  s.addText("Leverage = the tools you put in the loop. This whole workshop is about those tools.",
    tb({ x: MX, y: 5.1, w: 11.5, h: 0.5, color: MUT, fontFace: BFONT, fontSize: 16, italic: true }));
  s.addNotes("That's all an agent is. The intelligence is the model; the leverage is the tools.");
})();

// ============ 12. scale ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Part 2 · How", "Scale it — one searchable history");
  s.addText([
    { text: "Agents on a VPS  →  Caido proxy  →  target", options: { bold: true, color: LTX, fontSize: 20, fontFace: BFONT, breakLine: true, paraSpaceAfter: 14 } },
    { text: "Fan out: many agents, many VPSs — all funneling through Caido", options: { color: LMUT, fontSize: 16, fontFace: BFONT, breakLine: true, paraSpaceAfter: 14 } },
    { text: "Still observable, still scoped: every request lands in one HTTPQL-searchable database", options: { color: ACC, bold: true, fontSize: 16, fontFace: BFONT } },
  ], tb({ x: MX, y: 2.6, w: 11.5, h: 3 }));
  s.addNotes("Make it go brrrr — still observable because it all lands in Caido.");
})();

// ============ 13. auth model ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  darkHeader(s, "Part 2 · How", "The auth model — where 90% of setup pain lives");
  const rows = [
    ["MCP server", "local access token / OAuth login", GRN],
    ["Skill / SDK", "PAT  (caido_…)", ACC],
  ];
  let y = 2.3;
  rows.forEach(r => {
    s.addShape(p.ShapeType.roundRect, { x: MX, y, w: 11.9, h: 1.0, rectRadius: 0.05, fill: { color: PANEL }, line: { type: "none" } });
    s.addText(r[0], tb({ x: MX + 0.3, y, w: 3.2, h: 1.0, valign: "middle", bold: true, color: r[2], fontSize: 18, fontFace: BFONT }));
    s.addText(r[1], tb({ x: MX + 3.6, y, w: 8, h: 1.0, valign: "middle", color: TX, fontSize: 17, fontFace: MONO }));
    y += 1.2;
  });
  s.addText([
    { text: "Gotchas:  ", options: { bold: true, color: DAN } },
    { text: "host must match the token (localhost ≠ 127.0.0.1)  ·  port must match your instance (8080, not 8082)", options: { color: TX } },
  ], tb({ x: MX, y: 5.2, w: 11.8, h: 0.8, fontFace: BFONT, fontSize: 15 }));
  s.addNotes("Different credentials for each bridge. Host and port mismatches are the classic failures.");
})();

// ============ 14. PART 3 ============
sectionSlide(3, "Part 3", "Practical", "github.com/jaiswalakshansh/caido-ai-workshop")
  .addNotes("Everything we run is in the repo.");

// ============ 15. connect ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Demos 01–02", "Connect — both bridges");
  const blocks = [
    ["MCP", ACC, ["build the Go server", "login (localhost, your port)", "claude mcp add -s user  ← user scope!", "test: What caido projects do I have"]],
    ["Skill", GRN, ["pnpm dlx skills add caido/skills", "npm i  (Node 24)", "export CAIDO_PAT=caido_…", "test: What caido projects do I have"]],
  ];
  blocks.forEach((b, i) => {
    const x = MX + i * 6.0;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.1, w: 5.6, h: 4.4, rectRadius: 0.04, fill: { color: LPANEL }, line: { type: "none" } });
    s.addText(b[0], tb({ x: x + 0.35, y: 2.35, w: 5, h: 0.5, bold: true, color: b[1], fontSize: 22, fontFace: HFONT }));
    s.addText(b[2].map((t, j) => ({ text: t, options: { bullet: { indent: 15 }, color: LTX, fontSize: 15, fontFace: BFONT, breakLine: true, paraSpaceAfter: 10 } })),
      tb({ x: x + 0.4, y: 3.0, w: 5.0, h: 3.3 }));
  });
  s.addNotes("Register MCP at USER scope or it only works in one folder.");
})();

// ============ 16. find the secret ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Demo 03", "Find the secret — and compare cost");
  s.addText([
    { text: "Proxy the browser → run the lab → ask:", options: { color: LMUT, fontSize: 15, fontFace: BFONT, breakLine: true, paraSpaceAfter: 10 } },
  ], tb({ x: MX, y: 2.0, w: 11, h: 0.5 }));
  s.addShape(p.ShapeType.roundRect, { x: MX, y: 2.5, w: 11.9, h: 0.75, rectRadius: 0.06, fill: { color: LTX }, line: { type: "none" } });
  s.addText("Check if there is a secret value in the caido history", tb({ x: MX + 0.3, y: 2.5, w: 11.3, h: 0.75, valign: "middle", color: "FFFFFF", fontFace: MONO, fontSize: 16 }));
  // two stat tiles
  const tiles = [["Skill", "5", "shell commands", GRN], ["MCP", "8", "tool calls", ACC]];
  tiles.forEach((t, i) => {
    const x = MX + i * 6.0;
    s.addShape(p.ShapeType.roundRect, { x, y: 3.7, w: 5.6, h: 2.4, rectRadius: 0.05, fill: { color: LPANEL }, line: { type: "none" } });
    s.addText(t[0], tb({ x: x + 0.35, y: 3.9, w: 5, h: 0.4, bold: true, color: t[3], fontSize: 18, fontFace: BFONT }));
    s.addText(t[1], tb({ x: x + 0.3, y: 4.2, w: 5, h: 1.2, bold: true, color: LTX, fontSize: 72, fontFace: HFONT, align: "center" }));
    s.addText(t[2], tb({ x: x + 0.3, y: 5.5, w: 5, h: 0.4, color: LMUT, fontSize: 14, fontFace: BFONT, align: "center" }));
  });
  s.addText("Same job, Skill is leaner. /cost + /context tell the story (pattern, not a fixed count).",
    tb({ x: MX, y: 6.3, w: 11.8, h: 0.4, color: LTX, bold: true, fontSize: 14, fontFace: BFONT }));
  s.addNotes("Context engineering is the cost story. On a subscription, read token counts not dollars.");
})();

// ============ 17. JS recon ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  darkHeader(s, "Demo 04", "JS recon → staged Replay sessions");
  s.addShape(p.ShapeType.roundRect, { x: MX, y: 2.1, w: 11.9, h: 1.0, rectRadius: 0.06, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText("Analyze file.js and create replay sessions for all endpoints. Don't fix the content length. Don't send requests.",
    tb({ x: MX + 0.3, y: 2.1, w: 11.3, h: 1.0, valign: "middle", color: TX, fontFace: MONO, fontSize: 14 }));
  const pts = [
    ["\"Don't fix content length\"", "exact reconstruction — tests precise instruction-following"],
    ["\"Don't send requests\"", "human-in-the-loop: the AI stages, you fire"],
    ["Output", "hidden endpoints + body shapes, incl. a staging host and a role field"],
  ];
  let y = 3.5;
  pts.forEach(pt => {
    s.addText(pt[0], tb({ x: MX, y, w: 4.5, h: 0.6, bold: true, color: ACC, fontSize: 15, fontFace: BFONT, valign: "top" }));
    s.addText(pt[1], tb({ x: MX + 4.6, y, w: 7.2, h: 0.7, color: TX, fontSize: 15, fontFace: BFONT }));
    y += 1.0;
  });
  s.addNotes("Reading the client is the highest-leverage recon — it feeds the impact demos.");
})();

// ============ 18. build ssrf skill ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Demo 05", "Build a skill that drives a Caido plugin");
  const steps = [
    ["Ground", "feed real SDK docs + the plugin repo"],
    ["Verify", "install the packages, read the types — don't guess"],
    ["Ship", "a CLI that typechecks and runs"],
  ];
  steps.forEach((st, i) => {
    const y = 2.2 + i * 1.3;
    s.addShape(p.ShapeType.ellipse, { x: MX, y, w: 0.7, h: 0.7, fill: { color: GRN }, line: { type: "none" } });
    s.addText(String(i + 1), tb({ x: MX, y, w: 0.7, h: 0.7, align: "center", valign: "middle", bold: true, color: "FFFFFF", fontSize: 24, fontFace: HFONT }));
    s.addText(st[0], tb({ x: MX + 1.0, y: y + 0.03, w: 3, h: 0.4, bold: true, color: LTX, fontSize: 19, fontFace: BFONT }));
    s.addText(st[1], tb({ x: MX + 1.0, y: y + 0.42, w: 10, h: 0.4, color: LMUT, fontSize: 15, fontFace: BFONT }));
  });
  s.addText("Result: the caido-quickssrf skill — reusable, extends to any Caido plugin.",
    tb({ x: MX, y: 6.2, w: 11.5, h: 0.4, color: GRN, bold: true, fontSize: 15, fontFace: BFONT }));
  s.addNotes("De-sloppified skill building: ground, verify, ship. Now it's yours.");
})();

// ============ 19. PART 4 ============
sectionSlide(4, "Part 4", "Impact", "The bugs that pay — what most AI-hacking talks skip")
  .addNotes("This is the part that earns its keep.");

// ============ impact slide factory ============
function impactSlide(demo, title, sev, sevColor, bullets, prompt) {
  const s = p.addSlide(); bgFill(s, BG);
  kicker(s, demo, ACC, MX, 0.5, 8);
  // severity chip
  s.addShape(p.ShapeType.roundRect, { x: W - MX - 2.1, y: 0.45, w: 2.1, h: 0.5, rectRadius: 0.25, fill: { color: sevColor }, line: { type: "none" } });
  s.addText(sev, tb({ x: W - MX - 2.1, y: 0.45, w: 2.1, h: 0.5, align: "center", valign: "middle", bold: true, color: "0E1116", fontSize: 13, fontFace: BFONT }));
  s.addText(title, tb({ x: MX, y: 0.82, w: W - 2 * MX, h: 0.9, fontFace: HFONT, bold: true, color: TX, fontSize: 30 }));
  s.addText(bullets.map(b => ({ text: b, options: { bullet: { indent: 15 }, color: TX, fontSize: 15, fontFace: BFONT, breakLine: true, paraSpaceAfter: 9 } })),
    tb({ x: MX, y: 2.0, w: 11.8, h: 2.6 }));
  s.addShape(p.ShapeType.roundRect, { x: MX, y: 5.2, w: 11.9, h: 1.5, rectRadius: 0.06, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText(prompt, tb({ x: MX + 0.3, y: 5.2, w: 11.3, h: 1.5, valign: "middle", color: GRN, fontFace: MONO, fontSize: 13 }));
  return s;
}

// 20. AuthMatrix authz
impactSlide("Demo 06 · AuthMatrix", "Authorization testing (BOLA / BFLA)", "CRITICAL", DAN,
  ["Plugin replays every request as every user — deterministic grid",
   "AI reads the response bodies and judges real leak vs. legit (the hard part)",
   "OWASP API #1 — what no scanner can decide on its own"],
  "\"For each cell where a lower-priv identity got another user's data, compare bodies and decide if it's a real break. Table first.\"")
  .addNotes("Plugin does the deterministic replay; AI makes the semantic call. The division of labor is the whole philosophy.");

// 21. ParamFinder
impactSlide("Demo 07 · ParamFinder", "Hidden parameter & header mining", "CRITICAL", DAN,
   ["Plugin brute-forces hidden query/body/header params",
    "AI triages each: ?url→SSRF, ?file→LFI, ?debug→leak, header→cache poison",
    "then weaponizes with caido_batch_send + the QuickSSRF canary"],
   "\"Read the ParamFinder findings, classify each param's likely bug, and TEST it. Show which actually changed behavior, ranked by severity.\"")
  .addNotes("Discovery plus instant impact testing. Finding ?url is nothing until the SSRF watcher lights up.");

// 22. Archive / Wayback
impactSlide("Demo 08 · Wayback", "Archive recon → forgotten endpoints", "HIGH", ACC,
   ["gau / waybackurls / katana pull thousands of historical URLs",
    "AI triages: old API versions, debug, backups, retired auth",
    "caido_batch_send probes the shortlist — still-live, still-sensitive"],
   "\"Rank these 5,000 archived URLs by bug potential, give me the top 50 to probe in scope, then GET them and flag what's live and sensitive.\"")
  .addNotes("The archive remembers the URLs they meant to delete. Triage at scale is the AI's job.");

// 23. gRPC / protobuf — the hard one
impactSlide("Demo 09 · gRPC-web", "Decode & tamper protobuf on a live target", "CRITICAL", DAN,
   ["gRPC-web / protobuf / batchexecute bodies are opaque binary — most skip them",
    "AI reads the app's own JS to recover the message schema",
    "Decode → tamper a field → re-encode → test IDOR/authz in Replay"],
   "\"Reconstruct the message schema for this RPC from the JS in history, show the decoded body, then re-encode with user_id changed — don't send.\"")
  .addNotes("The genuinely hard one. You can't fuzz what you can't read; the AI reads the JS. This is the hack-Google technique.");

// 24. GraphQL-Analyzer
impactSlide("Demo 10 · GraphQL-Analyzer", "GraphQL assault", "CRITICAL", DAN,
   ["Plugin maps the schema (introspection or inferred)",
    "AI picks the dangerous mutations + IDOR-shaped queries from hundreds of types",
    "Tests authz, node(id:) IDOR, and alias/batch rate-limit bypass"],
   "\"List state-changing + cross-user mutations and IDOR-candidate queries, then craft GraphQL to prove IDOR and aliased-batch rate-limit bypass.\"")
  .addNotes("One endpoint, a thousand-type schema. Plugin draws the map; AI finds the dangerous operations.");

// ============ 25. philosophy ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  kicker(s, "The point", ACC, MX, 0.6, 8);
  s.addText("Explore fast with AI.\nCrystallize the repeatable part\ninto deterministic tooling.",
    tb({ x: MX, y: 2.1, w: 11.8, h: 2.6, fontFace: HFONT, bold: true, color: TX, fontSize: 34, lineSpacingMultiple: 1.1 }));
  s.addText("The proxy is the chokepoint: observable · scoped · reversible.",
    tb({ x: MX, y: 5.2, w: 11.8, h: 0.6, color: ACC, bold: true, fontSize: 20, fontFace: BFONT }));
  s.addNotes("De-sloppified AI hacking in one line.");
})();

// ============ 26. resources ============
(() => {
  const s = p.addSlide(); bgFill(s, LBG);
  contentHeader(s, "Take it home", "Resources");
  const res = [
    "github.com/jaiswalakshansh/caido-ai-workshop  (this repo)",
    "github.com/caido/skills  ·  github.com/c0tton-fluff/caido-mcp-server",
    "Plugins: caido-community/ — authmatrix · ParamFinder · GraphQL-Analyzer",
    "          JS-Analyzer · quickssrf · crawler · scanner · JWT-Analyzer",
    "github.com/vitorfhc/caido-rpc-mapper  ·  labs.trace37.com/blog/caido-ai-hunting-platform",
  ];
  s.addText(res.map(r => ({ text: r, options: { bullet: { indent: 15 }, color: LTX, fontSize: 15, fontFace: MONO, breakLine: true, paraSpaceAfter: 12 } })),
    tb({ x: MX, y: 2.3, w: 11.8, h: 3.8 }));
  s.addNotes("All linked from the repo README.");
})();

// ============ 27. closing ============
(() => {
  const s = p.addSlide(); bgFill(s, BG);
  s.addText("Thank you", tb({ x: MX, y: 2.7, w: 11, h: 1.2, fontFace: HFONT, bold: true, color: TX, fontSize: 54 }));
  s.addText("Questions?", tb({ x: MX, y: 3.9, w: 11, h: 0.6, color: ACC, fontSize: 24, fontFace: BFONT, bold: true }));
  s.addText("Only test what you're authorized to test.  ·  A PAT in a prompt is a leaked PAT — rotate it.",
    tb({ x: MX, y: 6.4, w: 11.8, h: 0.5, color: MUT, fontSize: 13, fontFace: BFONT }));
  s.addNotes("Ethics + the token-hygiene lesson we learned the hard way.");
})();

p.writeFile({ fileName: "your-ai-needs-a-proxy.pptx" }).then(f => console.log("wrote", f));
