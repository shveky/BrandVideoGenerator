# Brand Video Generator — Spec & Plan

A small, production-quality web app that generates a 20-second brand video using Remotion, with a browser-based control panel for live prop editing.

> **License**: Personal project, individual developer. Remotion **Free License** applies.

---

## Objective

Scaffold a Remotion project that:

1. Defines a parametrized 20-second brand video composition.
2. Exposes a browser-based control panel (using `@remotion/player`) where props can be edited live and the result previewed before rendering.
3. Renders to MP4 in both **16:9 (1920×1080)** and **9:16 (1080×1920)** via CLI commands.

---

## Tech constraints

| | |
|---|---|
| Language | TypeScript + React + Remotion (latest stable) |
| Base | `npx create-video@latest` |
| Backend | None — control panel is a static React page using `@remotion/player` |
| Determinism | All animation driven by `useCurrentFrame()` so renders are reproducible |
| Frame rate | **30 fps** |
| Duration | **600 frames** (20 s) |
| Locale | Hebrew content, `dir="rtl"`, **Heebo** font via `@remotion/google-fonts` |

---

## Video structure (frame timeline @ 30 fps)

| Scene | Frames | Time | Purpose |
|---|---|---|---|
| **1 — Intro** | 0–120 | 0–4 s | Logo springs in, app name rises, tagline fades in, soft fade out at end |
| **2 — Hook** | 120–240 | 4–8 s | One bold value sentence animates in, on the brand background |
| **3 — Showcase** | 240–480 | 8–16 s | Screen-recording / screenshot slot with Ken-Burns auto-zoom on a focus region + 2-3 synchronized caption beats (describing **outcomes**, not features) |
| **4 — CTA** | 480–600 | 16–20 s | End card: logo, app URL, clear call to action |

Use `<Sequence>` + `spring` + `interpolate` for all transitions. Add a subtle global background gradient that shifts slowly across the entire 20 s.

---

## Props interface (single typed object)

```ts
// src/compositions/types.ts
export interface BrandVideoProps {
  appName:     string;   // default: "טיול בטבע"
  tagline:     string;   // default: "תכנון טיולים בטוח"
  hookLine:    string;   // default: "כל מה שצריך לתכנון מסלול, במקום אחד"
  ctaText:     string;   // default: "התחילו עכשיו →"
  appUrl:      string;   // default: "https://example.com"
  logoSrc:     string;   // default: staticFile("logo.png")
  mediaSrc:    string;   // default: staticFile("showcase.png")
  brandBg:     string;   // hex, default: "#0B3D2E"
  brandAccent: string;   // hex, default: "#E8B339"
  captions:    Caption[];
}

export interface Caption {
  fromFrame:        number;  // start frame within the showcase scene
  durationInFrames: number;
  text:             string;
}
```

---

## File layout

```
Brand Video Generator/
├── Demo.MD                          # this spec
├── README.md                        # quickstart + asset-swap guide
├── CLAUDE.md                        # 30fps / RTL / props-driven / deterministic
├── package.json                     # scripts: studio, panel, render:wide, render:vertical
├── remotion.config.ts               # video config
├── public/
│   ├── logo.png                     # PLACEHOLDER — swap for real logo
│   ├── showcase.png                 # PLACEHOLDER — swap for real screen recording
│   ├── vo.mp3                       # OPTIONAL voiceover
│   └── music.mp3                    # OPTIONAL background music
└── src/
    ├── Root.tsx                     # registers compositions
    ├── compositions/
    │   ├── BrandVideo.tsx           # 600-frame, 30fps composition
    │   ├── types.ts                 # BrandVideoProps + Caption
    │   └── defaults.ts              # default props values
    ├── scenes/
    │   ├── IntroScene.tsx           # frames 0-120
    │   ├── HookScene.tsx            # frames 120-240
    │   ├── ShowcaseScene.tsx        # frames 240-480 (Ken Burns + captions)
    │   ├── CtaScene.tsx             # frames 480-600
    │   └── BackgroundGradient.tsx   # subtle global shift, 0-600
    └── app/
        ├── ControlPanel.tsx         # @remotion/player + form inputs
        ├── controls/
        │   ├── PropsForm.tsx        # all editable fields, RTL inputs
        │   ├── AspectToggle.tsx     # 16:9 ↔ 9:16 switch
        │   └── CopyRenderCmd.tsx    # button that outputs the CLI command
        └── main.tsx                 # Vite entry rendering ControlPanel
```

