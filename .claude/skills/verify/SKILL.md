---
name: verify
description: Screenshot-verify this static site with headless Edge (no build step, no server needed)
---

# Verifying this site

Static site — no build, no server. Open `index.html` via `file:///` and capture with headless Edge.

## Capture recipe (use Bash, not PowerShell)

Edge lives at `/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
PowerShell does NOT wait for msedge.exe (GUI process) — Bash does. Use Bash.

```bash
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
  --window-size=1280,3800 --screenshot="<out>.png" \
  "file:///C:/Users/bjorn.swanson/east-village-finest-deli/index.html"
```

Then Read the PNG to inspect visually.

## Gotchas

- `--virtual-time-budget=6000` — required so Google Fonts load before capture.
- **Minimum window width ≈ 500px** in headless=new on Windows: a 390px window renders
  at ~516px and clips. Test the mobile breakpoint at **700px** width (breakpoint is 760px).
- Screenshot captures the viewport only — set window height tall enough for the full page
  (~3800px at 1280 wide).
- `--blink-settings=scriptEnabled=false` produces no screenshot in this Edge build (and
  `--headless` old mode is gone). No-JS behavior must be reasoned from the static markup.

## Time-travel probe (open-now pill / today highlight)

`script.js` computes open/closed from the clock in America/New_York. To drive it at a fixed
time, inject a Date override before `script.js` in a temp copy, screenshot, delete:

```bash
sed 's|<script src="script.js"></script>|<script>const RD=Date,F=RD.parse("2026-07-20T04:30:00Z");Date=class extends RD{constructor(...a){if(a.length){super(...a)}else{super(F)}}static now(){return F}};</script><script src="script.js"></script>|' index.html > _probe.html
```

Edge cases worth probing: weeknight 00:30 (closed), Sat/Sun 00:30 (open — Fri/Sat hours
run to 1 AM next day), 05:59 vs 06:00.

## What to eyeball

Hero pill text matches the mocked/real time; today's row highlighted in the hours table;
awning scallops render; ticker band scrolls (static in screenshot); hamburger appears
below 760px; all four order cards present.
