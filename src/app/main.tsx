import React from 'react';
import { createRoot } from 'react-dom/client';
import { ControlPanel } from './ControlPanel';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element in index.html');
createRoot(root).render(<ControlPanel />);
