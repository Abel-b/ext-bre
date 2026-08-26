/**
 * Helper to ensure static images and assets resolve correctly
 * under GitHub Pages subpath (/ext-bre).
 */
export const getAssetPath = (src: string): string => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  const cleanPath = src.startsWith("/") ? src : `/${src}`;
  
  if (cleanPath.startsWith("/ext-bre/")) {
    return cleanPath;
  }
  
  return `/ext-bre${cleanPath}`;
};
