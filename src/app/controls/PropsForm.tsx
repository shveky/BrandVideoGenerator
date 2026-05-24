import React from 'react';
import type { BrandVideoProps, Caption } from '../../compositions/types';

interface Props {
  value: BrandVideoProps;
  onChange: (next: BrandVideoProps) => void;
}

// Plain controlled inputs — no <form> wrapper, every onChange immediately
// updates parent state so the <Player> preview re-renders live.
export const PropsForm: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof BrandVideoProps>(k: K, v: BrandVideoProps[K]) =>
    onChange({ ...value, [k]: v });

  const setCaption = (i: number, patch: Partial<Caption>) => {
    const next = value.captions.slice();
    next[i] = { ...next[i], ...patch };
    onChange({ ...value, captions: next });
  };

  const addCaption = () => {
    const last = value.captions[value.captions.length - 1];
    const fromFrame = last ? last.fromFrame + last.durationInFrames : 0;
    onChange({
      ...value,
      captions: [...value.captions, { fromFrame, durationInFrames: 60, text: 'כיתוב חדש' }],
    });
  };

  const removeCaption = (i: number) =>
    onChange({ ...value, captions: value.captions.filter((_, idx) => idx !== i) });

  return (
    <div style={styles.form}>
      <h2 style={styles.h2}>פרופס</h2>

      <Field label="שם האפליקציה" value={value.appName} onChange={(v) => set('appName', v)} />
      <Field label="טאגליין" value={value.tagline} onChange={(v) => set('tagline', v)} />
      <Field label="הוק (משפט מרכזי)" value={value.hookLine} onChange={(v) => set('hookLine', v)} textarea />
      <Field label="כפתור CTA" value={value.ctaText} onChange={(v) => set('ctaText', v)} />
      <Field label="כתובת אפליקציה (URL)" value={value.appUrl} onChange={(v) => set('appUrl', v)} ltr />
      <Field label="לוגו (נתיב בתוך public/)" value={value.logoSrc} onChange={(v) => set('logoSrc', v)} ltr />
      <Field label="תצוגה (showcase) — נתיב בתוך public/" value={value.mediaSrc} onChange={(v) => set('mediaSrc', v)} ltr />

      <div style={styles.row}>
        <ColorField label="צבע רקע ראשי" value={value.brandBg} onChange={(v) => set('brandBg', v)} />
        <ColorField label="צבע מבטא" value={value.brandAccent} onChange={(v) => set('brandAccent', v)} />
      </div>

      <h3 style={styles.h3}>כיתובים (Showcase scene)</h3>
      <div style={{ color: '#8a9199', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
        כל פריים יחסי לתחילת סצנת ה-Showcase (פריים 0-240). ה-Showcase נמשך 8 שניות.
      </div>

      {value.captions.map((c, i) => (
        <div key={i} style={styles.captionRow}>
          <input
            value={c.text}
            onChange={(e) => setCaption(i, { text: e.target.value })}
            placeholder="טקסט כיתוב"
            style={{ ...styles.input, flex: 1, direction: 'rtl' }}
          />
          <input
            type="number" min={0} max={240}
            value={c.fromFrame}
            onChange={(e) => setCaption(i, { fromFrame: Number(e.target.value) || 0 })}
            style={{ ...styles.input, width: 70 }}
            title="from frame (0-240)"
          />
          <input
            type="number" min={1} max={240}
            value={c.durationInFrames}
            onChange={(e) => setCaption(i, { durationInFrames: Number(e.target.value) || 1 })}
            style={{ ...styles.input, width: 70 }}
            title="duration (frames)"
          />
          <button onClick={() => removeCaption(i)} style={styles.removeBtn} title="הסר">×</button>
        </div>
      ))}
      <button onClick={addCaption} style={styles.addBtn}>+ הוסף כיתוב</button>
    </div>
  );
};

// ----------------------- Reusable field components -----------------------

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  ltr?: boolean;
}> = ({ label, value, onChange, textarea, ltr }) => (
  <label style={styles.field}>
    <span style={styles.label}>{label}</span>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        style={{ ...styles.input, direction: ltr ? 'ltr' : 'rtl', resize: 'vertical' }}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, direction: ltr ? 'ltr' : 'rtl' }}
      />
    )}
  </label>
);

const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <label style={{ ...styles.field, flex: 1 }}>
    <span style={styles.label}>{label}</span>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 44, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, flex: 1, direction: 'ltr', fontFamily: 'monospace' }}
      />
    </div>
  </label>
);

const styles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 12, direction: 'rtl' },
  h2: { margin: '0 0 12px', fontSize: 18, color: '#fff' },
  h3: { margin: '20px 0 8px', fontSize: 15, color: '#fff', borderTop: '1px solid #2a323b', paddingTop: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, color: '#8a9199', fontWeight: 600 },
  input: {
    background: '#0f1419', color: '#e6e8eb',
    border: '1px solid #2a323b', borderRadius: 8,
    padding: '8px 10px', fontSize: 14, fontFamily: 'inherit',
    outline: 'none',
  },
  row: { display: 'flex', gap: 12 },
  captionRow: { display: 'flex', gap: 6, alignItems: 'stretch' },
  addBtn: {
    background: 'transparent', color: '#E8B339',
    border: '1px dashed #E8B339', borderRadius: 8,
    padding: '8px 12px', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', marginTop: 6,
  },
  removeBtn: {
    background: '#2a323b', color: '#e6e8eb',
    border: 'none', borderRadius: 8, padding: '0 12px',
    fontSize: 18, cursor: 'pointer',
  },
};
