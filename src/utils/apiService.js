// src/utils/apiService.js

/**
 * Abstracts API calls to OpenAI, Anthropic, and other providers for generating
 * usernames, names, addresses, and bios.
 */

export const PROVIDERS = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  GOOGLE: "google",
  MISTRAL: "mistral",
  TOGETHER: "together",
  FIREWORKS: "fireworks",
  INFERENCE: "inference"
};

/**
 * Create user-friendly error messages from API errors
 * @param {number} status - HTTP status code
 * @param {Object} errorData - Error response data
 * @param {string} provider - AI provider name
 * @returns {string} User-friendly error message
 */
function createUserFriendlyError(status, errorData, provider) {
  // Extract error message from different provider formats
  let errorMessage = '';
  let errorCode = '';
  
  if (errorData.error) {
    errorMessage = errorData.error.message || errorData.error;
    errorCode = errorData.error.code || '';
  } else if (errorData.message) {
    errorMessage = errorData.message;
  } else if (errorData.detail) {
    errorMessage = errorData.detail;
  }

  // Handle specific error types with user-friendly messages
  switch (status) {
    case 401:
      return `❌ Invalid API key for ${provider}. Please check your API key in Settings.`;
    
    case 403:
      return `❌ Access denied for ${provider}. Your API key may not have permission for this operation.`;
    
    case 429:
      // Rate limit errors - check for specific quota messages
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        if (errorMessage.includes('migrate to Gemini 2.0')) {
          return `⏱️ Google API quota exceeded. Try switching to a different provider in Settings, or wait a few minutes before trying again.`;
        }
        return `⏱️ ${provider} rate limit exceeded. Please wait a few minutes before trying again, or switch to a different provider in Settings.`;
      }
      return `⏱️ Too many requests to ${provider}. Please wait a moment and try again.`;
    
    case 400:
      if (errorMessage.includes('model') || errorMessage.includes('invalid')) {
        return `⚙️ Invalid request to ${provider}. The model or parameters may not be supported.`;
      }
      return `⚙️ Bad request to ${provider}. Please check your settings and try again.`;
    
    case 500:
    case 502:
    case 503:
    case 504:
      return `🔧 ${provider} is experiencing technical difficulties. Please try again in a few minutes or switch to a different provider.`;
    
    default:
      // For unknown errors, provide a generic but helpful message
      if (errorMessage && errorMessage.length < 200) {
        return `❌ ${provider} error: ${errorMessage}`;
      }
      return `❌ ${provider} is currently unavailable. Please try again later or switch to a different provider in Settings.`;
  }
}

// API endpoints for different providers
const API_ENDPOINTS = {
  [PROVIDERS.OPENAI]: "https://api.openai.com/v1/chat/completions",
  [PROVIDERS.ANTHROPIC]: "https://api.anthropic.com/v1/messages",
  [PROVIDERS.GOOGLE]: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
  [PROVIDERS.MISTRAL]: "https://api.mistral.ai/v1/chat/completions",
  [PROVIDERS.TOGETHER]: "https://api.together.xyz/v1/completions",
  [PROVIDERS.FIREWORKS]: "https://api.fireworks.ai/inference/v1/completions",
  [PROVIDERS.INFERENCE]: "https://api.inference.net/v1/chat/completions"
};

// Default models for each provider
// DO NOT EDIT THESE VALUES
const DEFAULT_MODELS = {
  [PROVIDERS.OPENAI]: "gpt-4o-mini",
  [PROVIDERS.ANTHROPIC]: "claude-3-5-haiku-latest",
  [PROVIDERS.GOOGLE]: "gemini-2.0-flash-exp",
  [PROVIDERS.MISTRAL]: "mistral-small-latest",
  [PROVIDERS.TOGETHER]: "Qwen/Qwen2.5-7B-Instruct-Turbo",
  [PROVIDERS.FIREWORKS]: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  [PROVIDERS.INFERENCE]: "meta-llama/llama-3.1-8b-instruct/fp-8"
};

/**
 * Make an API request to the specified provider
 * @param {Object} params - Request parameters
 * @returns {Promise<Object>} - API response
 */
