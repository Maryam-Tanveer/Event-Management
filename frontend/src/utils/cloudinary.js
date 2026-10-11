// ─── Cloudinary Image Optimization Utilities ──────────────────────────────────
// Cloudinary URLs mein transformation parameters add karo automatically.
// Isse images:
//   - WebP format mein serve hongi (smaller file size)
//   - Auto-quality optimize hongi (visual quality maintain, size reduce)
//   - Correct dimensions pe resize hongi
//
// Usage:
//   import { optimizeImage, getThumb, getCard } from "../utils/cloudinary";
//   <img src={optimizeImage(event.previewImage, 800)} />

/**
 * Cloudinary URL mein transformation parameters inject karo
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Target width (px)
 * @param {number|null} height - Target height (null = auto)
 * @param {string} crop - Crop mode (fill, fit, scale, etc.)
 * @returns {string} - Optimized URL
 */
export const optimizeImage = (url, width = 800, height = null, crop = "fill") => {
  if (!url || !url.includes("cloudinary.com")) return url || "";

  const heightPart = height ? `,h_${height}` : "";
  const transformation = `w_${width}${heightPart},c_${crop},q_auto,f_auto,dpr_auto`;

  // /upload/ ke baad transformation parameters inject karo
  return url.replace("/upload/", `/upload/${transformation}/`);
};

/**
 * Thumbnail ke liye — Cards, listings (400x250)
 */
export const getCardImage = (url) => optimizeImage(url, 400, 250, "fill");

/**
 * Hero/Banner ke liye — Full event page top (1200x500)
 */
export const getHeroImage = (url) => optimizeImage(url, 1200, 500, "fill");

/**
 * Gallery ke liye — Medium size (600x400)
 */
export const getGalleryImage = (url) => optimizeImage(url, 600, 400, "fill");

/**
 * Thumbnail/Avatar ke liye — Small square (100x100)
 */
export const getAvatarImage = (url) => optimizeImage(url, 100, 100, "fill");

/**
 * Blur placeholder ke liye — Very small (20px wide, blurry)
 * CSS blur effect se smooth loading hoti hai
 */
export const getBlurPlaceholder = (url) => optimizeImage(url, 20, null, "scale");
