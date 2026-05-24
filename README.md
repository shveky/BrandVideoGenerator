# Brand Video Generator

A 20-second brand video built with [Remotion](https://www.remotion.dev/) + a browser-based control panel to edit props live before rendering. Output is reproducible MP4 in both **16:9** and **9:16**.

> Licensed under the **Remotion Free License** — individual developer use only. See https://remotion.dev/license

---

## 3-step quickstart

```bash
# 1. Install
npm install

# 2. Edit live in the browser (Vite + @remotion/player)
npm run panel
# Opens http://localhost:5173 — edit props, preview updates instantly

# 3. Render both formats
npm run render:wide       # → out/brand-wide.mp4 (1920×1080)
npm run render:vertical   # → out/brand-vertical.mp4 (1080×1920)
```

Optional — open the Remotion Studio (full timeline, scrubbing, screenshots):
```bash
npm run studio
```

---

## Where to swap the placeholder assets

| Placeholder | Replace with | How |
|---|---|---|
| `public/logo.svg` | Your real logo (PNG / SVG) | Drop your file in `public/`; update `logoSrc` in `src/compositions/defaults.ts` and `props.json` |
| `public/showcase.svg` | Your product screenshot or screen recording | Drop image in `public/`; update `mediaSrc`. For a video, swap `<Img>` → `<Video>` in `src/scenes/ShowcaseScene.tsx` |
| `public/vo.mp3` *(optional)* | Voiceover audio | Drop the file — the composition auto-detects via HEAD request and mounts `<Audio>` only if present |
| `public/music.mp3` *(optional)* | Background music | Same as voiceover. Plays at 15% volume so it sits under VO |

---

## Project layout

```
src/
├── index.ts                    # Remotion entry (registerRoot)
├── Root.tsx                    # registers BrandVideo16x9 + BrandVideo9x16
├── compositions/
│   ├── BrandVideo.tsx          # 600-frame, 30fps composition
│   ├── types.ts                # BrandVideoProps + Caption interfaces
│   └── defaults.ts             # DEFAULT_PROPS, VIDEO_FPS, TIMELINE
├── scenes/
│   ├── BackgroundGradient.tsx  # global gradient, 0-600
│   ├── IntroScene.tsx          # 0-120 (0-4s)
│   ├── HookScene.tsx           # 120-240 (4-8s)
│   ├── ShowcaseScene.tsx       # 240-480 (8-16s) — Ken Burns + captions
│   └── CtaScene.tsx            # 480-600 (16-20s)
└── app/
    ├── index.html              # Vite shell
    ├── main.tsx                # React boot
    ├── ControlPanel.tsx        # Player + form layout
    └── controls/
        ├── PropsForm.tsx       # editable fields
        ├── AspectToggle.tsx    # 16:9 ↔ 9:16
        └── CopyRenderCmd.tsx   # CLI command copy button

public/                         # static assets (logo, showcase, optional audio)
out/                            # rendered MP4s land here
props.json                      # CLI render props (mirrors DEFAULT_PROPS)
remotion.config.ts              # Remotion config
vite.config.ts                  # Vite config for the panel
```

---

## How the live-edit loop works

1. `npm run panel` boots Vite on port 5173.
2. The panel renders `<Player>` from `@remotion/player` with `inputProps={props}` and `component={BrandVideo}`.
3. Every form change calls `setProps`, the Player re-renders the current frame with the new props — no code edit, no rebuild.
4. When happy, click "📋 העתק פקודת רינדור" — it copies the exact `npx remotion render` command with your current props inlined as JSON.

---

## Conventions

See `CLAUDE.md` for the full design rules (30fps, frame-based timing, RTL, props-driven, deterministic animations).

---

## Troubleshooting

- **`npm run studio` shows a black screen**: check the browser console — usually a missing asset in `public/`. The placeholder SVGs should always work.
- **Renders fail with "ffmpeg not found"**: Remotion bundles ffmpeg, but on some systems you may need `npx remotion install`.
- **RTL text looks broken**: make sure `direction: 'rtl'` is set on the outermost AbsoluteFill in `BrandVideo.tsx` (it is, by default). Hebrew + Heebo loads from Google Fonts via `@remotion/google-fonts`.
- **Renders look different from the preview**: that should not happen — animations are deterministic. If you see a difference, file an issue: probably a non-frame-driven side effect crept in.