async function makeApiRequest({ provider, apiKey, prompt, model, temperature = 0.9, maxTokens = 100 }) {
  // Add detailed logging to help debug API key issues
  console.log(`makeApiRequest called with provider: "${provider}", apiKey: "${apiKey ? '***' + apiKey.substring(apiKey.length - 4) : 'none'}"`);
  
  // If missing API key, throw an error - don't use mock implementation
  if (!apiKey) {
    console.error(`No API key provided for ${provider}. THIS IS NOT DESIRED BEHAVIOR - CHECK API KEY SETUP.`);
    throw new Error(`No API key provided for ${provider}. Please enter a valid API key in Settings.`);
  }

  // If provider is not valid, throw an error
  if (!provider) {
    console.error(`No provider specified. THIS IS NOT DESIRED BEHAVIOR - CHECK PROVIDER SETUP.`);
    throw new Error(`No provider specified. Please select a valid provider in Settings.`);
  }

  const endpoint = API_ENDPOINTS[provider];
  if (!endpoint) {
    console.error(`Unsupported provider: ${provider}. Please select a valid provider in Settings.`);
    throw new Error(`Unsupported provider: ${provider}. Please select a valid provider in Settings.`);
  }

  const modelToUse = model || DEFAULT_MODELS[provider];
  let requestBody;
  let headers = {
    "Content-Type": "application/json"
  };

  // Configure request based on provider
  switch (provider) {
    case PROVIDERS.OPENAI:
      headers["Authorization"] = `Bearer ${apiKey}`;
      requestBody = {
        model: modelToUse,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens
      };
      break;

    case PROVIDERS.ANTHROPIC:
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      requestBody = {
        model: modelToUse,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens
      };
      break;

    case PROVIDERS.GOOGLE:
      // Google uses API key as query parameter, not Authorization header
      requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens
        }
      };
      break;

    case PROVIDERS.MISTRAL:
      headers["Authorization"] = `Bearer ${apiKey}`;
      requestBody = {
        model: modelToUse,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens
      };
      break;

    case PROVIDERS.TOGETHER:
      headers["Authorization"] = `Bearer ${apiKey}`;
      requestBody = {
        model: modelToUse,
        prompt,
        temperature,
        max_tokens: maxTokens
      };
      break;

    case PROVIDERS.FIREWORKS:
      headers["Authorization"] = `Bearer ${apiKey}`;
      requestBody = {
        model: modelToUse,
        prompt,
        temperature,
        max_tokens: maxTokens
      };
      break;

    case PROVIDERS.INFERENCE:
      headers["Authorization"] = `Bearer ${apiKey}`;
      requestBody = {
        model: modelToUse,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens
      };
      break;

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  try {
    // For Google, append API key as query parameter
    let finalEndpoint = endpoint;
    if (provider === PROVIDERS.GOOGLE) {
      finalEndpoint = `${endpoint}?key=${apiKey}`;
    }
    
    console.log(`Making API request to ${finalEndpoint}`);
    console.log(`Request headers:`, JSON.stringify(headers, null, 2));
    console.log(`Request body:`, JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(finalEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorData);
      
      // Create user-friendly error messages
      const userFriendlyError = createUserFriendlyError(response.status, errorData, provider);
      throw new Error(userFriendlyError);
    }

    const responseData = await response.json();
    console.log(`Response data:`, JSON.stringify(responseData, null, 2));
    return responseData;
  } catch (error) {
    console.error(`API request error:`, error);
    // Don't fall back to mock implementation here - throw the error so the user knows something went wrong
    throw error;
  }
}

/**
 * Extract text from API response based on provider
 * @param {Object} response - API response
 * @param {string} provider - Provider name
 * @returns {string} - Extracted text
 */

function extractTextFromResponse(response, provider) {
  console.log(`Extracting text from response for provider: "${provider}"`);
  console.log(`Response:`, JSON.stringify(response, null, 2));
  
  try {
    // Handle case where response structure is unexpected
    if (!response.choices && !response.content && !response.candidates) {
      console.error('Unexpected response structure:', response);
      throw new Error(`Unexpected response structure from ${provider}`);
    }
    
    let extractedText;
    
    switch (provider) {
      case PROVIDERS.OPENAI:
        console.log('Extracting text for OpenAI response');
        extractedText = response.choices[0].message.content.trim();
        break;

      case PROVIDERS.ANTHROPIC:
        console.log('Extracting text for Anthropic response');
        extractedText = response.content[0].text.trim();
        break;

      case PROVIDERS.GOOGLE:
        console.log('Extracting text for Google response');
        extractedText = response.candidates[0].content.parts[0].text.trim();
        break;

      case PROVIDERS.MISTRAL:
        console.log('Extracting text for Mistral response');
        extractedText = response.choices[0].message.content.trim();
        break;

      case PROVIDERS.TOGETHER:
        console.log('Extracting text for Together.ai response');
        extractedText = response.choices[0].text.trim();
        break;

      case PROVIDERS.FIREWORKS:
        console.log('Extracting text for Fireworks.ai response');
        extractedText = response.choices[0].text.trim();
        break;

      case PROVIDERS.INFERENCE:
        console.log('Extracting text for Inference.net response');
        extractedText = response.choices[0].message.content.trim();
        break;

      default:
        console.error(`Unsupported provider: ${provider}`);
        throw new Error(`Unsupported provider: ${provider}. Please select a valid provider in Settings.`);
    }
    
    console.log(`Extracted text: "${extractedText}"`);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from response:", error);
    console.error("Response:", JSON.stringify(response, null, 2));
    throw new Error(`Failed to extract text from ${provider} response: ${error.message}`);
  }
}

/**
 * Generate a username
 * @param {Object} params - Parameters
 * @param {string} params.provider - The AI provider to use
 * @param {Object} params.apiKeys - API keys for providers
 * @param {Object} params.options - Username generation options
 * @returns {Promise<string>} The generated username
 */