---

## npm scripts

```json
{
  "scripts": {
    "studio":          "remotion studio",
    "panel":           "vite",
    "panel:build":     "vite build",
    "render:wide":     "remotion render BrandVideo16x9 out/brand-wide.mp4 --props=./props.json",
    "render:vertical": "remotion render BrandVideo9x16 out/brand-vertical.mp4 --props=./props.json"
  }
}
```

Two compositions registered in `Root.tsx`:
- `BrandVideo16x9` — 1920×1080, 30 fps, 600 frames
- `BrandVideo9x16` — 1080×1920, 30 fps, 600 frames (same scenes, layout adapts to portrait)

---

## Audio (optional, gracefully degrades)

- `<Audio src={staticFile("vo.mp3")} />` — voiceover, only mounted if file exists
- `<Audio src={staticFile("music.mp3")} volume={0.15} />` — background music
- Wrap each in a try/catch (or pre-check via `fetch(staticFile(...), {method:'HEAD'})`) so missing files don't break renders.

---

## Acceptance criteria

- [ ] `npm run studio` shows the 20 s video playing correctly with Hebrew RTL text
- [ ] `npm run panel` serves the control panel; every field updates the live preview without a code change
- [ ] `npm run render:wide` produces a valid `out/brand-wide.mp4` (1920×1080)
- [ ] `npm run render:vertical` produces a valid `out/brand-vertical.mp4` (1080×1920)
- [ ] Aspect toggle in the control panel correctly switches the preview between 16:9 and 9:16
- [ ] "Copy render command" button outputs a runnable CLI command with the current settings

---

## Working style

- Plan first, implement after OK.
- Use placeholder assets so everything renders end-to-end out of the box.
- For ambiguous design decisions, pick a tasteful default and note it inline. Don't block.
- One PR = one logical change.

---

## Implementation phases

1. **Scaffold** — `npx create-video@latest brand-video-generator --template hello-world` → strip default content
2. **Foundation** — add `@remotion/google-fonts`, `@remotion/player`, Heebo font, `BackgroundGradient`, types + defaults
3. **Scenes** (in order, each is one PR-sized chunk): Intro → Hook → Showcase → CTA
4. **Compositions** — register `BrandVideo16x9` and `BrandVideo9x16` in `Root.tsx`
5. **Audio** — optional voiceover + music slots with graceful skip
6. **Control Panel** — Vite-served React page with `<Player>`, prop form, aspect toggle, copy-cmd button
7. **Scripts + Docs** — `npm run` scripts, README quickstart, CLAUDE.md conventions
8. **Smoke test** — manually render both formats, verify both MP4s play

---

## Open decisions (defaults chosen, flag here for review)

| Decision | Default | Rationale |
|---|---|---|
| Bundler for control panel | **Vite** | Lightest setup, fastest HMR for in-browser preview |
| Where compositions register | `Root.tsx` (Remotion convention) | Matches `create-video` template, no surprise for future contributors |
| Caption layout | Bottom band, RTL, 20% from bottom | Standard reel/short caption position |
| Showcase Ken Burns | 1.0 → 1.18 zoom, slight pan toward focus region | Subtle, recognizable, doesn't compete with captions |
| Logo entrance | `spring({ frame, fps, config: { damping: 14 } })` scale 0 → 1 | Classic Remotion logo bounce |
| Background gradient | Linear, `brandBg` → 8% darker, angle slowly rotates 0° → 30° over 20 s | Subtle "alive" feel without distracting |

If any of these don't fit, change before phase 2.
