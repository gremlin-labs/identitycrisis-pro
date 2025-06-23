import React, { useState, useRef, useEffect } from 'react';
import { Gear, CaretDown, Check, Key, UserPlus, UsersThree } from 'phosphor-react';
import logo from '../assets/logo.png';

function Header({ provider, handleSettingsClick, setProvider, handleBulkGenerationClick, handleNewPersona, apiKeys }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const providers = [
    { key: 'openai', label: 'OpenAI' },
    { key: 'anthropic', label: 'Anthropic' },
    { key: 'google', label: 'Google' },
    { key: 'mistral', label: 'Mistral' },
    { key: 'together', label: 'Together.ai' },
    { key: 'fireworks', label: 'Fireworks.ai' },
    { key: 'inference', label: 'Inference.net' }
  ];

  const hasValidApiKey = (providerKey) => {
    return apiKeys && apiKeys[providerKey] && apiKeys[providerKey].trim() !== '';
  };

  const getCurrentProvider = () => {
    return providers.find(p => p.key === provider) || providers[0];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProviderSelect = (providerKey) => {
    setProvider(providerKey);
    setIsDropdownOpen(false);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <img
          src={logo}
          alt="IdentityCrisis Pro Logo"
          className="header-logo"
          width="56"
          height="56"
        />
        <div className="app-title">
          <span className="font-bold">IDENTITY</span>
          <span className="font-bold">CRISIS</span>
          <span className="font-bold">PRO</span>
        </div>
      </div>
      
      <div className="header-right">
        <button
          className="header-button new-persona-button"
          onClick={handleNewPersona}
          title="Create New Persona"
          type="button"
        >
          <UserPlus size={16} weight="bold" />
          <span>New</span>
        </button>

        <button
          className="header-button bulk-generate-button"
          onClick={handleBulkGenerationClick}
          title="Bulk Generate"
          type="button"
        >
          <UsersThree size={16} weight="bold" />
          <span>Bulk</span>
        </button>

        <div className="provider-controls" ref={dropdownRef}>
          <button
            type="button"
            className="header-button provider-select-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            title="Select AI Provider"
          >
            <div className="provider-display">
              {hasValidApiKey(provider) ? (
                <Key size={14} weight="fill" className="text-valid" />
              ) : (
                <Key size={14} weight="light" className="text-text-muted opacity-40" />
              )}
              <span className="provider-name">{getCurrentProvider().label}</span>
            </div>
            <CaretDown 
              size={16} 
              weight="bold" 
              className={`dropdown-caret ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {providers.map((prov) => (
                <button
                  key={prov.key}
                  type="button"
                  className={`dropdown-item ${prov.key === provider ? 'selected' : ''}`}
                  onClick={() => handleProviderSelect(prov.key)}
                >
                  <div className="dropdown-item-content">
                    {hasValidApiKey(prov.key) ? (
                      <Key size={14} weight="fill" className="text-valid" />
                    ) : (
                      <Key size={14} weight="light" className="text-text-muted opacity-40" />
                    )}
                    <span className="dropdown-item-label">{prov.label}</span>
                  </div>
                  {prov.key === provider && (
                    <Check size={16} weight="bold" className="text-text-dark ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="header-button settings-button"
          onClick={handleSettingsClick}
          title="Settings"
          type="button"
        >
          <Gear size={18} weight="bold" />
        </button>
      </div>
    </header>
  );
}

export default Header;
