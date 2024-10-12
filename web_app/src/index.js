import { Buffer } from 'buffer';
import process from 'process';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Ensure Buffer and process are available globally
if (typeof global === 'undefined') {
  var global = window;
}
global.Buffer = Buffer;
global.process = process;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();
