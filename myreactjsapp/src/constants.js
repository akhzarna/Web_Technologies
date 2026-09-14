export const API_BASE_URL = 'http://159.65.157.115';
export const API_BOOKS_URL = `${API_BASE_URL}/api/books`;

/**
 * Returns a valid full URL for asset paths (covers, pdfs) returned by the API.
 * Encodes special characters (such as Urdu or spaces in filenames) properly.
 */
export function getAssetUrl(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') return '';
  const trimmed = relativePath.trim();
  if (!trimmed) return '';
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Clean leading slash if present
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  
  // Encode each URI segment to safely handle spaces and non-ASCII characters
  const encodedSegments = cleanPath.split('/').map(segment => encodeURIComponent(segment));
  return `${API_BASE_URL}/${encodedSegments.join('/')}`;
}
