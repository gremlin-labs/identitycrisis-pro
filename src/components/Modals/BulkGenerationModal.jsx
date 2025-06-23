import React, { useState, useEffect, useRef } from 'react';
import BaseModal from './BaseModal';
import { CircleNotch, Check, Warning, CaretDown } from 'phosphor-react';
import { bounceElement } from '../../animations';
// Cost Warning Component that uses dynamic import
const CostWarning = ({ numProfiles, model }) => {
  const [costEstimate, setCostEstimate] = useState(null);

  useEffect(() => {
    const loadCostEstimate = async () => {
      try {
        const { estimateImageGenerationCost } = await import('../../utils/imageService');
        const estimate = estimateImageGenerationCost(numProfiles, model);
        setCostEstimate(estimate);
      } catch (error) {
        console.error('Error loading cost estimation:', error);
      }
    };

    loadCostEstimate();
  }, [numProfiles, model]);

  if (!costEstimate) {
    return null; // Loading state
  }

  return (
    <div className="bg-warning-light border border-warning-border text-warning-text px-3 py-2 rounded mb-3" role="alert">
      <div className="flex">
        <Warning size={16} className="mr-2 mt-0.5" />
        <div>
          <p className="font-bold text-sm">Cost Warning</p>
          <p className="text-xs">
            Generating {numProfiles} images will cost approximately ${costEstimate.totalCost.toFixed(2)} 
            ({numProfiles} images × ${costEstimate.unitCost.toFixed(3)} each). Make sure you have sufficient credits in your fal.ai account.
          </p>
        </div>
      </div>
    </div>
  );
};
// For now, let's assume direct input elements as seen in other modals.

// Add custom CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  @keyframes bounce-once {
    0% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  }
  
  .progress-pulse {
    animation: pulse 1.5s infinite;
  }
  
  .animate-bounce-once {
    animation: bounce-once 0.5s ease-out;
  }
  
  .slider-track-markers {
    height: 8px;
  }
  
  /* Improve focus styles for accessibility */
  input[type="range"]:focus + .slider-thumb {
    box-shadow: 0 0 0 3px rgba(204, 184, 143, 0.4);
  }
  
  /* Transition for status changes */
  .status-transition {
    transition: all 0.3s ease-out;
  }
  
  /* Accordion section animations */
  .accordion-section {
    overflow: hidden;
    transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
  }
  
  .accordion-section.open {
    max-height: 1000px;
    opacity: 1;
  }
  
  .accordion-section.closed {
    max-height: 0;
    opacity: 0;
  }