export async function generateUsername(provider, apiKey, options = {}) {
  // Create apiKeys object for internal use
  const apiKeys = apiKey ? { [provider]: apiKey } : {};

  let promptOptions = [];
  let negativePrompts = [];
  
  // Positive requirements
  if (options.useAlliteration) promptOptions.push("Use alliteration (both words start with the same letter)");
  if (options.useSilly) promptOptions.push("Create playful, lighthearted usernames with unexpected word combinations, creative twists, or amusing contrasts - be inventive and original");
  if (options.useMadeUpWords) promptOptions.push("Include made-up words or creative word blends");
  if (options.useRhyming) promptOptions.push("Use rhyming words");
  if (options.includeNumbers) promptOptions.push("Include numbers");
  if (options.includeSpecialChars) promptOptions.push("Include special characters like underscore, period, or hyphen");
  if (options.maxLength) promptOptions.push(`Maximum length: ${options.maxLength} characters`);
  
  // Negative requirements (what NOT to include)
  if (!options.includeNumbers) negativePrompts.push("Do NOT include any numbers or digits");
  if (!options.includeSpecialChars) negativePrompts.push("Do NOT include any special characters, underscores, periods, or hyphens");
  
  // Always enforce no spaces
  negativePrompts.push("Do NOT include any spaces - username must be a single word or connected words");

  const optionsText = promptOptions.length > 0 
    ? `\nRequirements:\n${promptOptions.map(opt => `- ${opt}`).join('\n')}`
    : "";
    
  const negativeText = negativePrompts.length > 0
    ? `\nStrict Prohibitions:\n${negativePrompts.map(opt => `- ${opt}`).join('\n')}`
    : "";

  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 1000000) + Date.now() % 100000;
  const entropyBoost = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
  
  // Add creative diversity approaches to prevent repetitive patterns
  const creativeApproaches = [
    "unexpected combinations of everyday objects",
    "contrasting concepts blended together", 
    "action words paired with unusual nouns",
    "color-emotion combinations",
    "texture-sound pairings",
    "size-material contrasts",
    "weather-personality blends",
    "food-adventure combinations",
    "geometric-nature fusions",
    "time-space conceptual pairs"
  ];
  const selectedApproach = creativeApproaches[Math.floor(Math.random() * creativeApproaches.length)];
  
  const prompt = `Generate a single creative username for an online profile using ${selectedApproach}. IMPORTANT: Generate a COMPLETELY DIFFERENT username each time - avoid repetitive patterns and overused words. DO NOT use common patterns like "TechWiz", "CyberNinja", "PixelMaster", "CodeWarrior", or similar predictable combinations. Avoid overused words like "Wombat", "Phoenix", "Shadow", "Storm", "Wolf", "Cyber", "Tech", "Neo", "Pixel", "Digital", "Flibbertigibbet", "Whimsical", "Giggles", "Bubbles", etc. Do NOT repeat word roots or stems (like "Flibberti-" variations). Instead, create truly unique and unexpected combinations using diverse vocabulary from different domains (nature, colors, objects, actions, emotions, places, etc.). The username should be memorable, unique, and appropriate for professional use. Use this random seed for variety: ${randomSeed}-${entropyBoost}.${optionsText}${negativeText}\n\nRespond with ONLY the username, nothing else.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: 30
  });

  let username = extractTextFromResponse(response, provider);
  
  // Post-process to enforce requirements
  username = cleanUsername(username, options);
  
  return username;
}

/**
 * Clean and validate a username based on options
 * @param {string} username - The username to clean
 * @param {Object} options - Username generation options
 * @returns {string} Cleaned username
 */
function cleanUsername(username, options) {
  // Remove any quotes, extra whitespace, and trim
  let cleaned = username.replace(/['"]/g, '').trim();
  
  // Remove spaces - usernames should never have spaces
  cleaned = cleaned.replace(/\s+/g, '');
  
  // If numbers are not allowed, remove them
  if (!options.includeNumbers) {
    cleaned = cleaned.replace(/\d/g, '');
  }
  
  // If special characters are not allowed, remove them (except basic letters)
  if (!options.includeSpecialChars) {
    cleaned = cleaned.replace(/[^a-zA-Z0-9]/g, '');
  }
  
  // Apply max length constraint if needed
  if (options.maxLength && cleaned.length > options.maxLength) {
    cleaned = cleaned.substring(0, options.maxLength);
  }
  
  // Ensure username is not empty after cleaning
  if (cleaned.length === 0) {
    cleaned = 'user' + Math.floor(Math.random() * 1000);
  }
  
  return cleaned;
}

/**
 * Generate a full name
 * @param {Object} params - Parameters
 * @param {string} params.provider - The AI provider to use
 * @param {Object} params.apiKeys - API keys for providers
 * @param {Object} params.options - Name generation options
 * @returns {Promise<string>} The generated full name
 */
export async function generateFullName(provider, apiKey, options = {}) {
  // Create apiKeys object for internal use
  const apiKeys = apiKey ? { [provider]: apiKey } : {};

  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 100000) + Date.now() % 10000;
  
  // Build gender preferences
  let genderOptions = [];
  if (options.includeMale) genderOptions.push("male");
  if (options.includeFemale) genderOptions.push("female");
  if (options.includeNeutral) genderOptions.push("gender-neutral");
  
  // If no gender options selected, default to all
  if (genderOptions.length === 0) {
    genderOptions = ["male", "female", "gender-neutral"];
  }
  
  const genderText = genderOptions.length === 3 
    ? "Generate a name that could be male, female, or gender-neutral" 
    : `Generate a ${genderOptions.join(" or ")} name`;
  
  // Handle context if provided
  const contextText = options.context && options.context.trim() 
    ? ` The name should fit this context: ${options.context.trim()}.`
    : "";
  
  const prompt = `Generate a single realistic full name (first and last name) for a person. ${genderText}. IMPORTANT: Generate a DIFFERENT name each time - do not repeat names like "Emily Thompson" or overuse common names like "Jordan", "Alex", "Taylor", "Morgan", or "Casey". Use common, real-world names that sound natural together but ensure maximum variety and avoid repetitive patterns. Avoid unusual or made-up names.${contextText} Use this random seed for variety: ${randomSeed}. Respond with ONLY the name, nothing else.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: 20
  });

  return extractTextFromResponse(response, provider);
}

