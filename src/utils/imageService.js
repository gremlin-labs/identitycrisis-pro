/**
 * Image generation service using fal.ai API
 */

import { getRandomStyle, constructPromptWithStyle, getAllStyleIds } from './imageStyles.js';

// Available fal.ai models for image generation
export const FAL_MODELS = {
  FLUX_DEV: 'fal-ai/flux-1/dev',
  JUGGERNAUT_BASE: 'rundiffusion-fal/juggernaut-flux/base',
  JUGGERNAUT_LIGHTNING: 'rundiffusion-fal/juggernaut-flux/lightning',
  SEEDREAM_V3: 'fal-ai/bytedance/seedream/v3/text-to-image',
  MINIMAX_IMAGE_01: 'fal-ai/minimax/image-01',
  IDEOGRAM_V3: 'fal-ai/ideogram/v3',
  RUNDIFFUSION_PHOTO_FLUX: 'rundiffusion-fal/rundiffusion-photo-flux'
};

// Random attributes for generating diverse portraits
const PORTRAIT_ATTRIBUTES = {
  male: {
    ages: ['young adult', 'adult', 'middle-aged', 'mature'],
    ethnicities: ['Caucasian', 'African American', 'Hispanic', 'Asian', 'Middle Eastern', 'Mixed race'],
    hairColors: ['brown', 'black', 'blonde', 'auburn', 'gray', 'silver', 'dark brown'],
    hairStyles: ['short', 'medium length', 'wavy', 'straight', 'curly', 'buzz cut', 'styled'],
    eyeColors: ['brown', 'blue', 'green', 'hazel', 'gray'],
    expressions: ['friendly smile', 'confident', 'professional', 'warm', 'serious', 'approachable'],
    clothing: ['business casual', 'formal shirt', 'sweater', 'polo shirt', 'casual shirt', 'blazer'],
    accessories: ['', 'glasses', 'watch', 'beard', 'mustache', 'clean-shaven'],
    backgrounds: ['neutral', 'office', 'outdoor', 'studio', 'blurred background', 'professional']
  },
  female: {
    ages: ['young adult', 'adult', 'middle-aged', 'mature'],
    ethnicities: ['Caucasian', 'African American', 'Hispanic', 'Asian', 'Middle Eastern', 'Mixed race'],
    hairColors: ['brown', 'black', 'blonde', 'auburn', 'red', 'gray', 'dark brown'],
    hairStyles: ['long', 'medium length', 'short', 'wavy', 'straight', 'curly', 'styled'],
    eyeColors: ['brown', 'blue', 'green', 'hazel', 'gray'],
    expressions: ['friendly smile', 'confident', 'professional', 'warm', 'elegant', 'approachable'],
    clothing: ['business casual', 'blouse', 'sweater', 'dress shirt', 'casual top', 'blazer'],
    accessories: ['', 'glasses', 'earrings', 'necklace', 'watch', 'light makeup'],
    backgrounds: ['neutral', 'office', 'outdoor', 'studio', 'blurred background', 'professional']
  },
  neutral: {
    ages: ['young adult', 'adult', 'middle-aged', 'mature'],
    ethnicities: ['Caucasian', 'African American', 'Hispanic', 'Asian', 'Middle Eastern', 'Mixed race'],
    hairColors: ['brown', 'black', 'blonde', 'auburn', 'gray', 'dark brown'],
    hairStyles: ['short', 'medium length', 'wavy', 'straight', 'curly', 'styled'],
    eyeColors: ['brown', 'blue', 'green', 'hazel', 'gray'],
    expressions: ['friendly smile', 'confident', 'professional', 'warm', 'approachable'],
    clothing: ['business casual', 'casual shirt', 'sweater', 'professional attire'],
    accessories: ['', 'glasses', 'watch'],
    backgrounds: ['neutral', 'office', 'outdoor', 'studio', 'blurred background', 'professional']
  }
};

/**
 * Detect gender from a full name using LLM intelligence (async version)
 * This is a placeholder that returns 'neutral' - use detectGenderFromNameLLM from apiService.js for actual detection
 * @param {string} fullName - The person's full name
 * @returns {string} Always returns 'neutral' - use LLM version instead
 */
export function detectGenderFromName(fullName) {
  console.warn('detectGenderFromName is deprecated - use detectGenderFromNameLLM from apiService.js for accurate gender detection');
  return 'neutral';
}

