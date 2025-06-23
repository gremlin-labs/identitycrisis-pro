import React from 'react';
import BaseModal from './BaseModal';

function ImageSettingsModal({ show, onClose, imageModel, setImageModel }) {
  const models = [
    { 
      value: 'fal-ai/flux-1/dev', 
      label: 'FLUX.1 Dev', 
      description: 'Best quality, slower generation (~$0.025 per image)' 
    },
    { 
      value: 'rundiffusion-fal/juggernaut-flux/base', 
      label: 'Juggernaut Base', 
      description: 'Balanced quality and speed (~$0.020 per image)' 
    },
    { 
      value: 'rundiffusion-fal/juggernaut-flux/lightning', 
      label: 'Juggernaut Lightning', 
      description: 'Fastest generation, good quality (~$0.015 per image)' 
    }
  ];

  const handleModelChange = (e) => {
    setImageModel(e.target.value);
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
      title="Image Generation Settings"
      id="image-settings-modal"
      size="md"
      footer={modalFooter}
    >
      <div className="space-y-4">
        <div className="field-group">
          <div className="field-header">
            <label className="field-label">
              AI Model Selection
            </label>
            <p className="text-sm text-text-muted mt-1">
              Choose the AI model for generating profile images. Different models offer varying quality, speed, and cost.
            </p>
          </div>
          
          <div className="space-y-3 mt-3">
            {models.map((model) => (
              <div key={model.value} className="relative">
                <label className="flex items-start cursor-pointer p-3 border border-border rounded-lg hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="imageModel"
                    value={model.value}
                    checked={imageModel === model.value}
                    onChange={handleModelChange}
                    className="mt-1 mr-3 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{model.label}</div>
                    <div className="text-xs text-text-muted mt-1">{model.description}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-info-light border border-info-border text-info-text px-3 py-2 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Image generation requires a fal.ai API key. Images will be downloaded and stored locally 
            in your IdentityCrisis Pro folder to ensure they remain accessible even if the original URLs expire.
          </p>
        </div>
      </div>
    </BaseModal>
  );
}

export default ImageSettingsModal; 