import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Header from './components/Header';
import SettingsModal from './components/Modals/SettingsModal';
import ApiKeyReminderModal from './components/Modals/ApiKeyReminderModal';
import UsernameSettingsModal from './components/Modals/UsernameSettingsModal';
import FullNameSettingsModal from './components/Modals/FullNameSettingsModal';
import PasswordSettingsModal from './components/Modals/PasswordSettingsModal';

import ErrorModal from './components/Modals/ErrorModal';
import EditPersonaModal from './components/Modals/EditPersonaModal';
import BulkGenerationModal from './components/Modals/BulkGenerationModal';
import ImageModal from './components/Modals/ImageModal';
import { jellySpring, jellyModal, jellyModalOut, jellyPageLoad } from './animations.js';
import { generateUsername, generateFullName, generateAddress, generateBio, generatePassword, generatePhysicalDescription } from './utils/apiService';
import { getDefaultEnabledStyles } from './utils/imageStyles';

function App() {
  // State for API provider
  const [provider, setProvider] = useState('openai');
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    mistral: '',
    together: '',
    fireworks: '',
    inference: '',
    fal: ''
  });
  const [showApiKeyReminder, setShowApiKeyReminder] = useState(false);

  // State for form fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [gender, setGender] = useState('Male'); // Male, Female, Nonbinary

  // State for loading indicators
  const [isGeneratingUsername, setIsGeneratingUsername] = useState(false);
  const [isGeneratingFullName, setIsGeneratingFullName] = useState(false);
  const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isGeneratingProfileImage, setIsGeneratingProfileImage] = useState(false);
  const [isGeneratingPhysicalDescription, setIsGeneratingPhysicalDescription] = useState(false);

  // State for modals
  const [showSettings, setShowSettings] = useState(false);
  const [showUsernameSettings, setShowUsernameSettings] = useState(false);
  const [showFullNameSettings, setShowFullNameSettings] = useState(false);
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [showBulkGenerationModal, setShowBulkGenerationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRetryable, setIsRetryable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State for username settings
  const [usernameOptions, setUsernameOptions] = useState({
    includeNumbers: true,
    includeSpecialChars: false,
    maxLength: 15,
    context: '',
    useAlliteration: false,
    useSilly: false,
    useMadeUpWords: false,
    useRhyming: false,
  });

  // State for full name settings
  const [fullNameOptions, setFullNameOptions] = useState({
    includeMale: true,
    includeFemale: true,
    includeNeutral: true,
    context: '',
  });

  // State for password settings
  const [passwordOptions, setPasswordOptions] = useState({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
  });

  // State for image generation settings
  const [imageModel, setImageModel] = useState('fal-ai/flux-1/dev');
  const [useUsernameForAvatar, setUseUsernameForAvatar] = useState(false);
  
  // State for image styles settings
  const [enabledImageStyles, setEnabledImageStyles] = useState({});

  // State for saved personas
  const [savedPersonas, setSavedPersonas] = useState(() => {
    const saved = localStorage.getItem('savedPersonas');
    console.log('=== DEBUGGING SAVED PERSONAS ===');
    console.log('Raw savedPersonas from localStorage:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Parsed savedPersonas:', parsed);
        console.log('Number of saved personas:', parsed.length);
        return parsed;
      } catch (error) {
        console.error('Error parsing saved personas:', error);
        return [];
      }
    }
    console.log('No saved personas found');
    console.log('=== END SAVED PERSONAS DEBUG ===');
    return [];
  });
  const [editingPersona, setEditingPersona] = useState(null);
  
  // State for save status and animation
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Refs for animation
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  // Load saved API keys from localStorage
  useEffect(() => {
    console.log('Loading API keys from localStorage...');
    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      try {
        const parsedApiKeys = JSON.parse(savedApiKeys);
        setApiKeys(parsedApiKeys);
        console.log('API keys loaded from localStorage');
      } catch (error) {
        console.error('Error parsing saved API keys:', error);
      }
    } else {
      console.log('No API keys found in localStorage');
    }

    console.log('Loading provider from localStorage...');
    const savedProvider = localStorage.getItem('provider');
    console.log(`Saved provider: ${savedProvider || 'none'}`);
    
    if (savedProvider) {
      setProvider(savedProvider);
      console.log(`Provider set to: ${savedProvider}`);
    } else {
      console.log('No provider found in localStorage, using default');
    }

    const savedImageModel = localStorage.getItem('imageModel');
    console.log(`Loading image model from localStorage: ${savedImageModel || 'none'}`);
    
    if (savedImageModel) {
      setImageModel(savedImageModel);
      console.log(`Image model set to: ${savedImageModel}`);
    } else {
      console.log('No image model found in localStorage, using default');
    }

    // Load username avatar setting
    const savedUseUsernameForAvatar = localStorage.getItem('useUsernameForAvatar');
    if (savedUseUsernameForAvatar !== null) {
      setUseUsernameForAvatar(JSON.parse(savedUseUsernameForAvatar));
      console.log(`Username avatar setting loaded: ${savedUseUsernameForAvatar}`);
    }

    // Load individual item settings
    const savedUsernameOptions = localStorage.getItem('usernameOptions');
    if (savedUsernameOptions) {
      try {
        setUsernameOptions(JSON.parse(savedUsernameOptions));
        console.log('Username options loaded from localStorage');
      } catch (error) {
        console.error('Error parsing username options:', error);
      }
    }

    const savedFullNameOptions = localStorage.getItem('fullNameOptions');
    if (savedFullNameOptions) {
      try {
        setFullNameOptions(JSON.parse(savedFullNameOptions));
        console.log('Full name options loaded from localStorage');
      } catch (error) {
        console.error('Error parsing full name options:', error);
      }
    }

    const savedPasswordOptions = localStorage.getItem('passwordOptions');
    if (savedPasswordOptions) {
      try {
        setPasswordOptions(JSON.parse(savedPasswordOptions));
        console.log('Password options loaded from localStorage');
      } catch (error) {
        console.error('Error parsing password options:', error);
      }
    }

    // Apply page load animation
    const content = mainContentRef.current;
    if (content) {
      jellyPageLoad(content);
    }
    
    // Mark that API keys and personas have been loaded (allows saving on future changes)
    setHasLoadedApiKeys(true);
    setHasLoadedPersonas(true);
  }, []);

  // Load enabled image styles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enabledImageStyles');
    if (saved) {
      try {
        const parsedStyles = JSON.parse(saved);
        setEnabledImageStyles(parsedStyles);
        console.log('Enabled image styles loaded from localStorage');
      } catch (error) {
        console.error('Error parsing saved image styles:', error);
        // Set default enabled styles on error
        setEnabledImageStyles(getDefaultEnabledStyles());
      }
    } else {
      // Set default enabled styles if none saved
      setEnabledImageStyles(getDefaultEnabledStyles());
      console.log('No saved image styles found, using defaults');
    }
  }, []);

  // Save API keys to localStorage when they change (but not on initial mount)
  const [hasLoadedApiKeys, setHasLoadedApiKeys] = useState(false);
  useEffect(() => {
    if (hasLoadedApiKeys) {
      console.log('API keys changed, saving to localStorage');
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
      console.log('API keys saved to localStorage');
    }
  }, [apiKeys, hasLoadedApiKeys]);

  // Save provider to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('provider', provider);
  }, [provider]);

  // Save image model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('imageModel', imageModel);
  }, [imageModel]);

  // Save username avatar setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('useUsernameForAvatar', JSON.stringify(useUsernameForAvatar));
  }, [useUsernameForAvatar]);

  // Save individual item settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('usernameOptions', JSON.stringify(usernameOptions));
  }, [usernameOptions]);

  useEffect(() => {
    localStorage.setItem('fullNameOptions', JSON.stringify(fullNameOptions));
  }, [fullNameOptions]);

  useEffect(() => {
    localStorage.setItem('passwordOptions', JSON.stringify(passwordOptions));
  }, [passwordOptions]);

  // Save enabled image styles to localStorage when they change
  useEffect(() => {
    localStorage.setItem('enabledImageStyles', JSON.stringify(enabledImageStyles));
  }, [enabledImageStyles]);

  // Save personas to localStorage when they change (but not on initial mount)
  const [hasLoadedPersonas, setHasLoadedPersonas] = useState(false);
  useEffect(() => {
    if (hasLoadedPersonas) {
      console.log('Personas changed, saving to localStorage');
      localStorage.setItem('savedPersonas', JSON.stringify(savedPersonas));
      console.log('Personas saved to localStorage');
    }
  }, [savedPersonas, hasLoadedPersonas]);

  // Helper function to get current API key
  const getCurrentApiKey = () => {
    return apiKeys[provider] || '';
  };

  // Helper function to update API key for a specific provider
  const updateApiKey = (providerName, key) => {
    setApiKeys(prev => ({
      ...prev,
      [providerName]: key
    }));
  };

  // Helper function to update enabled image styles
  const updateEnabledImageStyles = (styleId, enabled) => {
    setEnabledImageStyles(prev => ({
      ...prev,
      [styleId]: enabled
    }));
  };

  // Handle API key submission (for the reminder modal)
  const handleApiKeySubmit = (key) => {
    console.log(`API key submitted for ${provider}: ${key ? '***' + key.substring(key.length - 4) : 'none'}`);
    if (!key || key.trim() === '') {
      console.error('Empty API key submitted');
      setErrorMessage('Please enter a valid API key');
      return;
    }
    
    updateApiKey(provider, key);
    console.log('API key state updated');
    
    setShowApiKeyReminder(false);
    console.log('API key reminder modal closed');
  };

  // Handle settings modal
  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  // Handle username settings modal
  const handleUsernameSettingsClick = () => {
    setShowUsernameSettings(true);
  };

  const handleCloseUsernameSettings = () => {
    setShowUsernameSettings(false);
  };

  // Handle full name settings modal
  const handleFullNameSettingsClick = () => {
    setShowFullNameSettings(true);
  };

  const handleCloseFullNameSettings = () => {
    setShowFullNameSettings(false);
  };

  // Handle password settings modal
  const handlePasswordSettingsClick = () => {
    setShowPasswordSettings(true);
  };

  const handleClosePasswordSettings = () => {
    setShowPasswordSettings(false);
  };

  // Handle image settings modal (now redirects to main settings)
  const handleImageSettingsClick = () => {
    setShowSettings(true);
  };

  const handleImageClick = () => {
    if (profileImage) {
      setShowImageModal(true);
    }
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  // Handle bulk generation modal
  const handleBulkGenerationClick = () => {
    console.log('Bulk generation button clicked');
    
    const currentApiKey = getCurrentApiKey();
    if (!currentApiKey) {
      setErrorMessage('Please enter a valid API key in Settings');
      setShowApiKeyReminder(true);
      return;
    }
    
    setShowBulkGenerationModal(true);
  };

  const handleCloseBulkGenerationModal = () => {
    setShowBulkGenerationModal(false);
  };

  // Handle new persona creation
  const handleNewPersona = () => {
    console.log('Creating new persona - clearing all fields');
    
    // Clear all form fields to create a blank persona
    setUsername('');
    setFullName('');
    setAddress('');
    setBio('');
    setPassword('');
    setProfileImage('');
    setPhysicalDescription('');
    setGender('Male'); // Reset to default
    
    // Clear any error/success messages
    setErrorMessage('');
    setSuccessMessage('');
    
    console.log('New persona created - all fields cleared');
  };

  // Handle error modal
  const handleCloseError = () => {
    setErrorMessage('');
    setIsRetryable(false);
  };
  
  const handleRetry = () => {
    setErrorMessage('');
    setIsRetryable(false);
    // Retry the last operation - for now just close the modal
    // Could be enhanced to store the last operation and retry it
  };
  
  const setError = (error) => {
    const errorMsg = error.message || error;
    setErrorMessage(errorMsg);
    
    // Check if this is a retryable error (rate limits, server errors)
    const isRetryableError = errorMsg.includes('rate limit') || 
                            errorMsg.includes('quota') || 
                            errorMsg.includes('Too many requests') ||
                            errorMsg.includes('technical difficulties') ||
                            errorMsg.includes('⏱️') ||
                            errorMsg.includes('🔧');
    setIsRetryable(isRetryableError);
  };

  // Handle success modal
  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  // Auto-save persona after generation
  const autoSavePersona = async (personaData = null) => {
    // Use provided data or current state
    const currentPersona = personaData || {
      username,
      fullName,
      address,
      bio,
      password,
      profileImage,
      physicalDescription,
      gender,
    };

    if (!currentPersona.username && !currentPersona.fullName) {
      console.log('Auto-save skipped: No username or full name to save');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Small delay to show the saving state
      await new Promise(resolve => setTimeout(resolve, 500));

      const newPersona = {
        id: Date.now().toString(),
        ...currentPersona,
      };

      setSavedPersonas(prev => [...prev, newPersona]);

      // Show success animation
      setSaveSuccess(true);
      console.log('Persona auto-saved successfully:', newPersona);

      // Reset success state after animation
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Auto-save failed:', error);
      setErrorMessage('Auto-save failed. Please save manually.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle manual save persona
  const handleSavePersona = () => {
    if (!username && !fullName) {
      setErrorMessage('Please generate at least a username or full name before saving.');
      return;
    }

    const newPersona = {
      id: Date.now().toString(),
      username,
      fullName,
      address,
      bio,
      password,
      profileImage,
      physicalDescription,
      gender,
    };

    setSavedPersonas([...savedPersonas, newPersona]);

    // Show success message
    setSuccessMessage('Persona saved successfully!');
  };

  // Handle load persona
  const handleLoadPersona = (persona) => {
    setUsername(persona.username || '');
    setFullName(persona.fullName || '');
    setAddress(persona.address || '');
    setBio(persona.bio || '');
    setPassword(persona.password || '');
    setProfileImage(persona.profileImage || '');
    setPhysicalDescription(persona.physicalDescription || '');
    setGender(persona.gender || 'Male');
  };

  // Handle delete persona
  const handleDeletePersona = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this persona?')) {
      setSavedPersonas(savedPersonas.filter(persona => persona.id !== id));
    }
  };

  // Handle edit persona
  const handleEditPersona = (persona, e) => {
    e.stopPropagation();
    setEditingPersona(persona);
  };

  // Handle update persona
  const handleUpdatePersona = (updatedPersona) => {
    setSavedPersonas(savedPersonas.map(persona =>
      persona.id === updatedPersona.id ? updatedPersona : persona
    ));
    setEditingPersona(null);
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setEditingPersona(null);
  };

  // Handle personas saved from bulk generation
  const handlePersonasSaved = (newPersonas) => {
    console.log(`Adding ${newPersonas.length} personas from bulk generation`);
    setSavedPersonas(prevPersonas => [...prevPersonas, ...newPersonas]);
  };

  // Handle export as JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify({
      username,
      fullName,
      address,
      bio,
      password,
      profileImage,
      physicalDescription,
      gender,
    }, null, 2);

    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = 'persona.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle copy to clipboard
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccessMessage(`${fieldName} copied to clipboard!`);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setErrorMessage('Failed to copy to clipboard');
      });
  };

  // Handle generate username
  const handleGenerateUsername = async () => {
    setIsGeneratingUsername(true);
    try {
      const newUsername = await generateUsername(provider, getCurrentApiKey(), usernameOptions);
      setUsername(newUsername);
      
      // Auto-save if we have enough content (username + full name or other fields)
      if (fullName || address || bio) {
        setTimeout(() => autoSavePersona(), 1000);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsGeneratingUsername(false);
    }
  };

  // Handle generate full name
  const handleGenerateFullName = async () => {
    setIsGeneratingFullName(true);
    try {
      // Check if user has specific gender preferences (only one selected)
      const availableGenders = [];
      if (fullNameOptions.includeMale) availableGenders.push('Male');
      if (fullNameOptions.includeFemale) availableGenders.push('Female');
      if (fullNameOptions.includeNeutral) availableGenders.push('Nonbinary');
      
      if (availableGenders.length === 1) {
        // User has explicit preference - use the new function that returns both name and gender
        const { generateFullNameWithGender } = await import('./utils/apiService.js');
        const result = await generateFullNameWithGender(provider, getCurrentApiKey(), fullNameOptions);
        setFullName(result.name);
        
        // Set gender based on user preference
        const uiGender = availableGenders[0];
        setGender(uiGender);
        console.log(`Set gender to "${uiGender}" based on user preference (only ${availableGenders[0]} names selected)`);
      } else {
        // Multiple options or all selected - use LLM to detect gender from generated name
        const { generateFullName, detectGenderFromNameLLM } = await import('./utils/apiService.js');
        const newFullName = await generateFullName(provider, getCurrentApiKey(), fullNameOptions);
        setFullName(newFullName);
        
        // Use LLM to detect gender from the generated name
        const detectedGender = await detectGenderFromNameLLM(provider, getCurrentApiKey(), newFullName);
        const uiGender = detectedGender === 'male' ? 'Male' : detectedGender === 'female' ? 'Female' : 'Nonbinary';
        setGender(uiGender);
        
        console.log(`LLM detected gender for "${newFullName}": ${detectedGender} -> UI: ${uiGender}`);
      }
      
      // Auto-save if we have enough content (full name + username or other fields)
      if (username || address || bio) {
        setTimeout(() => autoSavePersona(), 1000);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsGeneratingFullName(false);
    }
  };

  // Handle generate address
  const handleGenerateAddress = async () => {
    const currentApiKey = getCurrentApiKey();
    console.log(`Generating address with provider: "${provider}", apiKey: "${currentApiKey ? '***' + currentApiKey.substring(currentApiKey.length - 4) : 'none'}"`);
    
    // Validate inputs before calling API
    if (!provider || provider === 'default') {
      setErrorMessage('Please select a valid provider in Settings');
      return;
    }
    
    if (!currentApiKey) {
      setErrorMessage('Please enter a valid API key in Settings');
      setShowApiKeyReminder(true);
      return;
    }
    
    setIsGeneratingAddress(true);
    try {
      console.log('Calling generateAddress function...');
      const newAddress = await generateAddress(provider, currentApiKey);
      console.log(`Address generated: ${newAddress}`);
      setAddress(newAddress);
    } catch (error) {
      console.error('Error generating address:', error);
      setErrorMessage(error.message || 'Error generating address');
    } finally {
      setIsGeneratingAddress(false);
    }
  };

  // Handle generate bio
  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const newBio = await generateBio(provider, getCurrentApiKey(), { fullName, username, gender });
      setBio(newBio);
    } catch (error) {
      setError(error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // Handle generate password
  const handleGeneratePassword = async () => {
    setIsGeneratingPassword(true);
    try {
      const newPassword = await generatePassword(provider, getCurrentApiKey(), passwordOptions);
      setPassword(newPassword);
    } catch (error) {
      setError(error);
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  // Handle generate physical description
  const handleGeneratePhysicalDescription = async () => {
    const currentApiKey = getCurrentApiKey();
    
    // Validate inputs before calling API
    if (!provider || provider === 'default') {
      setErrorMessage('Please select a valid provider in Settings');
      return;
    }
    
    if (!currentApiKey) {
      setErrorMessage('Please enter a valid API key in Settings');
      setShowApiKeyReminder(true);
      return;
    }

    setIsGeneratingPhysicalDescription(true);
    try {
      const description = await generatePhysicalDescription(provider, currentApiKey, {
        fullName,
        gender
      });
      setPhysicalDescription(description);
    } catch (error) {
      console.error('Error generating physical description:', error);
      setErrorMessage(error.message || 'Error generating physical description');
    } finally {
      setIsGeneratingPhysicalDescription(false);
    }
  };

  // Handle generate profile image
  const handleGenerateProfileImage = async () => {
    const currentApiKey = getCurrentApiKey();
    const falApiKey = apiKeys.fal;
    
    console.log(`Generating profile image with provider: "${provider}", apiKey: "${currentApiKey ? '***' + currentApiKey.substring(currentApiKey.length - 4) : 'none'}", falApiKey: "${falApiKey ? '***' + falApiKey.substring(falApiKey.length - 4) : 'none'}"`);
    
    // Validate inputs before calling API
    if (!falApiKey) {
      setErrorMessage('fal.ai API key is required for image generation. Please add your fal.ai API key in Settings.');
      return;
    }

    if (useUsernameForAvatar && !username) {
      setErrorMessage('Please generate a username first before creating a username-based avatar.');
      return;
    }

    if (!useUsernameForAvatar && !fullName) {
      setErrorMessage('Please generate a full name first before creating a profile image.');
      return;
    }

    setIsGeneratingProfileImage(true);

    try {
      console.log('Generating profile image...');
      
      const { generatePersonaPortrait, generateImageFromDescription, generateUsernameAvatar } = await import('./utils/imageService.js');
      const { downloadAndSaveImage, generateImageFilename, getLocalImageUrl } = await import('./utils/imageStorageService.js');
      
      let imageUrl;
      if (useUsernameForAvatar) {
        // Generate creative avatar based on username
        console.log('Using username for avatar generation');
        imageUrl = await generateUsernameAvatar(username, falApiKey, imageModel);
      } else if (physicalDescription.trim()) {
        // Use the physical description to generate the image
        console.log('Using physical description for image generation');
        imageUrl = await generateImageFromDescription(physicalDescription, gender, falApiKey, imageModel);
      } else {
        // Fall back to the original method using name-based generation
        console.log('Using name-based generation for image');
        imageUrl = await generatePersonaPortrait(fullName, fullNameOptions, falApiKey, imageModel);
      }
      
      console.log(`Profile image generated: ${imageUrl}`);
      
      // Download and save the image locally
      const filename = generateImageFilename(fullName, username);
      const localPath = await downloadAndSaveImage(imageUrl, filename);
      const localImageUrl = getLocalImageUrl(localPath);
      
      console.log(`Profile image saved locally: ${localImageUrl}`);
      setProfileImage(localImageUrl);
      
    } catch (error) {
      console.error('Error generating profile image:', error);
      setErrorMessage(error.message || 'Error generating profile image');
    } finally {
      setIsGeneratingProfileImage(false);
    }
  };

  // Handle regenerate all
  const handleRegenerateAll = async () => {
    const currentApiKey = getCurrentApiKey();
    console.log(`Regenerating all fields with provider: "${provider}", apiKey: "${currentApiKey ? '***' + currentApiKey.substring(currentApiKey.length - 4) : 'none'}"`);
    
    // Validate inputs before calling API
    if (!provider || provider === 'default') {
      setErrorMessage('Please select a valid provider in Settings');
      return;
    }
    
    if (!currentApiKey) {
      setErrorMessage('Please enter a valid API key in Settings');
      setShowApiKeyReminder(true);
      return;
    }
    
    // Set all loading states to true
    setIsGeneratingUsername(true);
    setIsGeneratingFullName(true);
    setIsGeneratingAddress(true);
    setIsGeneratingBio(true);
    setIsGeneratingPassword(true);
    setIsGeneratingPhysicalDescription(true);
    setIsGeneratingProfileImage(true);

    try {
      console.log('Generating all fields in parallel...');
      
      // Check if user has specific gender preferences for name generation
      const availableGenders = [];
      if (fullNameOptions.includeMale) availableGenders.push('Male');
      if (fullNameOptions.includeFemale) availableGenders.push('Female');
      if (fullNameOptions.includeNeutral) availableGenders.push('Nonbinary');
      
      let newFullName;
      let uiGender;
      let newUsername;
      let newAddress;
      let newPassword;
      
      if (availableGenders.length === 1) {
        // User has explicit preference - use the new function that returns both name and gender
        const { generateFullNameWithGender } = await import('./utils/apiService.js');
        const [usernameResult, nameResult, addressResult, passwordResult] = await Promise.all([
          generateUsername(provider, currentApiKey, usernameOptions),
          generateFullNameWithGender(provider, currentApiKey, fullNameOptions),
          generateAddress(provider, currentApiKey),
          generatePassword(provider, currentApiKey, passwordOptions),
        ]);
        
        newUsername = usernameResult;
        newFullName = nameResult.name;
        newAddress = addressResult;
        newPassword = passwordResult;
        uiGender = availableGenders[0]; // Use user preference
        console.log(`Set gender to "${uiGender}" based on user preference (only ${availableGenders[0]} names selected)`);
        
        // Update state with new values
        setUsername(newUsername);
        setFullName(newFullName);
        setAddress(newAddress);
        setPassword(newPassword);
        setGender(uiGender);
      } else {
        // Multiple options or all selected - generate name then detect gender with LLM
        const { generateFullName, detectGenderFromNameLLM } = await import('./utils/apiService.js');
        const [usernameResult, generatedFullName, addressResult, passwordResult] = await Promise.all([
          generateUsername(provider, currentApiKey, usernameOptions),
          generateFullName(provider, currentApiKey, fullNameOptions),
          generateAddress(provider, currentApiKey),
          generatePassword(provider, currentApiKey, passwordOptions),
        ]);
        
        newUsername = usernameResult;
        newFullName = generatedFullName;
        newAddress = addressResult;
        newPassword = passwordResult;
        
        // Use LLM to detect gender from the generated name
        const detectedGender = await detectGenderFromNameLLM(provider, currentApiKey, newFullName);
        uiGender = detectedGender === 'male' ? 'Male' : detectedGender === 'female' ? 'Female' : 'Nonbinary';
        
        console.log(`LLM detected gender for "${newFullName}": ${detectedGender} -> UI: ${uiGender}`);
        
        // Update state with new values
        setUsername(newUsername);
        setFullName(newFullName);
        setAddress(newAddress);
        setPassword(newPassword);
        setGender(uiGender);
      }

      console.log('All fields generated successfully');
      console.log(`Username: ${newUsername}`);
      console.log(`Full Name: ${newFullName}`);
      console.log(`Address: ${newAddress}`);
      console.log(`Password: ${newPassword}`);

      // Generate bio and physical description after we have the name and username
      console.log('Generating bio and physical description...');
      const [newBio, newPhysicalDescription] = await Promise.all([
        generateBio(provider, currentApiKey, {
          fullName: newFullName,
          username: newUsername,
          gender: uiGender
        }),
        generatePhysicalDescription(provider, currentApiKey, {
          fullName: newFullName,
          gender: uiGender
        })
      ]);
      console.log(`Bio: ${newBio}`);
      console.log(`Physical Description: ${newPhysicalDescription}`);
      setBio(newBio);
      setPhysicalDescription(newPhysicalDescription);

      // Generate profile image last, after all other information is available
      console.log('Generating profile image...');
      const falApiKey = apiKeys.fal;
      let newProfileImage = '';
      
      if (falApiKey && falApiKey.trim() !== '') {
        try {
          const { generatePersonaPortrait, generateImageFromDescription, generateUsernameAvatar } = await import('./utils/imageService.js');
          const { generateImageFilename, downloadAndSaveImage, getLocalImageUrl } = await import('./utils/imageStorageService.js');
          
          let imageUrl;
          
          if (useUsernameForAvatar) {
            // Generate creative avatar based on username
            console.log('Using username for avatar generation');
            imageUrl = await generateUsernameAvatar(newUsername, falApiKey, imageModel);
          } else if (newPhysicalDescription && newPhysicalDescription.trim() !== '') {
            // Try using the physical description if available
            console.log('Using physical description for image generation');
            imageUrl = await generateImageFromDescription(newPhysicalDescription, uiGender, falApiKey, imageModel);
          } else {
            // Fall back to the original method using name-based generation
            console.log('Using name-based generation for image');
            imageUrl = await generatePersonaPortrait(newFullName, fullNameOptions, falApiKey, imageModel);
          }
          
          console.log(`Profile image generated: ${imageUrl}`);
          
          // Download and save the image locally
          const filename = generateImageFilename(newFullName, newUsername);
          const localPath = await downloadAndSaveImage(imageUrl, filename);
          const localImageUrl = getLocalImageUrl(localPath);
          
          console.log(`Profile image saved locally: ${localImageUrl}`);
          newProfileImage = localImageUrl;
          setProfileImage(localImageUrl);
        } catch (imageError) {
          console.error('Error generating profile image:', imageError);
          // Don't fail the entire operation if just image generation fails
          setErrorMessage(`Profile generated successfully, but image generation failed: ${imageError.message}`);
        }
      } else {
        console.log('No fal.ai API key available, skipping image generation');
      }

      // Auto-save the generated persona with all the generated data
      console.log('Auto-saving generated persona...');
      const generatedPersona = {
        username: newUsername,
        fullName: newFullName,
        address: newAddress,
        bio: newBio,
        password: newPassword,
        profileImage: newProfileImage,
        physicalDescription: newPhysicalDescription,
        gender: uiGender,
      };
      
      await autoSavePersona(generatedPersona);

    } catch (error) {
      console.error('Error regenerating all fields:', error);
      setErrorMessage(error.message || 'Error regenerating all fields');
    } finally {
      // Set all loading states back to false
      setIsGeneratingUsername(false);
      setIsGeneratingFullName(false);
      setIsGeneratingAddress(false);
      setIsGeneratingBio(false);
      setIsGeneratingPassword(false);
      setIsGeneratingPhysicalDescription(false);
      setIsGeneratingProfileImage(false);
    }
  };

  return (
    <>
      {/* Modals */}
      <SettingsModal
        show={showSettings}
        onClose={handleCloseSettings}
        apiKeys={apiKeys}
        updateApiKey={updateApiKey}
        provider={provider}
        setProvider={setProvider}
        imageModel={imageModel}
        setImageModel={setImageModel}
        useUsernameForAvatar={useUsernameForAvatar}
        setUseUsernameForAvatar={setUseUsernameForAvatar}
        enabledImageStyles={enabledImageStyles}
        updateEnabledImageStyles={updateEnabledImageStyles}
      />

      <ApiKeyReminderModal
        show={showApiKeyReminder}
        onSubmit={handleApiKeySubmit}
        onClose={() => setShowApiKeyReminder(false)}
        provider={provider}
        setProvider={setProvider}
      />

      <UsernameSettingsModal
        show={showUsernameSettings}
        onClose={handleCloseUsernameSettings}
        options={usernameOptions}
        setOptions={setUsernameOptions}
      />

      <FullNameSettingsModal
        show={showFullNameSettings}
        onClose={handleCloseFullNameSettings}
        options={fullNameOptions}
        setOptions={setFullNameOptions}
      />

      <PasswordSettingsModal
        show={showPasswordSettings}
        onClose={handleClosePasswordSettings}
        options={passwordOptions}
        setOptions={setPasswordOptions}
      />

      <ErrorModal
        show={!!errorMessage}
        onClose={handleCloseError}
        message={errorMessage}
        type="error"
        isRetryable={isRetryable}
        onRetry={handleRetry}
      />

      <ErrorModal
        show={!!successMessage}
        onClose={handleCloseSuccess}
        message={successMessage}
        type="success"
      />

      <EditPersonaModal
        show={!!editingPersona}
        onClose={handleCloseEditModal}
        persona={editingPersona}
        onUpdate={handleUpdatePersona}
      />

      <BulkGenerationModal
        show={showBulkGenerationModal}
        onClose={handleCloseBulkGenerationModal}
        apiKey={getCurrentApiKey()}
        provider={provider}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
        onPersonasSaved={handlePersonasSaved}
      />

      <ImageModal
        show={showImageModal}
        onClose={handleCloseImageModal}
        imageUrl={profileImage}
        title={fullName ? `${fullName} - Profile Image` : 'Profile Image'}
      />

      {/* Application Header */}
      <Header
        provider={provider}
        handleSettingsClick={handleSettingsClick}
        setProvider={setProvider}
        handleBulkGenerationClick={handleBulkGenerationClick}
        handleNewPersona={handleNewPersona}
        apiKeys={apiKeys}
      />

      {/* Main Layout: Sidebar + MainContent */}
      <div className="app-layout flex h-[calc(100vh-85px)] border-t border-border">
        {/* Saved Personas Sidebar - Always rendered */}
        <Sidebar
          sidebarRef={sidebarRef}
          savedPersonas={savedPersonas}
          handleLoadPersona={handleLoadPersona}
          handleDeletePersona={handleDeletePersona}
          handleEditPersona={handleEditPersona}
        />

        {/* Main Content */}
        <MainContent
          mainContentRef={mainContentRef}
          provider={provider}
          setProvider={setProvider}
          handleSettingsClick={handleSettingsClick}
          username={username}
          setUsername={setUsername}
          fullName={fullName}
          setFullName={setFullName}
          address={address}
          setAddress={setAddress}
          bio={bio}
          setBio={setBio}
          password={password}
          setPassword={setPassword}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          physicalDescription={physicalDescription}
          setPhysicalDescription={setPhysicalDescription}
                  gender={gender}
        setGender={setGender}
        isGeneratingUsername={isGeneratingUsername}
          isGeneratingFullName={isGeneratingFullName}
          isGeneratingAddress={isGeneratingAddress}
          isGeneratingBio={isGeneratingBio}
          isGeneratingPassword={isGeneratingPassword}
          isGeneratingProfileImage={isGeneratingProfileImage}
          isGeneratingPhysicalDescription={isGeneratingPhysicalDescription}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          handleGenerateUsername={handleGenerateUsername}
          handleGenerateFullName={handleGenerateFullName}
          handleGenerateAddress={handleGenerateAddress}
          handleGenerateBio={handleGenerateBio}
          handleGeneratePassword={handleGeneratePassword}
          handleGeneratePhysicalDescription={handleGeneratePhysicalDescription}
          handleGenerateProfileImage={handleGenerateProfileImage}
          handleRegenerateAll={handleRegenerateAll}
          handleExportJSON={handleExportJSON}
          handleSavePersona={handleSavePersona}
          handleCopy={handleCopy}
          handleUsernameSettingsClick={handleUsernameSettingsClick}
          handleFullNameSettingsClick={handleFullNameSettingsClick}
          handlePasswordSettingsClick={handlePasswordSettingsClick}
          handleImageSettingsClick={handleImageSettingsClick}
          handleImageClick={handleImageClick}
        />
      </div>
    </>
  );
}

export default App;
