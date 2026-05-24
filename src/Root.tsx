import React from 'react';
import { Composition } from 'remotion';
import { BrandVideo } from './compositions/BrandVideo';
import { DEFAULT_PROPS, VIDEO_DURATION_FRAMES, VIDEO_FPS } from './compositions/defaults';

// Two compositions sharing the same scenes — only width/height differs.
// Layout adapts via the `isPortrait` flag computed from useVideoConfig().
export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandVideo16x9"
        component={BrandVideo}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROPS}
      />
      <Composition
        id="BrandVideo9x16"
        component={BrandVideo}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_PROPS}
      />
    </>
  );
};
