import '@/styles/normalize.css';
import '@/styles/reset.css';
import '@/styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';
import { SickProvider } from './contexts/sickContext';

const container = document.getElementById('root');

createRoot(container as HTMLElement).render(
  <StrictMode>
    <SickProvider>
      <App />
    </SickProvider>
  </StrictMode>,
);