/**
 * Generate a random portrait prompt based on persona details
 * @param {string} fullName - The person's full name
 * @param {Object} nameOptions - Gender preferences from full name options
 * @returns {string} Generated portrait prompt
 */
export function generatePortraitPrompt(fullName, nameOptions = {}) {
  // First try to detect gender from the actual name
  let gender = detectGenderFromName(fullName);
  
  // If we couldn't detect from name, fall back to name options
  if (gender === 'neutral') {
    if (nameOptions.includeMale && !nameOptions.includeFemale && !nameOptions.includeNeutral) {
      gender = 'male';
    } else if (nameOptions.includeFemale && !nameOptions.includeMale && !nameOptions.includeNeutral) {
      gender = 'female';
    } else if (nameOptions.includeNeutral && !nameOptions.includeMale && !nameOptions.includeFemale) {
      gender = 'neutral';
    } else {
      // Mixed or all selected - randomly choose from enabled options
      const genders = [];
      if (nameOptions.includeMale) genders.push('male');
      if (nameOptions.includeFemale) genders.push('female');
      if (nameOptions.includeNeutral) genders.push('neutral');
      gender = genders.length > 0 ? genders[Math.floor(Math.random() * genders.length)] : 'neutral';
    }
  }
  
  console.log(`Detected gender for "${fullName}": ${gender}`);

  const attributes = PORTRAIT_ATTRIBUTES[gender];
  
  // Randomly select attributes
  const age = attributes.ages[Math.floor(Math.random() * attributes.ages.length)];
  const ethnicity = attributes.ethnicities[Math.floor(Math.random() * attributes.ethnicities.length)];
  const hairColor = attributes.hairColors[Math.floor(Math.random() * attributes.hairColors.length)];
  const hairStyle = attributes.hairStyles[Math.floor(Math.random() * attributes.hairStyles.length)];
  const eyeColor = attributes.eyeColors[Math.floor(Math.random() * attributes.eyeColors.length)];
  const expression = attributes.expressions[Math.floor(Math.random() * attributes.expressions.length)];
  const clothing = attributes.clothing[Math.floor(Math.random() * attributes.clothing.length)];
  const accessory = attributes.accessories[Math.floor(Math.random() * attributes.accessories.length)];
  const background = attributes.backgrounds[Math.floor(Math.random() * attributes.backgrounds.length)];

  // Build the prompt with explicit gender specification
  const genderTerm = gender === 'male' ? 'man' : gender === 'female' ? 'woman' : 'person';
  let prompt = `Professional headshot portrait of a ${age} ${ethnicity} ${genderTerm}`;
  
  // Add gender-specific descriptor if not neutral
  if (gender !== 'neutral') {
    prompt += ` (${gender})`;
  }
  
  prompt += ` with ${hairColor} ${hairStyle} hair and ${eyeColor} eyes, ${expression} expression, wearing ${clothing}`;
  
  if (accessory) {
    prompt += `, ${accessory}`;
  }
  
  prompt += `, ${background} background, high quality, realistic, well-lit, professional photography, 1:1 aspect ratio`;
  
  // Add additional gender reinforcement for better AI understanding
  if (gender === 'male') {
    prompt += ', masculine features';
  } else if (gender === 'female') {
    prompt += ', feminine features';
  }

  console.log(`Generated image prompt: ${prompt}`);
  return prompt;
}

/**
 * Generate an image using fal.ai API
 * @param {string} prompt - The image generation prompt
 * @param {string} apiKey - fal.ai API key
 * @param {string} model - Model to use (default: FLUX_DEV)
 * @returns {Promise<string>} URL of the generated image
 */
export async function generateImage(prompt, apiKey, model = FAL_MODELS.FLUX_DEV) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('fal.ai API key is required for image generation');
  }

  try {
    const response = await fetch(`https://fal.run/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: 'square_hd', // 1:1 aspect ratio
        num_inference_steps: model === FAL_MODELS.JUGGERNAUT_LIGHTNING ? 4 : 28,
        guidance_scale: 7.5,
        num_images: 1,
        enable_safety_checker: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`fal.ai API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.images || result.images.length === 0) {
      throw new Error('No images generated by fal.ai API');
    }

    return result.images[0].url;
  } catch (error) {
    console.error('Error generating image with fal.ai:', error);
    throw error;
  }
}

