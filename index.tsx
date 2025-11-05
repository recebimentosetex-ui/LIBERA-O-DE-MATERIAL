import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix: Declare google object for TypeScript to recognize it in the global scope.
declare const google: any;

// --- Polyfills & Mocks for Local Development ---
if (typeof google === 'undefined') {
  console.warn('Running in local development mode. Mocking google.script.run to use localStorage.');
  (window as any).google = {
    script: {
      run: (function() {
        const createApiRunner = (successCallback = console.log, failureCallback = console.error) => {
          const runner = {
            withSuccessHandler: function(cb) { return createApiRunner(cb, failureCallback); },
            withFailureHandler: function(cb) { return createApiRunner(successCallback, cb); },
            getReleases: function() {
              setTimeout(() => {
                try {
                  const releases = JSON.parse(localStorage.getItem('releases') || '[]');
                  successCallback(releases);
                } catch (e) { failureCallback(e); }
              }, 300);
            },
            saveRelease: function(releaseData) {
              setTimeout(() => {
                try {
                  let releases = JSON.parse(localStorage.getItem('releases') || '[]');
                  let savedRelease;
                  if (releaseData.id) {
                    savedRelease = { ...releaseData };
                    releases = releases.map(r => r.id === releaseData.id ? savedRelease : r);
                  } else {
                    savedRelease = { ...releaseData, id: Date.now() };
                    releases.unshift(savedRelease);
                  }
                  localStorage.setItem('releases', JSON.stringify(releases));
                  successCallback(savedRelease);
                } catch (e) { failureCallback(e); }
              }, 300);
            },
            deleteRelease: function(id) {
              setTimeout(() => {
                try {
                  let releases = JSON.parse(localStorage.getItem('releases') || '[]');
                  releases = releases.filter(r => r.id !== id);
                  localStorage.setItem('releases', JSON.stringify(releases));
                  successCallback(null);
                } catch (e) { failureCallback(e); }
              }, 300);
            },
            getFiberStock: function() {
              setTimeout(() => {
                try {
                  const stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                  successCallback(stock);
                } catch (e) { failureCallback(e); }
              }, 300);
            },
            saveFiberStock: function(itemData) {
              setTimeout(() => {
                try {
                  let stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                  let savedItem;
                  if (itemData.id) {
                    savedItem = { ...itemData };
                    stock = stock.map(s => s.id === itemData.id ? savedItem : s);
                  } else {
                    savedItem = { ...itemData, id: Date.now() };
                    stock.unshift(savedItem);
                  }
                  localStorage.setItem('fiberStock', JSON.stringify(stock));
                  successCallback(savedItem);
                } catch (e) { failureCallback(e); }
              }, 300);
            },
            deleteFiberStock: function(id) {
              setTimeout(() => {
                try {
                  let stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                  stock = stock.filter(s => s.id !== id);
                  localStorage.setItem('fiberStock', JSON.stringify(stock));
                  successCallback(null);
                } catch (e) { failureCallback(e); }
              }, 300);
            },
            importFiberStock: function(items) {
              setTimeout(() => {
                try {
                  let stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                  const newItems = items.map((item, index) => ({...item, id: Date.now() + index }));
                  const updatedStock = [...newItems, ...stock];
                  localStorage.setItem('fiberStock', JSON.stringify(updatedStock));
                  successCallback(updatedStock);
                } catch(e) { failureCallback(e); }
              }, 500);
            }
          };
          return new Proxy(runner, {
              get(target, prop) {
                  if (prop in target) return target[prop];
                  // Fix: Explicitly convert `prop` to a string to avoid a runtime error when `prop` is a symbol.
                  console.warn(`google.script.run.${String(prop)} is not mocked.`);
                  return () => target;
              }
          });
        };
        return createApiRunner();
      }())
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
