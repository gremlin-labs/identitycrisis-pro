/**
 * Image storage service for downloading and managing local images
 */

// Check if we're in Electron environment
const isElectron = () => {
  return typeof window !== 'undefined' && window.electron;
};

/**
 * Download an image from a URL and save it locally
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} filename - The filename to save the image as (without extension)
 * @returns {Promise<string>} The local file path of the saved image
 */
export async function downloadAndSaveImage(imageUrl, filename) {
  try {
    if (!isElectron()) {
      // In web environment, just return the original URL
      console.log('Not in Electron environment, returning original URL');
      return imageUrl;
    }
    
    // Use Electron's IPC to save the image
    const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    // Get the image data as array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert to base64 for IPC transfer
    const bytes = new Uint8Array(arrayBuffer);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64 = btoa(binary);
    
    // Send to main process to save
    const localPath = await window.electron.saveImage(base64, safeFilename, imageUrl);
    
    console.log(`Image saved locally: ${localPath}`);
    return localPath;
    
  } catch (error) {
    console.error('Error downloading and saving image:', error);
    // Fallback to original URL if saving fails
    return imageUrl;
  }
}

/**
 * Generate a unique filename for an image based on persona details
 * @param {string} fullName - The persona's full name
 * @param {string} username - The persona's username
 * @returns {string} A unique filename
 */
export function generateImageFilename(fullName, username) {
  const timestamp = Date.now();
  const safeName = (fullName || username || 'persona').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `${safeName}_${timestamp}`;
}

/**
 * Get the file:// URL for a local image path
 * @param {string} localPath - The local file path
 * @returns {string} The file:// URL
 */
export function getLocalImageUrl(localPath) {
  if (localPath.startsWith('http')) {
    // If it's still a web URL, return as-is
    return localPath;
  }
  return `file://${localPath}`;
} 