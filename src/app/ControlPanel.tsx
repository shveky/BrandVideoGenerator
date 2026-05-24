import React, { useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { BrandVideo } from '../compositions/BrandVideo';
import { DEFAULT_PROPS, VIDEO_DURATION_FRAMES, VIDEO_FPS } from '../compositions/defaults';
import type { BrandVideoProps } from '../compositions/types';
import { PropsForm } from './controls/PropsForm';
import { AspectToggle, type Aspect } from './controls/AspectToggle';
import { CopyRenderCmd } from './controls/CopyRenderCmd';

export const ControlPanel: React.FC = () => {
  const [props, setProps] = useState<BrandVideoProps>(DEFAULT_PROPS);
  const [aspect, setAspect] = useState<Aspect>('16x9');

  // Dimensions per aspect — matches the registered compositions
  const dims = useMemo(() => (
    aspect === '16x9'
      ? { width: 1920, height: 1080, compositionId: 'BrandVideo16x9' }
      : { width: 1080, height: 1920, compositionId: 'BrandVideo9x16' }
  ), [aspect]);

  // Scale the preview so it fits the available area without exceeding the
  // panel column. Player handles internal scaling — we set max display size.
  const previewMaxHeight = 540;
  const playerWidth = aspect === '16x9'
    ? Math.round(previewMaxHeight * (16 / 9))
    : Math.round(previewMaxHeight * (9 / 16));

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎬 Brand Video — Control Panel</h1>
        <div style={styles.subtitle}>20s · 30fps · Remotion + Vite</div>
      </header>

      <div style={styles.body}>
        <section style={styles.previewCol}>
          <div style={styles.previewWrap}>
            <Player
              key={aspect}
              component={BrandVideo}
              inputProps={props}
              durationInFrames={VIDEO_DURATION_FRAMES}
              compositionWidth={dims.width}
              compositionHeight={dims.height}
              fps={VIDEO_FPS}
              style={{ width: playerWidth, height: previewMaxHeight, borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}
              controls
              loop
              autoPlay
            />
          </div>
          <div style={styles.previewMeta}>
            <AspectToggle aspect={aspect} onChange={setAspect} />
            <CopyRenderCmd aspect={aspect} props={props} compositionId={dims.compositionId} />
          </div>
        </section>

        <section style={styles.formCol}>
          <PropsForm value={props} onChange={setProps} />
        </section>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { padding: '20px 32px', borderBottom: '1px solid #2a323b', display: 'flex', alignItems: 'baseline', gap: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' },
  subtitle: { color: '#8a9199', fontSize: 13 },
  body: {
    flex: 1, display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24,
    padding: 24,
    minWidth: 0,
  },
  previewCol: { display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'flex-start', minWidth: 0 },
  previewWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16, background: '#000', borderRadius: 12 },
  previewMeta: { width: '100%', maxWidth: 720, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' },
  formCol: { background: '#1a2128', borderRadius: 12, padding: 20, overflowY: 'auto', maxHeight: 'calc(100vh - 130px)' },
};
