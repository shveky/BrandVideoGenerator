import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Heebo';
import type { BrandVideoProps } from './types';
import { TIMELINE } from './defaults';

import { BackgroundGradient } from '../scenes/BackgroundGradient';
import { IntroScene } from '../scenes/IntroScene';
import { HookScene } from '../scenes/HookScene';
import { FlightInfoScene } from '../scenes/FlightInfoScene';
import { YachtSpecsScene } from '../scenes/YachtSpecsScene';
import { YachtSimulatorScene } from '../scenes/YachtSimulatorScene';
import { TavernasScene } from '../scenes/TavernasScene';
import { NightlifeScene } from '../scenes/NightlifeScene';
import { CtaScene } from '../scenes/CtaScene';

// Load Heebo (Hebrew + Latin support) once at module load.
const { fontFamily } = loadFont();

// Optional audio — wrapped in try/catch at render time. We probe with a
// fetch HEAD at runtime to skip missing files without throwing.
const useOptionalAudio = (path: string) => {
  const [exists, setExists] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    fetch(staticFile(path), { method: 'HEAD' })
      .then((r) => { if (!cancelled) setExists(r.ok); })
      .catch(() => { if (!cancelled) setExists(false); });
    return () => { cancelled = true; };
  }, [path]);
  return exists;
};

export const BrandVideo: React.FC<BrandVideoProps> = (props) => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  const hasVo = useOptionalAudio('vo.mp3');
  const hasMusic = useOptionalAudio('music.mp3');

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        direction: 'rtl',
        background: props.brandBg,
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Global gradient that shifts slowly across the entire 20 seconds */}
      <BackgroundGradient brandBg={props.brandBg} brandAccent={props.brandAccent} />

      <Sequence from={TIMELINE.intro.from} durationInFrames={TIMELINE.intro.durationInFrames}>
        <IntroScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.hook.from} durationInFrames={TIMELINE.hook.durationInFrames}>
        <HookScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.flight.from} durationInFrames={TIMELINE.flight.durationInFrames}>
        <FlightInfoScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.yacht.from} durationInFrames={TIMELINE.yacht.durationInFrames}>
        <YachtSpecsScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.simulator.from} durationInFrames={TIMELINE.simulator.durationInFrames}>
        <YachtSimulatorScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.tavernas.from} durationInFrames={TIMELINE.tavernas.durationInFrames}>
        <TavernasScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.nightlife.from} durationInFrames={TIMELINE.nightlife.durationInFrames}>
        <NightlifeScene {...props} isPortrait={isPortrait} />
      </Sequence>

      <Sequence from={TIMELINE.cta.from} durationInFrames={TIMELINE.cta.durationInFrames}>
        <CtaScene {...props} isPortrait={isPortrait} />
      </Sequence>

      {hasVo && <Audio src={staticFile('vo.mp3')} />}
      {/* Music volume: 0.35 when there's no voiceover (chill ambient sits
          as the lead audio), 0.15 when vo.mp3 is added to duck under voice. */}
      {hasMusic && <Audio src={staticFile('music.mp3')} volume={hasVo ? 0.15 : 0.35} />}
    </AbsoluteFill>
  );
};