/**
 * Generate a persona portrait using fal.ai
 * @param {string} fullName - The person's full name
 * @param {Object} nameOptions - Gender preferences from full name options
 * @param {string} falApiKey - fal.ai API key
 * @param {string} model - Model to use (default: FLUX_DEV)
 * @returns {Promise<string>} URL of the generated image
 */
export async function generatePersonaPortrait(fullName, nameOptions, falApiKey, model = FAL_MODELS.FLUX_DEV) {
  try {
    // Get enabled image styles from localStorage
    const enabledStylesJson = localStorage.getItem('enabledImageStyles');
    let enabledStyles = null;
    
    if (enabledStylesJson) {
      try {
        const enabledStylesObj = JSON.parse(enabledStylesJson);
        enabledStyles = Object.keys(enabledStylesObj).filter(styleId => enabledStylesObj[styleId]);
      } catch (error) {
        console.warn('Error parsing enabled image styles, using all styles:', error);
      }
    }
    
    // If no styles are enabled or error occurred, use all styles
    if (!enabledStyles || enabledStyles.length === 0) {
      enabledStyles = getAllStyleIds();
    }
    
    console.log(`Using ${enabledStyles.length} enabled image styles for generation`);
    
    // Select a random style from enabled styles
    const selectedStyle = getRandomStyle(enabledStyles);
    console.log(`Selected image style: ${selectedStyle.name} (${selectedStyle.category})`);
    
    // Generate person description based on the name and gender preferences
    const personDescription = generatePortraitPrompt(fullName, nameOptions);
    
    // Construct the final prompt using the selected style
    const styledPrompt = constructPromptWithStyle(selectedStyle, personDescription);
    console.log(`Final styled prompt: ${styledPrompt}`);
    
    // Generate the image with the styled prompt
    return await generateImage(styledPrompt, falApiKey, model);
  } catch (error) {
    console.error('Error generating persona portrait:', error);
    throw error;
  }
}

/**
 * Generate an image from a physical description
 * @param {string} physicalDescription - Physical description of the person
 * @param {string} gender - Gender preference ('Male', 'Female', or other)
 * @param {string} falApiKey - fal.ai API key
 * @param {string} model - Model to use (default: FLUX_DEV)
 * @returns {Promise<string>} URL of the generated image
 */
export async function generateImageFromDescription(physicalDescription, gender, falApiKey, model = FAL_MODELS.FLUX_DEV) {
  try {
    // Get enabled image styles from localStorage
    const enabledStylesJson = localStorage.getItem('enabledImageStyles');
    let enabledStyles = null;
    
    if (enabledStylesJson) {
      try {
        const enabledStylesObj = JSON.parse(enabledStylesJson);
        enabledStyles = Object.keys(enabledStylesObj).filter(styleId => enabledStylesObj[styleId]);
      } catch (error) {
        console.warn('Error parsing enabled image styles, using all styles:', error);
      }
    }
    
    // If no styles are enabled or error occurred, use all styles
    if (!enabledStyles || enabledStyles.length === 0) {
      enabledStyles = getAllStyleIds();
    }
    
    console.log(`Using ${enabledStyles.length} enabled image styles for description-based generation`);
    
    // Select a random style from enabled styles
    const selectedStyle = getRandomStyle(enabledStyles);
    console.log(`Selected image style: ${selectedStyle.name} (${selectedStyle.category})`);
    
    // Use the physical description as the person description
    const personDescription = physicalDescription;
    
    // Construct the final prompt using the selected style
    const styledPrompt = constructPromptWithStyle(selectedStyle, personDescription);
    console.log(`Final styled prompt from description: ${styledPrompt}`);
    
    // Generate the image with the styled prompt
    return await generateImage(styledPrompt, falApiKey, model);
  } catch (error) {
    console.error('Error generating image from description:', error);
    throw error;
  }
}

/**
 * Generate a creative avatar based on username
 * @param {string} username - The username to base the avatar on
 * @param {string} falApiKey - fal.ai API key
 * @param {string} model - Model to use (default: FLUX_DEV)
 * @returns {Promise<string>} URL of the generated image
 */
