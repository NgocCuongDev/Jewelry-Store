// src/app/config.js
export const API_URL = "http://localhost:8900/api/";

// Specific base URLs for images per service
export const CATALOG_IMAGE_URL = "http://localhost:8900/api/catalog/images/"; 
export const BANNER_IMAGE_URL = "http://localhost:8900/api/banner/images/";
export const USER_IMAGE_URL = "http://localhost:8900/api/accounts/images/"; // Adjust based on user-service logic
export const POST_IMAGE_URL = "http://localhost:8900/api/post/images/";

// Legacy export if needed for backward compatibility
export const IMAGE_URL = CATALOG_IMAGE_URL; 

