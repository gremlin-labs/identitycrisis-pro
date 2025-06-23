import React from 'react';
import BaseModal from './BaseModal';

function UsernameSettingsModal({ show, onClose, options, setOptions }) {
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
      title="Username Settings"
      id="username-settings"
      size="lg"
      footer={modalFooter}
    >
      <div className="space-y-6">
        <div className="field-group">
          <div className="field-header">
            <label className="field-label">Options</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'includeNumbers', label: 'Include Numbers' },
              { name: 'includeSpecialChars', label: 'Include Special Characters' },
              { name: 'useAlliteration', label: 'Use Alliteration' },
              { name: 'useSilly', label: 'Make it Silly' },
              { name: 'useMadeUpWords', label: 'Use Made-up Words' },
              { name: 'useRhyming', label: 'Use Rhyming' },
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
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="maxLength" className="field-label">
              Maximum Length
            </label>
          </div>
          <div className="input-wrapper">
            <input
              type="number"
              id="maxLength"
              name="maxLength"
              value={options.maxLength}
              onChange={handleChange}
              min="1"
              max="30"
              className="input"
            />
          </div>
        </div>
        <div className="field-group">
          <div className="field-header">
            <label htmlFor="context" className="field-label">
              Context (Optional)
            </label>
          </div>
          <div className="input-wrapper">
            <textarea
              id="context"
              name="context"
              value={options.context}
              onChange={handleChange}
              placeholder="Add context for username generation (e.g., profession, interests, personality)"
              rows={4}
              className="textarea"
            ></textarea>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export default UsernameSettingsModal;
