import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Isolar e suprimir erros benignos de conexão do WebSocket do HMR do Vite no ambiente sandboxed de forma silenciosa e absoluta
if (typeof window !== 'undefined') {
  // Sobrescreve console.error e console.warn para filtrar mensagens de websocket/HMR
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = (...args) => {
    const msg = args.map(arg => String(arg)).join(' ');
    if (msg.includes('WebSocket') || msg.includes('websocket') || msg.includes('HMR') || msg.includes('hmr')) {
      return; // Silenciar completamente
    }
    originalConsoleError(...args);
  };

  console.warn = (...args) => {
    const msg = args.map(arg => String(arg)).join(' ');
    if (msg.includes('WebSocket') || msg.includes('websocket') || msg.includes('HMR') || msg.includes('hmr') || msg.includes('Filtro de ruído')) {
      return; // Silenciar completamente
    }
    originalConsoleWarn(...args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason) {
      const reasonStr = String(event.reason.message || event.reason);
      if (reasonStr.includes('WebSocket') || reasonStr.includes('websocket') || reasonStr.includes('HMR') || reasonStr.includes('hmr')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });

  window.addEventListener('error', (event) => {
    if (event.message && (event.message.includes('WebSocket') || event.message.includes('websocket') || event.message.includes('HMR') || event.message.includes('hmr'))) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