export async function generateUsernameAvatar(username, falApiKey, model = FAL_MODELS.FLUX_DEV) {
  try {
    // Get enabled image styles from localStorage
    const enabledStylesJson = localStorage.getItem('enabledImageStyles');
    let enabledStyles = null;
    
    if (enabledStylesJson) {
      try {
        const enabledStylesObj = JSON.parse(enabledStylesJson);
        enabledStyles = Object.keys(enabledStylesObj).filter(styleId => enabledStylesObj[styleId]);
      } catch (error) {
        console.warn('Error parsing enabled image styles, using all styles:', error);
      }
    }
    
    // If no styles are enabled or error occurred, use all styles
    if (!enabledStyles || enabledStyles.length === 0) {
      enabledStyles = getAllStyleIds();
    }
    
    console.log(`Using ${enabledStyles.length} enabled image styles for username avatar generation`);
    
    // Select a random style from enabled styles
    const selectedStyle = getRandomStyle(enabledStyles);
    console.log(`Selected image style for username "${username}": ${selectedStyle.name} (${selectedStyle.category})`);
    
    // Generate creative avatar description based on username
    const avatarDescription = generateUsernameAvatarPrompt(username);
    
    // Construct the final prompt using adapted style for avatars
    const styledPrompt = constructAvatarPromptWithStyle(selectedStyle, avatarDescription);
    console.log(`Final styled username avatar prompt: ${styledPrompt}`);
    
    // Generate the image with the styled prompt
    return await generateImage(styledPrompt, falApiKey, model);
  } catch (error) {
    console.error('Error generating username avatar:', error);
    throw error;
  }
}

/**
 * Generate a creative avatar prompt based on username interpretation
 * @param {string} username - The username to interpret
 * @returns {string} Creative avatar description without mentioning the username
 */
