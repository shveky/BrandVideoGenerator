import React, { useState } from 'react';
import type { BrandVideoProps } from '../../compositions/types';
import type { Aspect } from './AspectToggle';

interface Props {
  aspect: Aspect;
  props: BrandVideoProps;
  compositionId: string;
}

// Emits the exact `npx remotion render` command for the current settings.
// We pass props via --props inline JSON (URL-safe) so it's a single line.
export const CopyRenderCmd: React.FC<Props> = ({ aspect, props, compositionId }) => {
  const [copied, setCopied] = useState(false);

  const outFile = aspect === '16x9' ? 'out/brand-wide.mp4' : 'out/brand-vertical.mp4';
  const propsJson = JSON.stringify(props);
  // Bash/zsh-safe: single-quote the JSON, escape inner single quotes
  const safeJson = propsJson.replace(/'/g, `'"'"'`);
  const cmd = `npx remotion render ${compositionId} ${outFile} --props='${safeJson}'`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: select-and-prompt
      window.prompt('העתק:', cmd);
    }
  };

  return (
    <button
      onClick={copy}
      title={cmd}
      style={{
        background: copied ? '#43a047' : '#1a2128',
        color: copied ? '#fff' : '#e6e8eb',
        border: '1px solid #2a323b', borderRadius: 8,
        padding: '8px 16px', cursor: 'pointer',
        fontSize: 13, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'all 0.15s',
      }}
    >
      {copied ? '✓ הועתק' : `📋 העתק פקודת רינדור (${aspect})`}
    </button>
  );
};
