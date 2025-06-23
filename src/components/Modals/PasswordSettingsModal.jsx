import React from 'react';
import BaseModal from './BaseModal';

function PasswordSettingsModal({ show, onClose, options, setOptions }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions({
      ...options,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const modalFooter = (
    <button
      onClick={onClose}
      className="button"
    >
      Save
    </button>
  );

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title="Password Settings"
      id="password-settings"
      size="md"
      footer={modalFooter}
    >
      <div className="space-y-6">
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="length" className="field-label">
              Password Length
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="number"
              id="length"
              name="length"
              value={options.length}
              onChange={handleChange}
              min="4"
              max="64"
              className="input"
            />
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label className="field-label">Character Types</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'includeUppercase', label: 'Uppercase Letters' },
              { name: 'includeLowercase', label: 'Lowercase Letters' },
              { name: 'includeNumbers', label: 'Numbers' },
              { name: 'includeSpecialChars', label: 'Special Characters' },
            ].map(({ name, label }) => (
              <div key={name} className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer mr-3">
                  <input
                    type="checkbox"
                    name={name}
                    checked={options[name]}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
                <span style={{ color: 'var(--color-text)', paddingLeft: '4px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export default PasswordSettingsModal;