`;
document.head.appendChild(styleSheet);

// Default settings combined from Username and Password modals
const defaultUsernameOptions = {
  includeNumbers: false,
  includeSpecialChars: false,
  useAlliteration: false,
  useSilly: false,
  useMadeUpWords: false,
  useRhyming: false,
  maxLength: 30,
  context: '',
};

const defaultPasswordOptions = {
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSpecialChars: true,
};

const defaultFullNameOptions = {
  includeMale: true,
  includeFemale: true,
  includeNeutral: true,
  context: '',
};

const defaultImageOptions = {
  generateImages: false,
  model: 'fal-ai/flux-1/dev',
  useUsernameForAvatar: false
};

function BulkGenerationModal({ show, onClose, apiKey, provider, setSuccessMessage, setErrorMessage, onPersonasSaved }) {
  // Load settings from localStorage with defaults
  const [numProfiles, setNumProfiles] = useState(() => {
    const saved = localStorage.getItem('bulkGenerationNumProfiles');
    return saved ? parseInt(saved, 10) : 25;
  });
  
  const [usernameOptions, setUsernameOptions] = useState(() => {
    const saved = localStorage.getItem('bulkGenerationUsernameOptions');
    try {
      return saved ? JSON.parse(saved) : defaultUsernameOptions;
    } catch (error) {
      console.error('Error parsing bulk generation username options:', error);
      return defaultUsernameOptions;
    }
  });
  
  const [fullNameOptions, setFullNameOptions] = useState(() => {
    const saved = localStorage.getItem('bulkGenerationFullNameOptions');
    try {
      return saved ? JSON.parse(saved) : defaultFullNameOptions;
    } catch (error) {
      console.error('Error parsing bulk generation full name options:', error);
      return defaultFullNameOptions;
    }
  });
  
  const [passwordOptions, setPasswordOptions] = useState(() => {
    const saved = localStorage.getItem('bulkGenerationPasswordOptions');
    try {
      return saved ? JSON.parse(saved) : defaultPasswordOptions;
    } catch (error) {
      console.error('Error parsing bulk generation password options:', error);
      return defaultPasswordOptions;
    }
  });
  
  const [imageOptions, setImageOptions] = useState(() => {
    const saved = localStorage.getItem('bulkGenerationImageOptions');
    try {
      return saved ? JSON.parse(saved) : defaultImageOptions;
    } catch (error) {
      console.error('Error parsing bulk generation image options:', error);
      return defaultImageOptions;
    }
  });
  
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, generating, complete, error, saving
  const [statusMessage, setStatusMessage] = useState('');
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);
  const selectedProvider = provider;
  // Placeholder for generated data - Sage will handle the actual data structure/storage
  const [generatedData, setGeneratedData] = useState(null);
  
  // Accordion state - only one section can be open at a time
  const [openSection, setOpenSection] = useState(() => {
    const saved = localStorage.getItem('bulkGenerationOpenSection');
    return saved || 'username';
  });
  
  // Refs for animation targets
  const progressBarRef = useRef(null);
  const statusTextRef = useRef(null);
  
  // Create an AbortController ref for cancellation
  const abortControllerRef = useRef(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bulkGenerationNumProfiles', numProfiles.toString());
  }, [numProfiles]);

  useEffect(() => {
    localStorage.setItem('bulkGenerationUsernameOptions', JSON.stringify(usernameOptions));
  }, [usernameOptions]);

  useEffect(() => {
    localStorage.setItem('bulkGenerationFullNameOptions', JSON.stringify(fullNameOptions));
  }, [fullNameOptions]);

  useEffect(() => {
    localStorage.setItem('bulkGenerationPasswordOptions', JSON.stringify(passwordOptions));
  }, [passwordOptions]);

  useEffect(() => {
    localStorage.setItem('bulkGenerationImageOptions', JSON.stringify(imageOptions));
  }, [imageOptions]);

  useEffect(() => {
    localStorage.setItem('bulkGenerationOpenSection', openSection);
  }, [openSection]);

  const handleUsernameChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert numeric values to numbers
    let processedValue = value;
    if (name === 'maxLength') {
      processedValue = parseInt(value, 10);
      console.log(`Setting maxLength to ${processedValue}`);
    }
    
    setUsernameOptions((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));
    
    // Log the updated options after state update
    setTimeout(() => {
      console.log('Updated username options:', usernameOptions);
    }, 0);
  };

  const handleFullNameChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFullNameOptions((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Log the updated options after state update
    setTimeout(() => {
      console.log('Updated full name options:', fullNameOptions);
    }, 0);
  };

  const handlePasswordChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert numeric values to numbers
    let processedValue = value;
    if (name === 'length') {
      processedValue = parseInt(value, 10);
      console.log(`Setting password length to ${processedValue}`);
    }
    
    setPasswordOptions((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));
    
    // Log the updated options after state update
    setTimeout(() => {
      console.log('Updated password options:', passwordOptions);
    }, 0);
  };

  const handleSliderChange = (e) => {
    setNumProfiles(parseInt(e.target.value, 10));
  };

  const handleImageChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setImageOptions((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Log the updated options after state update
    setTimeout(() => {
      console.log('Updated image options:', imageOptions);
    }, 0);
  };

  // Toggle accordion sections
  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  // Auto-save profiles to localStorage and IndexedDB
  const autoSaveProfiles = async (profiles) => {
    try {
      // Get existing personas from localStorage
      const savedPersonasJSON = localStorage.getItem('savedPersonas');
      const savedPersonas = savedPersonasJSON ? JSON.parse(savedPersonasJSON) : [];
      
      console.log(`Found ${savedPersonas.length} existing personas in localStorage`);
      
      // Add the new personas to the existing ones
      const updatedPersonas = [...savedPersonas, ...profiles];
      
      // Save back to localStorage
      localStorage.setItem('savedPersonas', JSON.stringify(updatedPersonas));
      
      console.log(`Auto-saved ${profiles.length} new personas to localStorage. Total: ${updatedPersonas.length}`);
      
      // Also save to IndexedDB for backward compatibility
      try {
        const { savePersonasBatchToIndexedDB } = await import('../../utils/bulkGenerationService');
        await savePersonasBatchToIndexedDB(profiles);
        console.log(`Also saved to IndexedDB for backward compatibility`);
      } catch (e) {
        console.warn('Error saving to IndexedDB (non-critical):', e);
      }
      
      // Show success feedback
      setSuccessMessage(`${profiles.length} profiles saved to application storage.`);
      
      // Notify parent component about the new personas
      if (onPersonasSaved) {
        onPersonasSaved(profiles);
      }
    } catch (error) {
      console.error('Error auto-saving profiles:', error);
      throw error;
    }
  };

  const handleStartGeneration = async () => {
    setStatus('generating');
    setProgress(0);
    setGeneratedData(null); // Clear previous results
    
    // Create a new AbortController for this generation process
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      // Import the bulkGenerationService dynamically to avoid circular dependencies
      const { bulkGeneratePersonas } = await import('../../utils/bulkGenerationService');
      
      // Validate inputs before proceeding
      if (!provider) {
        throw new Error('No provider specified. Please select a valid provider in Settings.');
      }
      
      if (!apiKey) {
        throw new Error('No API key provided. Please enter a valid API key in Settings.');
      }
      
      // Prepare the options for bulk generation
      const options = {
        numProfiles,
        provider, // Use the provider from props
        apiKeys: { [provider]: apiKey, fal: localStorage.getItem('apiKeys') ? JSON.parse(localStorage.getItem('apiKeys')).fal : null }, // Include fal API key for images
        usernameOptions,
        fullNameOptions,
        passwordOptions,
        imageOptions,
        
        // Progress callback
        onProgress: (percent, current, total, message) => {
          setProgress(percent);
          if (message) {
            setStatusMessage(message);
          }
        },
        
        // Error callback
        onError: (error, batchIndex) => {
          console.error(`Error in batch ${batchIndex}:`, error);
          // We don't set error status here as we want to continue processing other batches
        },
        
        // Batch complete callback
        onBatchComplete: (batchResults, batchIndex) => {
          console.log(`Batch ${batchIndex} complete:`, batchResults.length, 'profiles');
        },
        
        // Pass the abort signal
        signal
      };
      
      // Start the bulk generation process
      const results = await bulkGeneratePersonas(options);
      
      // Update state with the results
      setGeneratedData({
        message: `${results.length} profiles generated successfully.`,
        profiles: results
      });
      
      // Auto-save the generated profiles
      setStatus('saving');
      setStatusMessage('Saving profiles to app...');
      setProgress(95); // Show near completion for saving phase
      
      try {
        await autoSaveProfiles(results);
        setProgress(100); // Complete progress
        setStatus('complete');
        setStatusMessage('');
        
        // Add completion animation
        if (statusTextRef.current) {
          bounceElement(statusTextRef.current);
        }
      } catch (saveError) {
        console.error('Error auto-saving profiles:', saveError);
        setProgress(100); // Complete progress even on save error
        setStatus('complete'); // Still mark as complete even if save fails
        setErrorMessage(`Profiles generated but failed to save: ${saveError.message}`);
      }
    } catch (error) {
      // Check if this was a user cancellation
      if (error.message === 'Generation cancelled by user') {
        console.log('Generation was cancelled by user');
        // We don't need to do anything special here, the modal will be closed
      } else {
        // This was an actual error
        console.error('Error during bulk generation:', error);
        setStatus('error');
        
        // Check if this is an API key related error
        if (error.message.includes('API key') || error.message.includes('provider')) {
          setShowApiKeyWarning(true);
        }
        
        setGeneratedData({ message: `Error: ${error.message}` });
      }
    }
  };
  
  // Cancel the generation process
  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSave = async () => {
    if (!generatedData?.profiles) {
      console.error('No profiles to save');
      return;
    }
    
    try {
      // Get existing personas from localStorage
      const savedPersonasJSON = localStorage.getItem('savedPersonas');
      const savedPersonas = savedPersonasJSON ? JSON.parse(savedPersonasJSON) : [];
      
      console.log(`Found ${savedPersonas.length} existing personas in localStorage`);
      
      // Add the new personas to the existing ones
      const updatedPersonas = [...savedPersonas, ...generatedData.profiles];
      
      // Save back to localStorage
      localStorage.setItem('savedPersonas', JSON.stringify(updatedPersonas));
      
      console.log(`Saved ${generatedData.profiles.length} new personas to localStorage. Total: ${updatedPersonas.length}`);
      
      // Also save to IndexedDB for backward compatibility
      try {
        const { savePersonasBatchToIndexedDB } = await import('../../utils/bulkGenerationService');
        await savePersonasBatchToIndexedDB(generatedData.profiles);
        console.log(`Also saved to IndexedDB for backward compatibility`);
      } catch (e) {
        console.warn('Error saving to IndexedDB (non-critical):', e);
      }
      
      // Show success feedback
      setSuccessMessage(`${generatedData.profiles.length} profiles saved to application storage.`);
      
      // Notify parent component about the new personas
      if (onPersonasSaved) {
        onPersonasSaved(generatedData.profiles);
      }
      
      // Close the modal after successful save
      onClose();
    } catch (error) {
      console.error('Error saving profiles:', error);
      setErrorMessage(`Error saving profiles: ${error.message}`);
    }
  };

  const handleDownload = () => {
    if (!generatedData?.profiles) {
      console.error('No profiles to download');
      return;
    }
    
    try {
      // Import the download function dynamically
      import('../../utils/bulkGenerationService').then(({ downloadJSON }) => {
        // Generate a filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `personas-${numProfiles}-${timestamp}.json`;
        
        // Download the JSON file
        downloadJSON(generatedData.profiles, filename);
      });
    } catch (error) {
      console.error('Error downloading profiles:', error);
      setErrorMessage(`Error downloading profiles: ${error.message}`);
    }
  };

  const attemptClose = () => {
    if (status === 'generating') {
      setShowCloseWarning(true);
    } else {
      onClose(); // Close directly if not generating
      resetModalState();
    }
  };

  const confirmClose = () => {
    // Cancel the generation process if it's running
    if (status === 'generating') {
      cancelGeneration();
    }
    
    setShowCloseWarning(false);
    onClose();
    resetModalState();
  };

  const cancelClose = () => {
    setShowCloseWarning(false);
  };

  const resetModalState = () => {
    setNumProfiles(25);
    setUsernameOptions(defaultUsernameOptions);
    setFullNameOptions(defaultFullNameOptions);
    setPasswordOptions(defaultPasswordOptions);
    setImageOptions(defaultImageOptions);
    setProgress(0);
    setStatus('idle');
    setStatusMessage('');
    setGeneratedData(null);
    setShowApiKeyWarning(false);
  }

  // Reset state when modal is hidden
  useEffect(() => {
    if (!show) {
      // Delay reset slightly to allow closing animation
      const timer = setTimeout(() => {
        resetModalState();
      }, 300); // Adjust timing based on animation duration
      return () => clearTimeout(timer);
    }
  }, [show]);


  const renderFooter = () => {
    switch (status) {
      case 'idle':
        return (
          <button
            onClick={handleStartGeneration}
            className="button button-primary transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Start generating profiles"
          >
            Start Generation
          </button>
        );
      case 'generating':
        return (
          <button
            onClick={attemptClose}
            className="button button-danger transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Cancel generation process"
          >
            <span className="flex items-center">
              <CircleNotch className="animate-spin mr-2" size={18} />
              Cancel Generation
            </span>
          </button>
        );
      case 'saving':
        return (
          <button
            disabled
            className="button transition-all duration-200"
            aria-label="Saving profiles to application"
          >
            <span className="flex items-center">
              <CircleNotch className="animate-spin mr-2" size={18} />
              Saving...
            </span>
          </button>
        );
      case 'complete':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="button button-primary transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close modal - profiles already saved"
            >
              <span className="flex items-center">
                <Check className="mr-2" size={18} />
                Done
              </span>
            </button>
            <button
              onClick={handleDownload}
              className="button button-secondary transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Download generated profiles as JSON file"
            >
              Download JSON
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="button transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Save generated profiles to application"
            >
              <span className="flex items-center">
                <Warning className="mr-2" size={18} />
                Save to App
              </span>
            </button>
            <button
              onClick={handleDownload}
              className="button button-secondary transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Download generated profiles as JSON file"
            >
              Download JSON
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Enhanced Warning Dialog with improved accessibility and animations
  const renderCloseWarning = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-title"
    >
      <div
        className="bg-background-modal p-6 rounded-lg border border-border shadow-lg max-w-sm w-full animate-slideIn"
        style={{ animation: 'slideInUp 0.3s ease-out forwards' }}
      >
        <h3 id="warning-title" className="text-lg font-semibold mb-4 flex items-center">
                              <Warning size={24} className="text-error mr-2" />
          Cancel Generation?
        </h3>
        <p className="mb-6">Are you sure you want to close the modal? The current generation process will be cancelled.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelClose}
            className="button button-secondary transition-all duration-200 hover:scale-105 active:scale-95"
            autoFocus
          >
            Keep Generating
          </button>
          <button
            onClick={confirmClose}
            className="button button-danger transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Render focused progress view during generation and saving
  const renderProgressView = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            {status === 'generating' && 'Generating Profiles'}
            {status === 'saving' && 'Saving Profiles'}
            {status === 'complete' && 'Generation Complete!'}
            {status === 'error' && 'Generation Error'}
          </h2>
          <p className="text-text-muted">
            {status === 'generating' && `Creating ${numProfiles} unique personas...`}
            {status === 'saving' && 'Saving profiles to your app...'}
            {status === 'complete' && `Successfully created ${numProfiles} profiles!`}
            {status === 'error' && 'An error occurred during generation.'}
          </p>
        </div>

        {/* Large Progress Bar */}
        <div className="mb-6">
          <div
            className="w-full bg-neutral-200 rounded-full h-6 overflow-hidden border border-border shadow-sm relative"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Generation progress: ${progress}% complete`}
          >
            <div
              className={`h-6 rounded-full transition-all duration-300 ease-out ${
                status === 'error' ? 'bg-error' :
                status === 'complete' ? 'bg-accent' : 'bg-accent'
              } ${status === 'generating' || status === 'saving' ? 'progress-pulse' : ''}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Progress Percentage */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-text-muted">
              {status === 'generating' && `Batch ${Math.ceil((progress / 100) * Math.ceil(numProfiles / 25))} of ${Math.ceil(numProfiles / 25)}`}
              {status === 'saving' && 'Saving...'}
              {status === 'complete' && 'Complete'}
              {status === 'error' && 'Error'}
            </span>
            <span className="text-lg font-semibold text-accent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="text-center mb-6">
            <p className="text-sm text-text-muted italic" aria-live="polite">
              {statusMessage}
            </p>
          </div>
        )}

        {/* API Key Warning for Errors */}
        {status === 'error' && showApiKeyWarning && (
          <div className="bg-error-light border border-error-border text-error-text px-4 py-3 rounded mb-6" role="alert">
            <div className="flex">
              <Warning size={16} className="mr-2 mt-0.5" />
              <div>
                <p className="font-bold text-sm">API Key Required</p>
                <p className="text-xs">
                  To generate high-quality, unique personas, please provide a valid API key for {selectedProvider}.
                  Without an API key, the application cannot make real API calls.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          {status === 'generating' && (
            <button
              onClick={attemptClose}
              className="button button-danger transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Cancel generation process"
            >
              <span className="flex items-center">
                <CircleNotch className="animate-spin mr-2" size={18} />
                Cancel Generation
              </span>
            </button>
          )}
          {status === 'saving' && (
            <button
              disabled
              className="button transition-all duration-200"
              aria-label="Saving profiles to application"
            >
              <span className="flex items-center">
                <CircleNotch className="animate-spin mr-2" size={18} />
                Saving...
              </span>
            </button>
          )}
          {status === 'complete' && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="button button-primary transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Close modal - profiles already saved"
              >
                <span className="flex items-center">
                  <Check className="mr-2" size={18} />
                  Done
                </span>
              </button>
              <button
                onClick={handleDownload}
                className="button button-secondary transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Download generated profiles as JSON file"
              >
                Download JSON
              </button>
            </div>
          )}
          {status === 'error' && (
            <div className="flex gap-3 justify-center">
              {generatedData?.profiles && generatedData.profiles.length > 0 && (
                <>
                  <button
                    onClick={handleSave}
                    className="button transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Save generated profiles to application"
                  >
                    <span className="flex items-center">
                      <Warning className="mr-2" size={18} />
                      Save Partial Results
                    </span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="button button-secondary transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Download generated profiles as JSON file"
                  >
                    Download JSON
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="button button-danger transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BaseModal
        show={show}
        onClose={attemptClose} // Use attemptClose to handle warning
        title={status === 'generating' || status === 'saving' || status === 'complete' || status === 'error' ? "" : "Bulk Persona Generation"}
        id="bulk-generation-modal"
        size="lg"
        footer={status === 'generating' || status === 'saving' || status === 'complete' || status === 'error' ? null : renderFooter()}
        closeOnBackdropClick={status !== 'generating' && status !== 'saving'} // Prevent backdrop close during generation/saving
      >
        {/* Show progress view during generation, saving, completion, or error */}
        {(status === 'generating' || status === 'saving' || status === 'complete' || status === 'error') ? renderProgressView() : (
        <div className="space-y-4">
          {/* --- Number of Profiles Slider --- */}
          <div className="field-group">
            <div className="field-header flex justify-between items-center mb-4">
              <label htmlFor="numProfiles" className="field-label text-sm font-medium mb-4">
                Number of Profiles to Generate:
              </label>
              <span className="font-semibold text-base" style={{ color: 'var(--color-primary)' }}>{numProfiles}</span>
            </div>
            <div className="input-wrapper relative">
              <div className="slider-container relative">
                <div className="slider-track-markers relative w-full h-2 bg-neutral-200 rounded-full">
                  {/* Step markers */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute top-1/2 w-1 h-1 rounded-full -translate-y-1/2 ${
                        (i+1)*25 <= numProfiles ? 'bg-primary' : 'bg-neutral-300'
                      }`}
                      style={{ left: `${(i / 19) * 100}%` }}
                    ></div>
                  ))}
                </div>
                
                <input
                  type="range"
                  id="numProfiles"
                  name="numProfiles"
                  min="25"
                  max="500"
                  step="25"
                  value={numProfiles}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-transparent absolute top-0 left-0 appearance-none cursor-pointer range-lg accent-primary z-10 opacity-0"
                  aria-label={`Number of profiles to generate: ${numProfiles}`}
                  aria-valuemin="25"
                  aria-valuemax="500"
                  aria-valuenow={numProfiles}
                />
                
                {/* Custom slider thumb */}
                <div
                  className="slider-thumb absolute w-6 h-6 bg-accent border border-accent-hover rounded-full shadow-md transition-transform duration-150 ease-out hover:scale-110 active:scale-95 pointer-events-none"
                  style={{
                    left: `calc(${((numProfiles - 25) / 475) * 100}% - 8px)`,
                    top: '1px',
                    transform: 'translateY(-50%)'
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-neutral-500 mt-4">
                <span>25</span>
                <span className="text-primary font-medium">{numProfiles}</span>
                <span>500</span>
              </div>
            </div>
          </div>

          {/* --- Username Settings --- */}
          <div className="field-group border-t border-border pt-3">
            <div 
              className="field-header mb-2 cursor-pointer flex items-center justify-between hover:bg-opacity-5 hover:bg-primary rounded p-2 -m-2 transition-colors"
              onClick={() => toggleSection('username')}
            >
              <label className="field-label font-medium text-sm cursor-pointer">Username Options</label>
              <CaretDown 
                size={16} 
                className={`transition-transform duration-200 ${openSection === 'username' ? 'rotate-180' : ''}`}
                style={{ color: 'var(--color-text-muted)' }}
              />
            </div>
            {openSection === 'username' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
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
                      checked={usernameOptions[name]}
                      onChange={handleUsernameChange}
                      className="sr-only peer"
                      disabled={status === 'generating'}
                    />
                    <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="maxLength" className="field-label text-xs mb-1 block">Max Length</label>
                <input
                  type="number"
                  id="maxLength"
                  name="maxLength"
                  value={usernameOptions.maxLength}
                  onChange={handleUsernameChange}
                  min="1"
                  max="30"
                  className="input text-sm py-1"
                  disabled={status === 'generating'}
                />
              </div>
              <div>
                <label htmlFor="context" className="field-label text-xs mb-1 block">Context (Optional)</label>
                <textarea
                  id="context"
                  name="context"
                  value={usernameOptions.context}
                  onChange={handleUsernameChange}
                  placeholder="e.g., profession, interests"
                  rows={1}
                  className="textarea text-sm py-1"
                  disabled={status === 'generating'}
                ></textarea>
                              </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Full Name Settings --- */}
          <div className="field-group border-t border-border pt-3">
            <div 
              className="field-header mb-2 cursor-pointer flex items-center justify-between hover:bg-opacity-5 hover:bg-primary rounded p-2 -m-2 transition-colors"
              onClick={() => toggleSection('fullname')}
            >
              <label className="field-label font-medium text-sm cursor-pointer">Full Name Options</label>
              <CaretDown 
                size={16} 
                className={`transition-transform duration-200 ${openSection === 'fullname' ? 'rotate-180' : ''}`}
                style={{ color: 'var(--color-text-muted)' }}
              />
            </div>
            {openSection === 'fullname' && (
              <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
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
                      checked={fullNameOptions[name]}
                      onChange={handleFullNameChange}
                      className="sr-only peer"
                      disabled={status === 'generating'}
                    />
                    <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="fullNameContext" className="field-label text-xs mb-1 block">Context (Optional)</label>
              <textarea
                id="fullNameContext"
                name="context"
                value={fullNameOptions.context}
                onChange={handleFullNameChange}
                placeholder="e.g., cultural background, era, style preference"
                rows={1}
                className="textarea text-sm py-1"
                disabled={status === 'generating'}
              >              </textarea>
                </div>
              </div>
            )}
          </div>

          {/* --- Password Settings --- */}
          <div className="field-group border-t border-border pt-3">
            <div 
              className="field-header mb-2 cursor-pointer flex items-center justify-between hover:bg-opacity-5 hover:bg-primary rounded p-2 -m-2 transition-colors"
              onClick={() => toggleSection('password')}
            >
              <label className="field-label font-medium text-sm cursor-pointer">Password Options</label>
              <CaretDown 
                size={16} 
                className={`transition-transform duration-200 ${openSection === 'password' ? 'rotate-180' : ''}`}
                style={{ color: 'var(--color-text-muted)' }}
              />
            </div>
            {openSection === 'password' && (
              <div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
               {[
                 { name: 'includeUppercase', label: 'Uppercase' },
                 { name: 'includeLowercase', label: 'Lowercase' },
                 { name: 'includeNumbers', label: 'Numbers' },
                 { name: 'includeSpecialChars', label: 'Special Chars' },
               ].map(({ name, label }) => (
                 <div key={name} className="flex items-center">
                   <label className="relative inline-flex items-center cursor-pointer mr-3">
                     <input
                       type="checkbox"
                       name={name}
                       checked={passwordOptions[name]}
                       onChange={handlePasswordChange}
                       className="sr-only peer"
                       disabled={status === 'generating'}
                     />
                     <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                   </label>
                   <span className="text-sm" style={{ color: 'var(--color-text)' }}>{label}</span>
                 </div>
               ))}
                <div> {/* Placeholder for alignment if needed */}</div>
                 <div> {/* Placeholder for alignment if needed */}</div>
                 <div>
                    <label htmlFor="length" className="field-label text-xs mb-1 block">Length</label>
                    <input
                      type="number"
                      id="length"
                      name="length"
                      value={passwordOptions.length}
                      onChange={handlePasswordChange}
                      min="4"
                      max="64"
                      className="input text-sm py-1"
                      disabled={status === 'generating'}
                    />
                 </div>
               </div>
              </div>
            )}
          </div>

          {/* --- Image Generation Settings --- */}
          <div className="field-group border-t border-border pt-3">
            <div 
              className="field-header mb-2 cursor-pointer flex items-center justify-between hover:bg-opacity-5 hover:bg-primary rounded p-2 -m-2 transition-colors"
              onClick={() => toggleSection('images')}
            >
              <label className="field-label font-medium text-sm cursor-pointer">Profile Images</label>
              <CaretDown 
                size={16} 
                className={`transition-transform duration-200 ${openSection === 'images' ? 'rotate-180' : ''}`}
                style={{ color: 'var(--color-text-muted)' }}
              />
            </div>
            {openSection === 'images' && (
              <div>
                {/* Generate Images Toggle */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="field-label text-sm font-medium">Generate Profile Images</label>
                      <p className="text-xs text-text-muted mt-1">
                        AI-generated portrait images using fal.ai (requires fal.ai API key)
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="generateImages"
                        checked={imageOptions.generateImages}
                        onChange={handleImageChange}
                        className="sr-only peer"
                        disabled={status === 'generating'}
                      />
                      <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                  </div>
                </div>

                {/* Username-based Avatar Toggle */}
                {imageOptions.generateImages && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="field-label text-sm font-medium">Use Username for Avatars</label>
                        <p className="text-xs text-text-muted mt-1">
                          Generate creative avatars based on usernames instead of human portraits
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="useUsernameForAvatar"
                          checked={imageOptions.useUsernameForAvatar}
                          onChange={handleImageChange}
                          className="sr-only peer"
                          disabled={status === 'generating'}
                        />
                        <div className="w-11 h-6 bg-neutral-200 rounded-full peer-focus:outline-none peer peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-input-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Cost Warning */}
                {imageOptions.generateImages && (
                  <CostWarning numProfiles={numProfiles} model={imageOptions.model} />
                )}

                {/* Model Selection */}
                {imageOptions.generateImages && (
                  <div>
                    <label htmlFor="imageModel" className="field-label text-xs mb-1 block">AI Model</label>
                    <select
                      id="imageModel"
                      name="model"
                      value={imageOptions.model}
                      onChange={handleImageChange}
                      className="input text-sm py-1"
                      disabled={status === 'generating'}
                    >
                      <option value="fal-ai/flux-1/dev">FLUX.1 Dev (Best Quality)</option>
                      <option value="rundiffusion-fal/juggernaut-flux/base">Juggernaut Base (Balanced)</option>
                      <option value="rundiffusion-fal/juggernaut-flux/lightning">Juggernaut Lightning (Fastest)</option>
                      <option value="fal-ai/bytedance/seedream/v3/text-to-image">SeeDream V3 (ByteDance)</option>
                      <option value="fal-ai/minimax/image-01">Minimax Image-01</option>
                      <option value="fal-ai/ideogram/v3">Ideogram V3 (Text Rendering)</option>
                      <option value="rundiffusion-fal/rundiffusion-photo-flux">RunDiffusion Photo FLUX</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>



        </div>
        )}
      </BaseModal>

      {/* Conditionally render the warning dialog */}
      {showCloseWarning && renderCloseWarning()}
    </>
  );
}

export default BulkGenerationModal;