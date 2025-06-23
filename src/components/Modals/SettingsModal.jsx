import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { IMAGE_STYLES, STYLE_CATEGORIES, getAllStyleIds } from '../../utils/imageStyles';

function SettingsModal({ 
  show, 
  onClose, 
  apiKeys, 
  updateApiKey, 
  provider, 
  setProvider, 
  imageModel, 
  setImageModel,
  useUsernameForAvatar,
  setUseUsernameForAvatar,
  enabledImageStyles,
  updateEnabledImageStyles
}) {
  const [activeTab, setActiveTab] = useState('providers'); // 'providers', 'imageModel', or 'imageStyles'
  
  const llmProviders = [
    { key: 'openai', label: 'OpenAI' },
    { key: 'anthropic', label: 'Anthropic' },
    { key: 'google', label: 'Google' },
    { key: 'mistral', label: 'Mistral' },
    { key: 'together', label: 'Together.ai' },
    { key: 'fireworks', label: 'Fireworks.ai' },
    { key: 'inference', label: 'Inference.net' }
  ];

  const imageProviders = [
    { key: 'fal', label: 'fal.ai' }
  ];

  const imageModels = [
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
    },
    { 
      value: 'fal-ai/bytedance/seedream/v3/text-to-image', 
      label: 'SeeDream V3', 
      description: 'ByteDance\'s high-quality text-to-image model' 
    },
    { 
      value: 'fal-ai/minimax/image-01', 
      label: 'Minimax Image-01', 
      description: 'Advanced image generation with creative styling' 
    },
    { 
      value: 'fal-ai/ideogram/v3', 
      label: 'Ideogram V3', 
      description: 'Excellent for text rendering and detailed imagery' 
    },
    { 
      value: 'rundiffusion-fal/rundiffusion-photo-flux', 
      label: 'RunDiffusion Photo FLUX', 
      description: 'Photorealistic image generation with FLUX architecture' 
    }
  ];

  const handleApiKeyChange = (providerKey, value) => {
    updateApiKey(providerKey, value);
  };

  const handleImageModelChange = (e) => {
    setImageModel(e.target.value);
  };

  const handleStyleToggle = (styleId) => {
    updateEnabledImageStyles(styleId, !enabledImageStyles[styleId]);
  };

  const handleCategoryToggle = (category) => {
    const categoryStyles = STYLE_CATEGORIES[category];
    const allEnabled = categoryStyles.every(styleId => enabledImageStyles[styleId]);
    
    categoryStyles.forEach(styleId => {
      updateEnabledImageStyles(styleId, !allEnabled);
    });
  };

  const handleToggleAllStyles = () => {
    const allStyleIds = getAllStyleIds();
    const allEnabled = allStyleIds.every(styleId => enabledImageStyles[styleId]);
    
    allStyleIds.forEach(styleId => {
      updateEnabledImageStyles(styleId, !allEnabled);
    });
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const modalFooter = (
    <button
      onClick={onClose}
      className="button"
    >
      Save
    </button>
  );

  const tabNavigation = (
    <div className="flex border-b border-border">
      <button
        onClick={() => handleTabChange('providers')}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'providers'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text hover:border-border'
        }`}
      >
        Providers
      </button>
      <button
        onClick={() => handleTabChange('imageModel')}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'imageModel'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text hover:border-border'
        }`}
      >
        Image Model
      </button>
      <button
        onClick={() => handleTabChange('imageStyles')}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'imageStyles'
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text hover:border-border'
        }`}
      >
        Image Styles
      </button>
    </div>
  );

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title="Settings"
      id="settings-modal"
      size="lg"
      footer={modalFooter}
      headerContent={tabNavigation}
    >
      <div>
          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              {/* LLM API Keys */}
              <div className="field-group">
                <div className="field-header mb-4">
                  <label className="field-label font-medium">LLM Provider API Keys</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {llmProviders.map((prov) => (
                    <div key={prov.key} className="space-y-1">
                      <label
                        htmlFor={`api-key-${prov.key}`}
                        className="field-label text-sm"
                        style={{ marginBottom: '4px', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}
                      >
                        {prov.label}
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          id={`api-key-${prov.key}`}
                          value={apiKeys[prov.key] || ''}
                          onChange={(e) => handleApiKeyChange(prov.key, e.target.value)}
                          placeholder={`Enter ${prov.label} API key`}
                          className="input"
                          style={{ fontSize: 'var(--font-size-sm)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-info-light border border-info-border text-info-text px-3 py-2 rounded">
                <p style={{ fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
                  Your API keys are stored locally in your browser and never sent to our servers.
                </p>
              </div>
            </div>
          )}

          {/* Image Model Tab */}
          {activeTab === 'imageModel' && (
            <div className="space-y-6">
              {/* fal.ai API Key */}
              <div className="field-group">
                <label className="field-label text-sm font-medium">fal.ai API Key</label>
                <input
                  type="password"
                  value={apiKeys.fal || ''}
                  onChange={(e) => handleApiKeyChange('fal', e.target.value)}
                  placeholder="Enter your fal.ai API key"
                  className="input w-full"
                />
                <p className="text-xs text-text-muted mt-2">
                  Required for AI image generation. Get your key from{' '}
                  <a 
                    href="https://fal.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    fal.ai
                  </a>
                </p>
              </div>

              {/* Model Selection */}
              <div className="field-group">
                <label className="field-label text-sm font-medium">Default Image Model</label>
                <div className="space-y-2 mt-3">
                  {imageModels.map((model) => (
                    <div key={model.value} className="relative">
                      <label className="flex items-start cursor-pointer p-3 border border-border rounded-lg hover:border-primary transition-colors">
                        <input
                          type="radio"
                          name="imageModel"
                          value={model.value}
                          checked={imageModel === model.value}
                          onChange={handleImageModelChange}
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

              {/* Username Avatar Toggle */}
              <div className="field-group">
                <label className="field-label text-sm font-medium">Avatar Generation Mode</label>
                <div className="mt-3">
                  <label className="flex items-start cursor-pointer p-3 border border-border rounded-lg hover:border-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={useUsernameForAvatar}
                      onChange={(e) => setUseUsernameForAvatar(e.target.checked)}
                      className="mt-1 mr-3 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Use Username for Creative Avatars</div>
                      <div className="text-xs text-text-muted mt-1">
                        Generate creative, non-human avatars based on usernames instead of realistic human portraits. 
                        Perfect for creating authentic online personas that use artistic avatars, logos, or symbolic representations.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Image Styles Tab */}
          {activeTab === 'imageStyles' && (
            <div className="space-y-6">
              {/* Header with global toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">Style Selection</h3>
                  <p className="text-xs text-text-muted mt-1">
                    Choose which styles can be randomly selected for image generation
                  </p>
                </div>
                <button
                  onClick={handleToggleAllStyles}
                  className="text-xs px-3 py-1 rounded border border-border hover:bg-surface-hover transition-colors"
                >
                  {getAllStyleIds().every(styleId => enabledImageStyles[styleId]) ? 'Disable All' : 'Enable All'}
                </button>
              </div>

              {/* Style categories */}
              <div className="space-y-4">
                {Object.entries(STYLE_CATEGORIES).map(([category, styleIds]) => {
                  const categoryEnabled = styleIds.every(styleId => enabledImageStyles[styleId]);
                  const categoryPartial = styleIds.some(styleId => enabledImageStyles[styleId]) && !categoryEnabled;
                  
                  return (
                    <div key={category} className="border border-border rounded-lg">
                      <div className="p-3 bg-surface-subtle">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{category}</h4>
                          <button
                            onClick={() => handleCategoryToggle(category)}
                            className="text-xs px-2 py-1 rounded border border-border hover:bg-surface-hover transition-colors"
                          >
                            {categoryEnabled ? 'Disable All' : categoryPartial ? 'Enable All' : 'Enable All'}
                          </button>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        {styleIds.map(styleId => {
                          const style = IMAGE_STYLES[styleId];
                          return (
                            <div key={styleId} className="flex items-center justify-between py-2">
                              <div className="flex-1">
                                <div className="text-sm font-medium">{style.name}</div>
                                <div className="text-xs text-text-muted">{style.description}</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer ml-3">
                                <input
                                  type="checkbox"
                                  checked={enabledImageStyles[styleId] || false}
                                  onChange={() => handleStyleToggle(styleId)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Info about random selection */}
              <div className="bg-info-light border border-info-border text-info-text px-3 py-2 rounded">
                <p className="text-sm">
                  <strong>How it works:</strong> When generating images, a random style will be selected from your enabled styles. 
                  If no styles are enabled, all styles will be available for selection.
                </p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    );
  }

export default SettingsModal;
