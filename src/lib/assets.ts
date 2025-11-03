/**
 * Utility functions for handling asset paths in different environments
 */

/**
 * Get the correct asset path considering the base path for GitHub Pages
 * @param path - The asset path (e.g., '/f.png')
 * @returns The full path with base path if needed
 */
export function getAssetPath(path: string): string {
  // In production (GitHub Pages), we need to include the base path
  const basePath = process.env.NODE_ENV === 'production' ? '/praktikoffice' : '';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

/**
 * Get the floor plan image URL
 */
export function getFloorPlanUrl(): string {
  const url = getAssetPath('/f.png');
  console.log('Floor plan URL:', url, 'Environment:', process.env.NODE_ENV);
  return url;
}