/**
 * Generate a full name and return both the name and detected gender
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {Object} options - Generation options
 * @returns {Promise<{name: string, gender: string}>} Generated name and detected gender
 */
export async function generateFullNameWithGender(provider, apiKey, options = {}) {
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 100000) + Date.now() % 10000;
  
  // Build gender preferences
  let genderOptions = [];
  if (options.includeMale) genderOptions.push("male");
  if (options.includeFemale) genderOptions.push("female");
  if (options.includeNeutral) genderOptions.push("gender-neutral");
  
  // If no gender options selected, default to all
  if (genderOptions.length === 0) {
    genderOptions = ["male", "female", "gender-neutral"];
  }
  
  const genderText = genderOptions.length === 3 
    ? "Generate a name that could be male, female, or gender-neutral" 
    : `Generate a ${genderOptions.join(" or ")} name`;
  
  // Handle context if provided
  const contextText = options.context && options.context.trim() 
    ? ` The name should fit this context: ${options.context.trim()}.`
    : "";
  
  const prompt = `Generate a single realistic full name (first and last name) for a person. ${genderText}. IMPORTANT: Generate a DIFFERENT name each time - do not repeat names like "Emily Thompson" or overuse common names like "Jordan", "Alex", "Taylor", "Morgan", or "Casey". Use common, real-world names that sound natural together but ensure maximum variety and avoid repetitive patterns. Avoid unusual or made-up names.${contextText} Use this random seed for variety: ${randomSeed}.

Respond in this EXACT format:
Name: [Full Name]
Gender: [male/female/neutral]

Example:
Name: Sarah Johnson
Gender: female`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0,
    maxTokens: 30
  });

  const responseText = extractTextFromResponse(response, provider);
  
  // Parse the response
  const lines = responseText.trim().split('\n');
  let name = '';
  let gender = 'neutral';
  
  for (const line of lines) {
    if (line.startsWith('Name:')) {
      name = line.replace('Name:', '').trim();
    } else if (line.startsWith('Gender:')) {
      gender = line.replace('Gender:', '').trim().toLowerCase();
    }
  }
  
  // Fallback if parsing fails - try to extract just the name
  if (!name) {
    // Look for any line that looks like a name
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('Gender:') && trimmed.split(' ').length >= 2) {
        name = trimmed;
        break;
      }
    }
  }
  
  // Final fallback
  if (!name) {
    name = responseText.trim().split('\n')[0] || 'Unknown Name';
  }
  
  return { name, gender };
}

/**
 * Detect gender from any name using LLM intelligence
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {string} fullName - The name to analyze
 * @returns {Promise<string>} Detected gender: 'male', 'female', or 'neutral'
 */
export async function detectGenderFromNameLLM(provider, apiKey, fullName) {
  if (!fullName) return 'neutral';
  
  const prompt = `Analyze this name and determine the most likely gender: "${fullName}"

Consider:
- Traditional gender associations of the first name
- Cultural and linguistic patterns
- Modern usage and variations

Respond with ONLY one word: male, female, or neutral`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 0.3, // Lower temperature for more consistent gender detection
    maxTokens: 5
  });

  const detectedGender = extractTextFromResponse(response, provider).toLowerCase().trim();
  
  // Validate response
  if (['male', 'female', 'neutral'].includes(detectedGender)) {
    return detectedGender;
  }
  
  return 'neutral'; // Fallback
}

/**
 * Generate an address
 * @param {Object} params - Parameters
 * @param {string} params.provider - The AI provider to use
 * @param {Object} params.apiKeys - API keys for providers
 * @returns {Promise<string>} The generated address
 */
