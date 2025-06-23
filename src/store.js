// src/store.js
const Store = require('electron-store');

// Create a store with encryption for API keys
const store = new Store({
  name: 'namely-config',
  encryptionKey: 'namely-secure-key', // In a real app, use a more secure key
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
