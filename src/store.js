// src/store.js
const Store = require('electron-store');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Get (or generate on first run) a per-installation encryption key so no
// secret is hardcoded in source. The key is stored outside the source tree
// with restricted file permissions.
function getOrCreateEncryptionKey() {
  const keyPath = path.join(app.getPath('userData'), '.namely-key');
  try {
    if (fs.existsSync(keyPath)) {
      return fs.readFileSync(keyPath, 'utf8').trim();
    }
  } catch (error) {
    console.error('Error reading encryption key:', error);
  }
  const key = crypto.randomBytes(32).toString('hex');
  try {
    fs.writeFileSync(keyPath, key, { mode: 0o600 });
  } catch (error) {
    console.error('Error writing encryption key:', error);
  }
  return key;
}

// Create a store with encryption for API keys
const store = new Store({
  name: 'namely-config',
  encryptionKey: getOrCreateEncryptionKey(),
});

// API keys schema
const API_KEYS = 'apiKeys';
const PROVIDER = 'provider';

/**
 * Get stored API keys
 */
function getApiKeys() {
  return store.get(API_KEYS, {});
}

/**
 * Save API keys
 * @param {Object} keys - API keys object with provider names as keys
 */
function saveApiKeys(keys) {
  store.set(API_KEYS, keys);
}

/**
 * Get the selected provider
 */
function getProvider() {
  return store.get(PROVIDER, 'OpenAI');
}

/**
 * Save the selected provider
 * @param {string} provider - Provider name
 */
function saveProvider(provider) {
  store.set(PROVIDER, provider);
}

module.exports = {
  getApiKeys,
  saveApiKeys,
  getProvider,
  saveProvider,
};
