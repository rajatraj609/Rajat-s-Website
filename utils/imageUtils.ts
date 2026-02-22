/**
 * Converts a standard Google Drive share link or Google Photos link to a direct image URL.
 * @param url The original URL from Google Drive or Google Photos
 * @returns A direct link that can be used in an <img> tag
 */
export const getDirectImageUrl = (url: string): string => {
  if (!url) return '';

  // Google Drive conversion
  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Format 2: https://drive.google.com/open?id=FILE_ID
  const driveMatch = url.match(/\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Google Photos conversion (Note: This is harder as Google Photos links are usually short URLs)
  // We can't easily convert photos.app.goo.gl links client-side without a proxy or fetching,
  // but we can warn the user or handle common patterns if they exist.
  // For now, we focus on Google Drive as requested.

  return url;
};
