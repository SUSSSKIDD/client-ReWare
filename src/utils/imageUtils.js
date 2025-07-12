const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get image URL for item images
 * @param {string} itemId - Item ID
 * @param {number} imageIndex - Image index (0-based)
 * @returns {string} Image URL
 */
export const getItemImageUrl = (itemId, imageIndex = 0) => {
  return `${API_BASE_URL}/images/item/${itemId}?index=${imageIndex}`;
};

/**
 * Get avatar URL for user
 * @param {string} userId - User ID
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (userId) => {
  return `${API_BASE_URL}/images/avatar/${userId}`;
};

/**
 * Get image URL from image object (for backward compatibility)
 * @param {Object} image - Image object from API
 * @param {string} itemId - Item ID (for new format)
 * @param {number} imageIndex - Image index (for new format)
 * @returns {string} Image URL
 */
export const getImageUrl = (image, itemId = null, imageIndex = 0) => {
  // If image is null/undefined, return placeholder
  if (!image) {
    return '/placeholder-item.svg';
  }
  
  // If image has url property (old format), use it
  if (image.url) {
    return image.url;
  }
  
  // If image has data property (new base64 format), construct URL
  if (image.data && itemId) {
    return getItemImageUrl(itemId, imageIndex);
  }
  
  // If image exists but no itemId (fallback for new format without ID)
  if (image.data) {
    console.warn('Image has data but no itemId provided, using placeholder');
    return '/placeholder-item.svg';
  }
  
  // Fallback to placeholder
  return '/placeholder-item.svg';
};

/**
 * Get avatar URL from user object
 * @param {Object} user - User object from API
 * @returns {string} Avatar URL
 */
export const getUserAvatarUrl = (user) => {
  // If user has avatar as string (old format), use it
  if (user && typeof user.avatar === 'string') {
    return user.avatar;
  }
  
  // If user has avatar as object with data (new format), construct URL
  if (user && user.avatar && user.avatar.data && user._id) {
    return getAvatarUrl(user._id);
  }
  
  // Return placeholder for no avatar
  return '/placeholder-avatar.svg';
};

/**
 * Check if image is in new base64 format
 * @param {Object} image - Image object
 * @returns {boolean} True if new format
 */
export const isBase64Image = (image) => {
  return image && image.data && image.contentType;
};

/**
 * Check if avatar is in new base64 format
 * @param {Object} user - User object
 * @returns {boolean} True if new format
 */
export const isBase64Avatar = (user) => {
  return user && user.avatar && user.avatar.data && user.avatar.contentType;
}; 