export function generateUsernameAvatarPrompt(username) {
  // Avatar themes and concepts
  const avatarThemes = [
    'abstract geometric composition',
    'minimalist symbol design',
    'stylized emblem',
    'creative logo concept',
    'artistic representation',
    'symbolic interpretation',
    'digital art composition',
    'modern icon design',
    'graphic design element',
    'visual identity concept'
  ];
  
  const visualElements = [
    'dynamic geometric shapes',
    'flowing organic forms',
    'crystalline structures',
    'spiral patterns',
    'angular compositions',
    'circular motifs',
    'triangular elements',
    'wave-like forms',
    'interconnected lines',
    'layered textures'
  ];
  
  const colorApproaches = [
    'monochromatic palette',
    'complementary colors',
    'vibrant gradients',
    'muted earth tones',
    'bold primary colors',
    'pastel harmonies',
    'metallic accents',
    'neon highlights',
    'warm color scheme',
    'cool color palette'
  ];
  
  // Randomly select base elements
  const theme = avatarThemes[Math.floor(Math.random() * avatarThemes.length)];
  const elements = visualElements[Math.floor(Math.random() * visualElements.length)];
  const colors = colorApproaches[Math.floor(Math.random() * colorApproaches.length)];
  
  // Interpret username characteristics and translate to abstract concepts
  let thematicElements = [];
  const lowerUsername = username.toLowerCase();
  
  // Animal-inspired abstract forms
  if (lowerUsername.includes('wolf') || lowerUsername.includes('fox') || lowerUsername.includes('cat') || lowerUsername.includes('dog') || 
      lowerUsername.includes('bear') || lowerUsername.includes('lion') || lowerUsername.includes('tiger') || lowerUsername.includes('eagle')) {
    thematicElements.push('angular predatory forms', 'sharp geometric silhouettes', 'dynamic hunting motion patterns');
  } 
  // Insect/small creature inspired
  else if (lowerUsername.includes('bee') || lowerUsername.includes('ant') || lowerUsername.includes('spider') || lowerUsername.includes('beetle')) {
    thematicElements.push('hexagonal honeycomb patterns', 'intricate lattice structures', 'segmented geometric forms');
  }
  // Tech/digital inspired
  else if (lowerUsername.includes('tech') || lowerUsername.includes('code') || lowerUsername.includes('dev') || lowerUsername.includes('cyber') || 
           lowerUsername.includes('digital') || lowerUsername.includes('byte') || lowerUsername.includes('pixel')) {
    thematicElements.push('circuit board patterns', 'binary-inspired dot matrices', 'technological grid systems');
  }
  // Creative/artistic inspired
  else if (lowerUsername.includes('art') || lowerUsername.includes('design') || lowerUsername.includes('creative') || lowerUsername.includes('paint') || 
           lowerUsername.includes('brush') || lowerUsername.includes('canvas')) {
    thematicElements.push('flowing brushstroke patterns', 'paint splash geometries', 'artistic tool silhouettes');
  }
  // Gaming inspired
  else if (lowerUsername.includes('game') || lowerUsername.includes('play') || lowerUsername.includes('fun') || lowerUsername.includes('quest') || 
           lowerUsername.includes('level') || lowerUsername.includes('boss')) {
    thematicElements.push('controller button patterns', 'dice geometric forms', 'level progression symbols');
  }
  // Music/sound inspired
  else if (lowerUsername.includes('music') || lowerUsername.includes('sound') || lowerUsername.includes('beat') || lowerUsername.includes('tune') || 
           lowerUsername.includes('melody') || lowerUsername.includes('rhythm')) {
    thematicElements.push('sound wave oscillations', 'frequency visualization patterns', 'musical note geometries');
  }
  // Space/cosmic inspired
  else if (lowerUsername.includes('star') || lowerUsername.includes('cosmic') || lowerUsername.includes('space') || lowerUsername.includes('galaxy') || 
           lowerUsername.includes('nebula') || lowerUsername.includes('orbit')) {
    thematicElements.push('stellar burst patterns', 'constellation geometries', 'cosmic spiral forms');
  }
  // Fire/energy inspired
  else if (lowerUsername.includes('fire') || lowerUsername.includes('flame') || lowerUsername.includes('burn') || lowerUsername.includes('blaze') || 
           lowerUsername.includes('ember') || lowerUsername.includes('spark')) {
    thematicElements.push('flame-like angular forms', 'ember particle patterns', 'heat wave distortions');
  }
  // Water/fluid inspired
  else if (lowerUsername.includes('water') || lowerUsername.includes('ocean') || lowerUsername.includes('wave') || lowerUsername.includes('flow') || 
           lowerUsername.includes('stream') || lowerUsername.includes('river')) {
    thematicElements.push('flowing water forms', 'ripple concentric patterns', 'droplet geometric shapes');
  }
  // Food/culinary inspired (like "biscuit" in BumblebeeBiscui)
  else if (lowerUsername.includes('biscuit') || lowerUsername.includes('cookie') || lowerUsername.includes('cake') || lowerUsername.includes('bread') || 
           lowerUsername.includes('food') || lowerUsername.includes('sweet')) {
    thematicElements.push('circular layered forms', 'crumb-like scattered patterns', 'golden brown color gradients');
  }
  // Numbers/data inspired
  else if (/\d/.test(username)) {
    thematicElements.push('numerical grid patterns', 'data visualization elements', 'mathematical geometric progressions');
  }
  // Default abstract elements for unrecognized usernames
  else {
    thematicElements.push('creative symbolic elements', 'unique geometric interpretations', 'abstract identity markers');
  }
  
  // Combine elements into a cohesive prompt
  const selectedThematic = thematicElements[Math.floor(Math.random() * thematicElements.length)];
  const prompt = `${theme} featuring ${elements} with ${colors}, incorporating ${selectedThematic}, completely abstract design, no text, no letters, no words, no usernames, no human elements, no people, purely symbolic and geometric`;
  
  console.log(`Generated abstract avatar prompt for username interpretation: ${prompt}`);
  return prompt;
}

/**
 * Construct avatar prompt with adapted style (removes human-focused elements)
 * @param {Object} style - The image style object
 * @param {string} avatarDescription - The avatar description
 * @returns {string} Styled prompt adapted for non-human avatars
 */
