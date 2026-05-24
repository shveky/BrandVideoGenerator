# CLAUDE.md — Brand Video Generator conventions

## Project shape
Remotion video composition + Vite-served browser control panel. No backend.
Single typed props object drives every scene.

## Hard rules

- **30 fps. Period.** All timing is in frames, not seconds. `VIDEO_FPS = 30`, `VIDEO_DURATION_FRAMES = 600`.
- **Deterministic animation.** Every visual change must derive from `useCurrentFrame()` (or `useVideoConfig()` for dimensions). No `Date.now()`, no `Math.random()`, no `setTimeout`. Two renders with the same props must produce identical output.
- **Frame-based timing.** Never write `setTimeout(fn, 1000)` — write `interpolate(frame, [start, start+30], [0, 1])`.
- **RTL.** The video is Hebrew. `direction: 'rtl'` on outer `AbsoluteFill`. Use Heebo font from `@remotion/google-fonts`.
- **Props-driven.** No hardcoded strings/colors in scenes. Read from `BrandVideoProps`. If you need new editable content, extend the interface in `src/compositions/types.ts` AND the form in `src/app/controls/PropsForm.tsx`.

## Timing reference

```
0 ─── 120 ────── 240 ────────── 480 ─── 600
 Intro    Hook       Showcase       CTA
 (0-4s)  (4-8s)     (8-16s)      (16-20s)
```

Defined in `src/compositions/defaults.ts` as `TIMELINE`. Each scene receives a local `useCurrentFrame()` that resets to 0 when its `<Sequence>` starts.

## Adding a new scene

1. Create `src/scenes/MyScene.tsx`. Accept `BrandVideoProps & { isPortrait: boolean }`.
2. Use only `useCurrentFrame()` + `interpolate` + `spring` for animation.
3. Register in `src/compositions/BrandVideo.tsx` inside a `<Sequence from={...} durationInFrames={...}>`.
4. Update `TIMELINE` in `defaults.ts` so the timing is documented in one place.

## Adding a new editable prop

1. Add to `BrandVideoProps` interface (`src/compositions/types.ts`).
2. Add a default to `DEFAULT_PROPS` (`src/compositions/defaults.ts`) AND `props.json`.
3. Add a `<Field>` to `src/app/controls/PropsForm.tsx`.
4. Use it in whatever scene needs it.

## Two compositions, one component

`Root.tsx` registers `BrandVideo16x9` and `BrandVideo9x16` — same `<BrandVideo>` component, different dimensions. Scenes detect orientation via `isPortrait = height > width` and adapt layout (smaller font sizes, vertical stacking, etc.). Do not duplicate the BrandVideo component per aspect.

## Audio

`<Audio>` from Remotion. Files in `public/`. Composition probes for existence via `fetch HEAD` and skips missing files — so `vo.mp3` and `music.mp3` are optional. Don't hard-code requires; use `staticFile(name)` + the `useOptionalAudio` hook in `BrandVideo.tsx`.

## Control panel updates

- Plain controlled inputs, no `<form>` tag, no submit step.
- Every `onChange` flows through `setProps(...)` to update the live preview.
- Aspect toggle creates a new Player by changing `key={aspect}` — forces remount with new dimensions.
- "Copy render command" inlines props as JSON. Avoid putting secrets in props.

## Don't

- Don't add a build step for the video itself — Remotion handles that.
- Don't bypass `useCurrentFrame()` to make animations time-based. They'll desync in renders.
- Don't put state in scenes. Scenes are pure functions of `props + frame`.
- Don't commit `out/`, `dist/`, `node_modules/`. All in `.gitignore`.
