import React from 'react';
import BaseModal from './BaseModal';

function FullNameSettingsModal({ show, onClose, options, setOptions }) {
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
      title="Full Name Settings"
      id="fullname-settings"
      size="md"
      footer={modalFooter}
    >
      <div className="space-y-6">
        <div className="field-group">
          <div className="field-header">
            <label className="field-label">Gender Preferences</label>
            <p className="field-note">Select which types of names to include in generation</p>
          </div>
          <div className="space-y-3">
            {[
              { name: 'includeMale', label: 'Male Names' },
              { name: 'includeFemale', label: 'Female Names' },
              { name: 'includeNeutral', label: 'Gender Neutral Names' },
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
            <label htmlFor="context" className="field-label">
              Context (Optional)
            </label>
          </div>
          <div className="input-wrapper">
            <textarea
              id="context"
              name="context"
              value={options.context || ''}
              onChange={handleChange}
              placeholder="Add context for name generation (e.g., cultural background, era, style preference)"
              rows={3}
              className="textarea"
            ></textarea>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export default FullNameSettingsModal; 