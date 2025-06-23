// src/utils/bulkGenerationService.js

import {
  generatePassword,
  generateMultipleUsernames,
  generateMultipleFullNames,
  generateMultipleAddresses,
  generateMultipleBios
} from './apiService';

/**
 * Recursively remove properties that are Promises or functions from an object.
 */
function removeUnserializable(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeUnserializable);
  } else if (obj && typeof obj === 'object') {
    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') continue;
      if (value && typeof value === 'object' && typeof value.then === 'function') continue; // Promise
      clean[key] = removeUnserializable(value);
    }
    return clean;
  }
  return obj;
}

// IndexedDB wrapper using idb (see research recommendations)
let idbDb = null;
async function getDb() {
  if (idbDb) return idbDb;
  const { openDB } = await import('idb');
  idbDb = await openDB('persona-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('personas')) {
        db.createObjectStore('personas', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
  return idbDb;
}

export async function savePersonasBatchToIndexedDB(personas) {
  const db = await getDb();
  const tx = db.transaction('personas', 'readwrite');
  const store = tx.objectStore('personas');
  for (const persona of personas) {
    const cleanPersona = removeUnserializable(persona);
    await store.put(cleanPersona);
  }
  await tx.done;
}

export async function getAllPersonasFromIndexedDB() {
  const db = await getDb();
  return db.getAll('personas');
}

export function downloadJSON(data, filename = 'personas.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Helper: Normalize username for uniqueness check
function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

// Main batch generation function - now using bulk API calls
export async function bulkGeneratePersonas({
  numProfiles,
  provider,
  apiKeys,
  usernameOptions,
  fullNameOptions,
  passwordOptions,
  imageOptions,    // { generateImages: boolean, model: string }
  onProgress,      // function(percent, current, total)
  onError,         // function(error, batchIndex)
  onBatchComplete, // function(batchResults, batchIndex)
  signal           // optional AbortSignal for cancellation
}) {
  const BATCH_SIZE = 25; // Maximum number of profiles to generate in one batch
  const total = numProfiles;
  let generated = 0;
  let batchIndex = 0;
  let allPersonas = [];

  try {
    // Extract the API key for the current provider
    const apiKey = apiKeys && apiKeys[provider] ? apiKeys[provider] : null;
    const falApiKey = apiKeys && apiKeys.fal ? apiKeys.fal : null;
    
    if (!apiKey) {
      throw new Error(`No API key provided for provider: ${provider}`);
    }
    
    // Check if image generation is requested but no fal API key
    if (imageOptions?.generateImages && !falApiKey) {
      throw new Error('fal.ai API key is required for image generation');
    }

    // Process in batches
    while (generated < total) {
      if (signal && signal.aborted) throw new Error('Generation cancelled by user');
      
      const batchCount = Math.min(BATCH_SIZE, total - generated);
      console.log(`Generating batch ${batchIndex + 1} with ${batchCount} profiles...`);
      
      // Calculate progress steps for this batch (6 or 7 steps per batch: usernames, names, addresses, bios, physical descriptions, passwords, optionally images)
      const progressStepsPerBatch = imageOptions?.generateImages ? 7 : 6;
      const progressPerStep = batchCount / progressStepsPerBatch;
      let batchProgress = 0;
      
      // Step 1: Generate all usernames for this batch in a single API call
      console.log(`Generating ${batchCount} usernames in bulk with options:`, JSON.stringify(usernameOptions));
      let usernames;
      try {
        usernames = await generateMultipleUsernames(provider, apiKey, batchCount, usernameOptions);
        console.log(`Generated ${usernames.length} usernames`);
        
        // If we didn't get enough usernames, fill in with placeholders
        if (usernames.length < batchCount) {
          const missing = batchCount - usernames.length;
          console.warn(`Only received ${usernames.length} usernames, adding ${missing} placeholders`);
          for (let i = 0; i < missing; i++) {
            usernames.push(`user_${Date.now()}_${i}`);
          }
        }
      } catch (error) {
        console.error('Error generating usernames:', error);
        onError && onError(error, batchIndex);
        usernames = Array(batchCount).fill(0).map((_, i) => `user_${Date.now()}_${i}`);
      }
      
      // Update progress after usernames
      batchProgress += progressPerStep;
      const currentProgress = generated + batchProgress;
      onProgress && onProgress(
        Math.round((currentProgress / total) * 100), 
        Math.floor(currentProgress), 
        total, 
        `Completed ${batchCount} usernames for batch ${batchIndex + 1}`
      );
      
      // Step 2: Generate all full names for this batch and determine genders intelligently
      console.log(`Generating ${batchCount} full names in bulk with options:`, JSON.stringify(fullNameOptions));
      
      // Check if user has specific gender preferences
      const availableGenders = [];
      if (fullNameOptions.includeMale) availableGenders.push('Male');
      if (fullNameOptions.includeFemale) availableGenders.push('Female');
      if (fullNameOptions.includeNeutral) availableGenders.push('Nonbinary');
      
      // If no gender preferences are specified, default to all
      if (availableGenders.length === 0) {
        availableGenders.push('Male', 'Female', 'Nonbinary');
      }
      
      let fullNames;
      let genders;
      
      try {
        fullNames = await generateMultipleFullNames(provider, apiKey, batchCount, fullNameOptions);
        console.log(`Generated ${fullNames.length} full names`);
        
        if (fullNames.length < batchCount) {
          const missing = batchCount - fullNames.length;
          console.warn(`Only received ${fullNames.length} full names, adding ${missing} placeholders`);
          for (let i = 0; i < missing; i++) {
            fullNames.push(`Person ${i + 1}`);
          }
        }
        
        // Determine genders based on user preferences
        if (availableGenders.length === 1) {
          // User has explicit preference - all names should match that gender
          genders = Array(fullNames.length).fill(availableGenders[0]);
          console.log(`Set all ${fullNames.length} genders to ${availableGenders[0]} based on user preference`);
        } else {
          // Multiple options selected - use LLM to detect gender from generated names
          console.log(`Multiple gender options selected - using LLM to detect gender from generated names`);
          const { detectGenderFromNameLLM } = await import('./apiService.js');
          genders = [];
          
          for (const fullName of fullNames) {
            try {
              const detectedGender = await detectGenderFromNameLLM(provider, apiKey, fullName);
              const uiGender = detectedGender === 'male' ? 'Male' : detectedGender === 'female' ? 'Female' : 'Nonbinary';
              genders.push(uiGender);
              console.log(`LLM detected gender for "${fullName}": ${detectedGender} -> ${uiGender}`);
            } catch (error) {
              console.error(`Error detecting gender for "${fullName}":`, error);
              // Fallback to random assignment from user preferences
              const fallbackGender = availableGenders[Math.floor(Math.random() * availableGenders.length)];
              genders.push(fallbackGender);
              console.log(`Fallback gender for "${fullName}": ${fallbackGender}`);
            }
          }
        }
        
      } catch (error) {
        console.error('Error generating full names:', error);
        onError && onError(error, batchIndex);
        fullNames = Array(batchCount).fill(0).map((_, i) => `Person ${i + 1}`);
        // Fallback to random assignment for genders
        genders = Array(batchCount).fill(0).map(() => 
          availableGenders[Math.floor(Math.random() * availableGenders.length)]
        );
      }
      
      // Update progress after full names and gender detection
      batchProgress += progressPerStep;
      const currentProgress2 = generated + batchProgress;
      onProgress && onProgress(
        Math.round((currentProgress2 / total) * 100), 
        Math.floor(currentProgress2), 
        total, 
        `Completed ${batchCount} full names and gender detection for batch ${batchIndex + 1}`
      );
      
      // Step 3: Generate all addresses for this batch in a single API call
      console.log(`Generating ${batchCount} addresses in bulk...`);
      let addresses;
      try {
        addresses = await generateMultipleAddresses(provider, apiKey, batchCount);
        console.log(`Generated ${addresses.length} addresses`);
        
        if (addresses.length < batchCount) {
          const missing = batchCount - addresses.length;
          console.warn(`Only received ${addresses.length} addresses, adding ${missing} placeholders`);
          for (let i = 0; i < missing; i++) {
            addresses.push(`123 Main St, Anytown, US 12345`);
          }
        }
      } catch (error) {
        console.error('Error generating addresses:', error);
        onError && onError(error, batchIndex);
        addresses = Array(batchCount).fill(0).map(() => `123 Main St, Anytown, US 12345`);
      }
      
      // Update progress after addresses
      batchProgress += progressPerStep;
      const currentProgress3 = generated + batchProgress;
      onProgress && onProgress(
        Math.round((currentProgress3 / total) * 100), 
        Math.floor(currentProgress3), 
        total, 
        `Completed ${batchCount} addresses for batch ${batchIndex + 1}`
      );
      
      // Step 4: Generate all bios for this batch in a single API call
      console.log(`Generating ${batchCount} bios in bulk...`);
      let bios;
      try {
        const personasForBios = fullNames.map((fullName, index) => ({
          fullName,
          gender: genders[index]
        }));
        bios = await generateMultipleBios(provider, apiKey, personasForBios);
        console.log(`Generated ${bios.length} bios`);
        
        if (bios.length < batchCount) {
          const missing = batchCount - bios.length;
          console.warn(`Only received ${bios.length} bios, adding ${missing} placeholders`);
          for (let i = 0; i < missing; i++) {
            bios.push(`Professional with experience in the industry.`);
          }
        }
      } catch (error) {
        console.error('Error generating bios:', error);
        onError && onError(error, batchIndex);
        bios = Array(batchCount).fill(0).map(() => `Professional with experience in the industry.`);
      }
      
      // Update progress after bios
      batchProgress += progressPerStep;
      const currentProgress4 = generated + batchProgress;
      onProgress && onProgress(
        Math.round((currentProgress4 / total) * 100), 
        Math.floor(currentProgress4), 
        total, 
        `Completed ${batchCount} bios for batch ${batchIndex + 1}`
      );
      
      // Step 5: Generate all physical descriptions for this batch in a single API call
      console.log(`Generating ${batchCount} physical descriptions in bulk...`);
      let physicalDescriptions;
      try {
        const { generateMultiplePhysicalDescriptions } = await import('./apiService.js');
        const personasForDescriptions = fullNames.map((fullName, index) => ({
          fullName,
          gender: genders[index]
        }));
        physicalDescriptions = await generateMultiplePhysicalDescriptions(provider, apiKey, personasForDescriptions);
        console.log(`Generated ${physicalDescriptions.length} physical descriptions`);
        
        if (physicalDescriptions.length < batchCount) {
          const missing = batchCount - physicalDescriptions.length;
          console.warn(`Only received ${physicalDescriptions.length} physical descriptions, adding ${missing} placeholders`);
          for (let i = 0; i < missing; i++) {
            const gender = genders[physicalDescriptions.length + i] || 'Male';
            physicalDescriptions.push(`A ${gender.toLowerCase()} with a professional appearance and friendly demeanor.`);
          }
        }
      } catch (error) {
        console.error('Error generating physical descriptions:', error);
        onError && onError(error, batchIndex);
        physicalDescriptions = genders.map(gender => `A ${gender.toLowerCase()} with a professional appearance and friendly demeanor.`);
      }
      
      // Update progress after physical descriptions
      batchProgress += progressPerStep;
      const currentProgress5 = generated + batchProgress;
      onProgress && onProgress(
        Math.round((currentProgress5 / total) * 100), 
        Math.floor(currentProgress5), 
        total, 
        `Completed ${batchCount} physical descriptions for batch ${batchIndex + 1}`
      );
      
      // Step 6: Generate all passwords (this is done locally, so no API call needed)
      console.log(`Generating ${batchCount} passwords with options:`, JSON.stringify(passwordOptions));
      
      // Update progress at start of password generation
      onProgress && onProgress(
        Math.round((generated + batchProgress + (progressPerStep * 0.1)) / total * 100), 
        Math.floor(generated + batchProgress), 
        total, 
        `Generating ${batchCount} passwords for batch ${batchIndex + 1}`
      );
      
      const passwords = [];
      for (let i = 0; i < batchCount; i++) {
        try {
          const password = await generatePassword(provider, null, passwordOptions);
          passwords.push(password);
        } catch (error) {
          console.error('Error generating password:', error);
          onError && onError(error, batchIndex);
          passwords.push('password123');
        }
      }
      
      // Update progress after passwords
      batchProgress += progressPerStep;
      const currentProgress6 = generated + batchProgress;
      onProgress && onProgress(
        Math.round((currentProgress6 / total) * 100), 
        Math.floor(currentProgress6), 
        total, 
        `Completed ${batchCount} passwords for batch ${batchIndex + 1}`
      );
      
      // Step 7: Generate profile images if requested
      let profileImages = [];
      if (imageOptions?.generateImages) {
        console.log(`Generating ${batchCount} profile images with fal.ai...`);
        const { generatePersonaPortrait, generateImageFromDescription, generateUsernameAvatar, FAL_MODELS } = await import('./imageService.js');
        const selectedModel = imageOptions.model || FAL_MODELS.FLUX_DEV;
        
        // Import image storage utilities
        const { downloadAndSaveImage, generateImageFilename, getLocalImageUrl } = await import('./imageStorageService.js');
        
        // Calculate progress per image within this step
        const imageProgressPerImage = progressPerStep / batchCount;
        
        for (let i = 0; i < batchCount; i++) {
          try {
            // Update progress at the start of each image generation
            const imageStartProgress = generated + batchProgress + (i * imageProgressPerImage);
            onProgress && onProgress(
              Math.round((imageStartProgress / total) * 100), 
              Math.floor(imageStartProgress), 
              total, 
              `Generating image ${i + 1}/${batchCount}: ${fullNames[i]}`
            );
            
            let imageUrl;
            if (imageOptions.useUsernameForAvatar) {
              // Generate creative avatar based on username
              console.log(`Using username for avatar generation: ${usernames[i]}`);
              imageUrl = await generateUsernameAvatar(usernames[i], falApiKey, selectedModel);
            } else if (physicalDescriptions[i] && physicalDescriptions[i].trim()) {
              // Use the physical description to generate the image
              console.log(`Using physical description for image generation: ${fullNames[i]}`);
              imageUrl = await generateImageFromDescription(physicalDescriptions[i], genders[i], falApiKey, selectedModel);
            } else {
              // Fall back to the original method using name-based generation
              console.log(`Using name-based generation for image: ${fullNames[i]}`);
              imageUrl = await generatePersonaPortrait(fullNames[i], fullNameOptions, falApiKey, selectedModel);
            }
            console.log(`Generated image ${i + 1}/${batchCount} for ${fullNames[i]}`);
            
            // Update progress after image generation (before download)
            const imageGenProgress = generated + batchProgress + ((i + 0.7) * imageProgressPerImage);
            onProgress && onProgress(
              Math.round((imageGenProgress / total) * 100), 
              Math.floor(imageGenProgress), 
              total, 
              `Downloading image ${i + 1}/${batchCount}: ${fullNames[i]}`
            );
            
            // Download and save the image locally
            const filename = generateImageFilename(fullNames[i], usernames[i]);
            const localPath = await downloadAndSaveImage(imageUrl, filename);
            const localImageUrl = getLocalImageUrl(localPath);
            
            profileImages.push(localImageUrl);
            console.log(`Saved image locally for ${fullNames[i]}`);
            
            // Update progress after image is completely processed
            const imageCompleteProgress = generated + batchProgress + ((i + 1) * imageProgressPerImage);
            onProgress && onProgress(
              Math.round((imageCompleteProgress / total) * 100), 
              Math.floor(imageCompleteProgress), 
              total, 
              `Completed image ${i + 1}/${batchCount}: ${fullNames[i]}`
            );
            
          } catch (error) {
            console.error(`Error generating/saving image for ${fullNames[i]}:`, error);
            onError && onError(error, batchIndex);
            profileImages.push(''); // Empty string for failed image generation
            
            // Still update progress even on error
            const imageCompleteProgress = generated + batchProgress + ((i + 1) * imageProgressPerImage);
            onProgress && onProgress(
              Math.round((imageCompleteProgress / total) * 100), 
              Math.floor(imageCompleteProgress), 
              total, 
              `Failed image ${i + 1}/${batchCount}: ${fullNames[i]}`
            );
          }
        }
        
        // Update progress after all images are complete
        batchProgress += progressPerStep;
        const currentProgress7 = generated + batchProgress;
        onProgress && onProgress(
          Math.round((currentProgress7 / total) * 100), 
          Math.floor(currentProgress7), 
          total, 
          `Completed all images for batch ${batchIndex + 1}`
        );
      }
      
      // Step 8: Combine all the generated data into personas
      const batchResults = [];
      for (let i = 0; i < batchCount; i++) {
        const persona = {
          id: Date.now().toString() + '-' + (generated + i),
          username: usernames[i] || `user_${Date.now()}_${i}`,
          fullName: fullNames[i] || `Person ${i + 1}`,
          address: addresses[i] || `123 Main St, Anytown, US 12345`,
          bio: bios[i] || `Professional with experience in the industry.`,
          password: passwords[i] || 'password123',
          profileImage: imageOptions?.generateImages ? (profileImages[i] || '') : '',
          physicalDescription: physicalDescriptions[i] || `A ${genders[i].toLowerCase()} with a professional appearance and friendly demeanor.`,
          gender: genders[i] || 'Male'
        };
        
        batchResults.push(persona);
      }
      
      // Update final progress for this batch
      generated += batchCount;
      onProgress && onProgress(
        Math.round((generated / total) * 100), 
        generated, 
        total, 
        `Batch ${batchIndex + 1} complete: ${batchCount} personas created`
      );
      
      // Add the batch results to the overall results
      allPersonas = allPersonas.concat(batchResults);
      
      // Notify that the batch is complete
      onBatchComplete && onBatchComplete(batchResults, batchIndex);
      
      // Save batch to IndexedDB
      try {
        await savePersonasBatchToIndexedDB(batchResults);
      } catch (e) {
        console.error('Error saving to IndexedDB:', e);
        onError && onError(e, batchIndex);
      }
      
      batchIndex++;
    }
    
    return allPersonas;
  } catch (err) {
    console.error('Error in bulk generation:', err);
    onError && onError(err, batchIndex);
    throw err;
  }
}