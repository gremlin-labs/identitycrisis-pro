import React, { useState, useEffect } from 'react';
import { Key } from 'phosphor-react';
import BaseModal from './BaseModal';

function ApiKeyReminderModal({ show, onSubmit, onClose, provider, setProvider }) {
  const [apiKey, setApiKey] = useState('');

  // Reset API key when modal is shown or provider changes
  useEffect(() => {
    if (show) {
      setApiKey('');
    }
  }, [show, provider]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  const providers = [
    { key: 'openai', label: 'OpenAI' },
    { key: 'anthropic', label: 'Anthropic' },
    { key: 'google', label: 'Google' },
    { key: 'mistral', label: 'Mistral' },
    { key: 'together', label: 'Together.ai' },
    { key: 'fireworks', label: 'Fireworks.ai' },
    { key: 'inference', label: 'Inference.net' }
  ];

  const currentProviderLabel = providers.find(p => p.key === provider)?.label || provider;

  const modalFooter = (
    <button
      type="submit"
      form="api-key-form"
      disabled={!apiKey.trim()}
      className="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Key size={16} weight="bold" />
      Save API Key
    </button>
  );

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title="API Key Required"
      id="api-key-reminder"
      size="md"
      footer={modalFooter}
    >
      <p style={{ color: 'var(--color-text)', marginBottom: '16px' }}>
        To use IdentityCrisis Pro, you need to provide an API key for your chosen AI provider.
      </p>
      <form id="api-key-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="field-group">
          <div className="field-header">
            <label
              htmlFor="provider-select-modal"
              className="field-label"
            >
              AI Provider
            </label>
          </div>
          <div className="input-wrapper">
            <select
              id="provider-select-modal"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="select"
              style={{ paddingRight: '36px' }}
            >
              {providers.map((prov) => (
                <option key={prov.key} value={prov.key}>
                  {prov.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label
              htmlFor="api-key-modal"
              className="field-label"
            >
              API Key for {currentProviderLabel}
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              id="api-key-modal"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${currentProviderLabel} API key`}
              required
              className="input"
            />
          </div>
          <p style={{
            marginTop: '8px',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-button-text)'
          }}>
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      </form>
    </BaseModal>
  );
}

export default ApiKeyReminderModal;
