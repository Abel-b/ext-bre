export default function imageLoader({ src }: { src: string }): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  const cleanPath = src.startsWith("/") ? src : `/${src}`;
  if (cleanPath.startsWith("/ext-bre/")) {
    return cleanPath;
  }
  return `/ext-bre${cleanPath}`;
}