export async function generateAddress(provider, apiKey) {
  // Add detailed logging to help debug API key issues
  console.log(`generateAddress called with provider: "${provider}", apiKey: "${apiKey ? '***' + apiKey.substring(apiKey.length - 4) : 'none'}"`);
  
  // Validate inputs
  if (!provider || provider === 'default') {
    console.error(`Invalid provider: "${provider}" - must be a valid provider name`);
    throw new Error(`Invalid provider: "${provider}" - must be a valid provider name`);
  }
  
  if (!apiKey) {
    console.error(`No API key provided for ${provider} - cannot generate address`);
    throw new Error(`No API key provided for ${provider} - cannot generate address`);
  }

  // Create apiKeys object for internal use
  const apiKeys = apiKey ? { [provider]: apiKey } : {};

  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 10000);
  
  // Use a more specific prompt to get REAL addresses with varied street numbers
  const prompt = `Generate a single REAL street address in the United States that actually exists. IMPORTANT: Generate a DIFFERENT address each time - do not repeat addresses. Use ONLY real street names that actually exist in the city you specify - do not invent fictional streets. DO NOT use generic street numbers like 123, 456, or 789 - use varied, realistic street numbers between 1 and 9999. Choose from a wide variety of real cities and states across the US. The address should include a realistic and varied street number (NOT 123!), a real street name that exists in that city, the city name, state abbreviation, and a valid ZIP code for that location. Use this random seed for variety: ${randomSeed}. Respond with ONLY the address, nothing else.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: 50
  });

  return extractTextFromResponse(response, provider);
}

/**
 * Generate a bio
 * @param {Object} params - Parameters
 * @param {string} params.provider - The AI provider to use
 * @param {Object} params.apiKeys - API keys for providers
 * @param {string} params.fullName - The name to use in the bio
 * @returns {Promise<string>} The generated bio
 */
export async function generateBio(provider, apiKey, options = {}) {
  // Create apiKeys object for internal use
  const apiKeys = apiKey ? { [provider]: apiKey } : {};
  const fullName = options.fullName || "";
  const gender = options.gender || "Male";

  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 10000);
  
  const nameContext = fullName ? `for a ${gender.toLowerCase()} person named "${fullName}"` : `for a ${gender.toLowerCase()} person`;
  const pronouns = gender.toLowerCase() === 'male' ? 'he/him' : gender.toLowerCase() === 'female' ? 'she/her' : 'they/them';
  
  const prompt = `Generate a realistic professional bio ${nameContext} for an online profile. IMPORTANT: Use the correct pronouns (${pronouns}) consistently throughout the bio. Generate a DIFFERENT bio each time - ensure variety and uniqueness. The bio should be 1-2 sentences describing a real-world profession, practical skills, and believable interests. Avoid exaggerated claims or unrealistic achievements. Make it sound like a real person you might meet. Use this random seed for variety: ${randomSeed}. Respond with ONLY the bio text, nothing else - no introductory phrases like "Here is a bio" or similar.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: 100
  });

  return extractTextFromResponse(response, provider);
}

/**
 * Generate a password
 * @param {string} provider - The AI provider to use (not used for password generation)
 * @param {string} apiKey - The API key for the provider (not used for password generation)
 * @param {Object} options - Password generation options
 * @returns {Promise<string>} The generated password
 */
export async function generatePassword(provider, apiKey, options = {}) {
  // This function doesn't need an API call, we generate passwords locally
  return new Promise((resolve) => {
    const length = options.length || 12;
    const useUppercase = options.includeUppercase !== false;
    const useLowercase = options.includeLowercase !== false;
    const useNumbers = options.includeNumbers !== false;
    const useSpecialChars = options.includeSpecialChars !== false;

    let chars = '';
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSpecialChars) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    resolve(password);
  });
}

/**
 * Generate multiple usernames in a single API call
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {number} count - Number of usernames to generate
 * @param {Object} options - Username generation options
 * @returns {Promise<string[]>} Array of generated usernames
 */
