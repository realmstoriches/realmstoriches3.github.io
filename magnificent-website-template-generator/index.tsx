import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Use a more specific ID for the app's root element to avoid conflicts
const appRootElementId = 'magnificent-template-generator-app-root';
const rootElement = document.getElementById(appRootElementId);

if (!rootElement) {
  throw new Error(`Could not find root element with ID '${appRootElementId}' to mount the React app. Make sure a div with this ID exists in your HTML.`);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
