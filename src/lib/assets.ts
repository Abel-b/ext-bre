/**
 * Helper to ensure static images and assets resolve correctly
 * under GitHub Pages subpaths (/ext-bre) in production.
 */
export const getAssetPath = (src: string): string => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/ext-bre" : "";
  const cleanPath = src.startsWith("/") ? src : `/${src}`;
  
  if (cleanPath.startsWith("/ext-bre/")) {
    return cleanPath;
  }
  
  return `${basePath}${cleanPath}`;
};