export async function generateMultipleUsernames(provider, apiKey, count, options = {}) {
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 1000000) + Date.now() % 100000;
  const entropyBoost = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
  
  // Add creative diversity approaches to prevent repetitive patterns
  const creativeApproaches = [
    "unexpected combinations of everyday objects",
    "contrasting concepts blended together", 
    "action words paired with unusual nouns",
    "color-emotion combinations",
    "texture-sound pairings",
    "size-material contrasts",
    "weather-personality blends",
    "food-adventure combinations",
    "geometric-nature fusions",
    "time-space conceptual pairs",
    "profession-hobby mashups",
    "animal-technology blends",
    "music-science combinations"
  ];
  const selectedApproach = creativeApproaches[Math.floor(Math.random() * creativeApproaches.length)];
  
  console.log("Username options received:", JSON.stringify(options));
  
  let promptOptions = [];
  let negativePrompts = [];
  
  // Handle all possible options from the UI - make them MANDATORY when selected
  if (options.useAlliteration) promptOptions.push("ALL usernames MUST use alliteration (both words start with the same letter)");
  if (options.useSilly) promptOptions.push("ALL usernames MUST be playful and lighthearted with unexpected word combinations, creative twists, or amusing contrasts - be inventive and original with each one");
  if (options.useMadeUpWords) promptOptions.push("ALL usernames MUST include made-up words or creative word blends");
  if (options.useRhyming) promptOptions.push("ALL usernames MUST use rhyming words");
  if (options.includeNumbers) promptOptions.push("ALL usernames MUST include numbers");
  if (options.includeSpecialChars) promptOptions.push("ALL usernames MUST include special characters like underscore, period, or hyphen");
  
  // Negative requirements (what NOT to include)
  if (!options.includeNumbers) negativePrompts.push("ALL usernames MUST NOT contain any numbers or digits");
  if (!options.includeSpecialChars) negativePrompts.push("ALL usernames MUST NOT contain any special characters, underscores, periods, or hyphens");
  
  // Always enforce no spaces
  negativePrompts.push("ALL usernames MUST NOT contain any spaces - each username must be a single word or connected words");
  
  // Make sure to respect the maxLength setting
  if (options.maxLength) {
    promptOptions.push(`All usernames MUST be maximum ${options.maxLength} characters long - this is a strict requirement`);
    console.log(`Enforcing maximum length of ${options.maxLength} characters for usernames`);
  }
  
  // Handle context if provided
  if (options.context && options.context.trim()) {
    promptOptions.push(`Usernames should relate to this context: ${options.context.trim()}`);
    console.log(`Using context for usernames: ${options.context.trim()}`);
  }

  const optionsText = promptOptions.length > 0
    ? `\nRequirements:\n${promptOptions.map(opt => `- ${opt}`).join('\n')}`
    : "";
    
  const negativeText = negativePrompts.length > 0
    ? `\nStrict Prohibitions:\n${negativePrompts.map(opt => `- ${opt}`).join('\n')}`
    : "";
  
  const prompt = `Generate ${count} UNIQUE creative usernames for online profiles using ${selectedApproach}. Each username should be memorable, unique, and appropriate for professional use. IMPORTANT: Make sure all usernames are COMPLETELY DIFFERENT from each other - avoid repetitive patterns, overused words, and predictable combinations. DO NOT use common patterns like "TechWiz", "CyberNinja", "PixelMaster", "CodeWarrior", or similar predictable combinations. Avoid overused words like "Wombat", "Phoenix", "Shadow", "Storm", "Wolf", "Cyber", "Tech", "Neo", "Pixel", "Digital", "Quantum", "Matrix", "Neon", "Azure", "Cosmic", "Flibbertigibbet", "Whimsical", "Giggles", "Bubbles", etc. Do NOT repeat word roots or stems (like "Flibberti-" variations). Create truly diverse and unexpected combinations using varied vocabulary from different domains (nature, colors, objects, actions, emotions, places, food, weather, materials, etc.). Each username must be completely different in structure and word choice. STRICTLY FOLLOW ALL REQUIREMENTS BELOW - these are NOT optional suggestions but MANDATORY requirements. Use this random seed for variety: ${randomSeed}-${entropyBoost}.${optionsText}${negativeText}\n\nRespond with ONLY a numbered list of usernames, one per line, like this:\n1. Username1\n2. Username2\netc.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: count * 10 // Estimate 10 tokens per username
  });

  const responseText = extractTextFromResponse(response, provider);
  
  // Parse the numbered list response
  let usernames = responseText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.match(/^\d+\.\s+/)) // Only lines that start with a number and period
    .map(line => line.replace(/^\d+\.\s+/, '').trim()) // Remove the numbering
    .filter(username => username.length > 0);
  
  console.log(`Parsed ${usernames.length} usernames from response`);
  
  // Clean and validate all usernames
  const cleanedUsernames = usernames.map(username => cleanUsername(username, options));
  
  // Validate that usernames meet the requirements
  const validatedUsernames = cleanedUsernames.filter(username => {
    let isValid = true;
    
    // Check for spaces (should never exist after cleaning)
    if (/\s/.test(username)) {
      console.log(`Username "${username}" rejected: contains spaces`);
      isValid = false;
    }
    
    // Check each requirement
    if (options.useAlliteration && isValid) {
      // Check if username has alliteration (at least two words starting with the same letter)
      const words = username.split(/[^a-zA-Z0-9]/).filter(w => w.length > 0);
      if (words.length >= 2) {
        const firstLetters = words.map(w => w[0].toLowerCase());
        const hasAlliteration = firstLetters.some((letter, i) =>
          i > 0 && letter === firstLetters[i-1]
        );
        if (!hasAlliteration) {
          console.log(`Username "${username}" rejected: does not use alliteration`);
          isValid = false;
        }
      }
    }
    
    if (options.includeNumbers && isValid) {
      // Check if username includes at least one number
      if (!/\d/.test(username)) {
        console.log(`Username "${username}" rejected: does not include numbers`);
        isValid = false;
      }
    }
    
    if (!options.includeNumbers && isValid) {
      // Check if username contains numbers when they shouldn't
      if (/\d/.test(username)) {
        console.log(`Username "${username}" rejected: contains numbers when not allowed`);
        isValid = false;
      }
    }
    
    if (options.includeSpecialChars && isValid) {
      // Check if username includes at least one special character
      if (!/[_.\-]/.test(username)) {
        console.log(`Username "${username}" rejected: does not include special characters`);
        isValid = false;
      }
    }
    
    if (!options.includeSpecialChars && isValid) {
      // Check if username contains special characters when they shouldn't
      if (/[^a-zA-Z0-9]/.test(username)) {
        console.log(`Username "${username}" rejected: contains special characters when not allowed`);
        isValid = false;
      }
    }
    
    // Check minimum length
    if (username.length < 3) {
      console.log(`Username "${username}" rejected: too short`);
      isValid = false;
    }
    
    return isValid;
  });
  
  console.log(`${validatedUsernames.length} usernames passed validation out of ${cleanedUsernames.length} cleaned usernames`);
  
  // If we lost too many usernames in validation, use the cleaned list
  if (validatedUsernames.length < cleanedUsernames.length / 2) {
    console.warn(`Too many usernames failed validation (${cleanedUsernames.length - validatedUsernames.length}), using cleaned list`);
    return cleanedUsernames;
  }
  
  return validatedUsernames;
}

/**
 * Generate multiple full names in a single API call
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {number} count - Number of names to generate
 * @param {Object} options - Name generation options
 * @returns {Promise<string[]>} Array of generated full names
 */
export async function generateMultipleFullNames(provider, apiKey, count, options = {}) {
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 100000) + Date.now() % 10000;
  
  // Build gender preferences
  let genderOptions = [];
  if (options.includeMale) genderOptions.push("male");
  if (options.includeFemale) genderOptions.push("female");
  if (options.includeNeutral) genderOptions.push("gender-neutral");
  
  // If no gender options selected, default to all
  if (genderOptions.length === 0) {
    genderOptions = ["male", "female", "gender-neutral"];
  }
  
  const genderText = genderOptions.length === 3 
    ? "Generate names that could be male, female, or gender-neutral - ensure variety across all gender types" 
    : `Generate ${genderOptions.join(" and ")} names`;
  
  // Handle context if provided
  const contextText = options.context && options.context.trim() 
    ? ` The names should fit this context: ${options.context.trim()}.`
    : "";
  
  const prompt = `Generate ${count} UNIQUE realistic full names (first and last name) for people. ${genderText}. IMPORTANT: Make sure all names are different from each other - DO NOT repeat names like "Emily Thompson" or overuse common names like "Jordan", "Alex", "Taylor", "Morgan", or "Casey". Use common, real-world names that sound natural together but ensure maximum variety and avoid repetitive patterns. Avoid unusual or made-up names.${contextText} Use this random seed for variety: ${randomSeed}.\n\nRespond with ONLY a numbered list of names, one per line, like this:\n1. John Smith\n2. Jane Doe\netc.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: count * 10 // Estimate 10 tokens per name
  });

  const responseText = extractTextFromResponse(response, provider);
  
  // Parse the numbered list response
  return responseText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.match(/^\d+\.\s+/)) // Only lines that start with a number and period
    .map(line => line.replace(/^\d+\.\s+/, '').trim()) // Remove the numbering
    .filter(name => name.length > 0);
}