export function constructAvatarPromptWithStyle(style, avatarDescription) {
  // Extract only the essential visual characteristics from the style
  // while completely removing human-focused elements
  
  // Define words/phrases that should be completely removed (human-focused)
  const humanTermsToRemove = [
    'person', 'individual', 'subject', 'model', 'face', 'expression', 'skin', 'eyes', 'hair', 
    'clothing', 'outfit', 'fashion', 'smile', 'portrait', 'headshot', 'beauty', 'glamour',
    'adventurous outfit', 'authentic smile', 'wanderlust vibes', 'diverse locations',
    'Instagram-worthy shot', 'authentic moments', 'travel blogger', 'exotic location background',
    'golden hour light', 'National Geographic style'
  ];
  
  // Extract lighting and aesthetic terms that work for abstract designs
  const lightingTerms = [
    'golden hour', 'soft lighting', 'dramatic lighting', 'natural light', 'warm light', 
    'cool light', 'ambient light', 'diffused light', 'directional light', 'backlighting',
    'side lighting', 'rim lighting', 'studio lighting', 'cinematic lighting'
  ];
  
  const aestheticTerms = [
    'minimalist', 'clean', 'modern', 'vintage', 'retro', 'contemporary', 'artistic',
    'abstract', 'geometric', 'organic', 'flowing', 'structured', 'bold', 'subtle',
    'vibrant', 'muted', 'monochromatic', 'colorful', 'high contrast', 'soft',
    'sharp', 'textured', 'smooth', 'gradient', 'metallic', 'glossy', 'matte'
  ];
  
  // Create a completely new prompt based on style characteristics
  let styleCharacteristics = [];
  
  // Extract lighting if present
  const originalText = `${style.promptTemplate} ${style.promptSuffix}`.toLowerCase();
  lightingTerms.forEach(term => {
    if (originalText.includes(term.toLowerCase())) {
      styleCharacteristics.push(term);
    }
  });
  
  // Extract aesthetic terms if present
  aestheticTerms.forEach(term => {
    if (originalText.includes(term.toLowerCase())) {
      styleCharacteristics.push(term);
    }
  });
  
  // Add category-specific characteristics
  let categoryCharacteristics = [];
  switch (style.category) {
    case 'Professional':
      categoryCharacteristics = ['clean lines', 'minimalist composition', 'corporate aesthetic', 'polished finish'];
      break;
    case 'Artistic':
      categoryCharacteristics = ['creative composition', 'artistic interpretation', 'expressive elements', 'abstract forms'];
      break;
    case 'Illustrated':
      categoryCharacteristics = ['stylized design', 'graphic elements', 'illustration style', 'vector-like quality'];
      break;
    case 'Specialty':
      categoryCharacteristics = ['unique visual style', 'specialized aesthetic', 'distinctive approach', 'thematic design'];
      break;
    case 'Time Period':
      categoryCharacteristics = ['vintage aesthetic', 'period-appropriate styling', 'historical design elements', 'retro composition'];
      break;
    case 'Cultural':
      categoryCharacteristics = ['cultural design motifs', 'regional aesthetic', 'traditional patterns', 'cultural symbolism'];
      break;
    default:
      categoryCharacteristics = ['distinctive visual style', 'creative approach', 'unique aesthetic'];
  }
  
  // Combine all characteristics
  const allCharacteristics = [...styleCharacteristics, ...categoryCharacteristics];
  const characteristicsString = allCharacteristics.length > 0 ? allCharacteristics.join(', ') : 'modern aesthetic';
  
  // Construct the final prompt with ONLY non-human elements
  const finalPrompt = `${avatarDescription}, ${characteristicsString}, abstract design, no text, no letters, no words, no usernames, no human figures, no people, no faces, no persons, no portraits, purely symbolic and geometric`;
  
  return finalPrompt;
}

/**
 * Estimate cost for bulk image generation
 * @param {number} count - Number of images to generate
 * @param {string} model - Model to use
 * @returns {Object} Cost estimation
 */
export function estimateImageGenerationCost(count, model = FAL_MODELS.FLUX_DEV) {
  // Approximate costs based on fal.ai pricing (as of 2024)
  const costPerImage = {
    [FAL_MODELS.FLUX_DEV]: 0.025, // ~$0.025 per image
    [FAL_MODELS.JUGGERNAUT_BASE]: 0.020, // ~$0.020 per image  
    [FAL_MODELS.JUGGERNAUT_LIGHTNING]: 0.015, // ~$0.015 per image (faster)
    [FAL_MODELS.SEEDREAM_V3]: 0.030, // ~$0.030 per image (ByteDance model)
    [FAL_MODELS.MINIMAX_IMAGE_01]: 0.025, // ~$0.025 per image
    [FAL_MODELS.IDEOGRAM_V3]: 0.020, // ~$0.020 per image (good for text)
    [FAL_MODELS.RUNDIFFUSION_PHOTO_FLUX]: 0.025 // ~$0.025 per image (photo realistic)
  };

  const unitCost = costPerImage[model] || costPerImage[FAL_MODELS.FLUX_DEV];
  const totalCost = count * unitCost;

  return {
    count,
    unitCost,
    totalCost,
    model,
    formatted: `$${totalCost.toFixed(2)} (${count} images × $${unitCost.toFixed(3)} each)`
  };
} 