/**
 * Generate multiple addresses in a single API call
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {number} count - Number of addresses to generate
 * @returns {Promise<string[]>} Array of generated addresses
 */
export async function generateMultipleAddresses(provider, apiKey, count) {
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 10000);
  
  const prompt = `Generate ${count} UNIQUE REAL street addresses in the United States that actually exist. IMPORTANT: Make sure all addresses are different from each other - ensure maximum variety. Use ONLY real street names that actually exist in the cities you specify - do not invent fictional streets. DO NOT use generic street numbers like 123, 456, or 789 - use varied, realistic street numbers between 1 and 9999. Choose from a wide variety of real cities and states across the US. Each address should include a realistic and varied street number (NOT 123!), a real street name that exists in that city, the city name, state abbreviation, and a valid ZIP code for that location. Use this random seed for variety: ${randomSeed}.\n\nRespond with ONLY a numbered list of addresses, one per line, like this:\n1. 1600 Pennsylvania Ave NW, Washington, DC 20500\n2. 350 Fifth Avenue, New York, NY 10118\netc.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: count * 20 // Estimate 20 tokens per address
  });

  const responseText = extractTextFromResponse(response, provider);
  
  // Parse the numbered list response
  return responseText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.match(/^\d+\.\s+/)) // Only lines that start with a number and period
    .map(line => line.replace(/^\d+\.\s+/, '').trim()) // Remove the numbering
    .filter(address => address.length > 0);
}

/**
 * Generate multiple bios for given personas in a single API call
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {Array<{fullName: string, gender: string}>} personas - Array of persona objects with fullName and gender
 * @returns {Promise<string[]>} Array of generated bios
 */
export async function generateMultipleBios(provider, apiKey, personas) {
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 10000);
  
  const personasList = personas.map((persona, i) => {
    const pronouns = persona.gender.toLowerCase() === 'male' ? 'he/him' : persona.gender.toLowerCase() === 'female' ? 'she/her' : 'they/them';
    return `${i+1}. ${persona.fullName} (${persona.gender.toLowerCase()}, use ${pronouns} pronouns)`;
  }).join('\n');
  
  const prompt = `Generate a unique, realistic professional bio for each of the following ${personas.length} people. Each bio should be 1-2 sentences describing a real-world profession, practical skills, and believable interests. IMPORTANT: Use the correct pronouns for each person consistently throughout their bio. Make each bio different and unique - ensure maximum variety in professions and interests. Avoid exaggerated claims or unrealistic achievements. Make them sound like real people you might meet. Use this random seed for variety: ${randomSeed}.\n\nPeople:\n${personasList}\n\nRespond with ONLY a numbered list of bios, one per line, like this:\n1. [Bio for person 1]\n2. [Bio for person 2]\netc. Do not include any introductory text.`;

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: personas.length * 50 // Estimate 50 tokens per bio
  });

  const responseText = extractTextFromResponse(response, provider);
  
  // Parse the numbered list response
  return responseText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.match(/^\d+\.\s+/)) // Only lines that start with a number and period
    .map(line => line.replace(/^\d+\.\s+/, '').trim()) // Remove the numbering
    .filter(bio => bio.length > 0);
}

/**
 * Generate a physical description for a persona
 * @param {string} provider - AI provider to use
 * @param {string} apiKey - API key for the provider
 * @param {Object} context - Context object with fullName and gender
 * @returns {Promise<string>} Generated physical description
 */
export async function generatePhysicalDescription(provider, apiKey, context = {}) {
  const { fullName = '', gender = 'Male' } = context;
  
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 100000) + Date.now() % 10000;
  
  let prompt = `Generate a detailed physical description for a ${gender.toLowerCase()} persona`;
  
  if (fullName) {
    prompt += ` named ${fullName}`;
  }
  
  prompt += '. Include details about height, build, hair color and style, eye color, skin tone, and any distinctive features. IMPORTANT: Vary the body types - use diverse builds like slim, average, curvy, stocky, tall and lean, petite, broad-shouldered, or medium build instead of always using "athletic". Keep it realistic and appropriate for a professional context. The description should be 2-3 sentences and suitable for generating a portrait image. Use this random seed for variety: ' + randomSeed + '. Respond with ONLY the physical description text - no introductory phrases like "Here is a description" or similar.';
  
  console.log('Generating physical description with prompt:', prompt);
  
  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: 150
  });

  return extractTextFromResponse(response, provider).trim();
}

/**
 * Generate multiple physical descriptions in a single API call
 * @param {string} provider - The AI provider to use
 * @param {string} apiKey - The API key for the provider
 * @param {Array<{fullName: string, gender: string}>} personas - Array of persona objects with fullName and gender
 * @returns {Promise<string[]>} Array of generated physical descriptions
 */
export async function generateMultiplePhysicalDescriptions(provider, apiKey, personas) {
  // Add a random seed to ensure we get different results each time
  const randomSeed = Math.floor(Math.random() * 100000) + Date.now() % 10000;
  
  const count = personas.length;
  let prompt = `Generate ${count} UNIQUE detailed physical descriptions for the following personas. Each description should be 2-3 sentences and include details about height, build, hair color and style, eye color, skin tone, and any distinctive features. IMPORTANT: Ensure maximum variety in body types and builds - use diverse descriptions like slim, average, curvy, stocky, tall and lean, petite, broad-shouldered, medium build, etc. DO NOT default to "athletic build" for everyone. Keep them realistic and appropriate for a professional context, suitable for generating portrait images.\n\n`;
  
  personas.forEach((persona, index) => {
    const { fullName, gender } = persona;
    prompt += `${index + 1}. ${gender.toLowerCase()} persona named ${fullName}\n`;
  });
  
  prompt += `\nUse this random seed for variety: ${randomSeed}.\n\nRespond with ONLY a numbered list of physical descriptions, one per line, like this:\n1. [Physical description for person 1]\n2. [Physical description for person 2]\netc. Do not include any introductory text or phrases like "Here are the descriptions".`;

  console.log('Generating multiple physical descriptions with prompt:', prompt);

  const response = await makeApiRequest({
    provider,
    apiKey,
    prompt,
    temperature: 1.0, // Use maximum temperature for more variety
    maxTokens: 200 * count // Allow more tokens for multiple descriptions
  });

  const responseText = extractTextFromResponse(response, provider);
  
  // Parse the numbered list response
  const descriptions = [];
  const lines = responseText.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/^\d+\.\s*(.+)$/);
    if (match) {
      descriptions.push(match[1].trim());
    }
  }
  
  // If we didn't get enough descriptions, fill in with placeholders
  while (descriptions.length < count) {
    const missingIndex = descriptions.length;
    const persona = personas[missingIndex];
    descriptions.push(`A ${persona.gender.toLowerCase()} with a professional appearance and friendly demeanor.`);
  }
  
  console.log(`Generated ${descriptions.length} physical descriptions`);
  return descriptions.slice(0, count); // Return exactly the requested count
}
