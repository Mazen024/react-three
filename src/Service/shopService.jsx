import shopApiClient, { handleApiResponse } from "./apiClient";

/**
 * @param {Object} shopData - Shop data (name, category, location, description, email, phone)
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const createShop = async (shopData) => {
  return handleApiResponse(shopApiClient.post("/shops/create", shopData));
};

/**
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Items per page (default: 10)
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const getAllShops = async (page = 0, size = 10) => {
  return handleApiResponse(
    shopApiClient.get(`/shops?page=${page}&size=${size}`)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const getShopDetails = async (shopId) => {
  return handleApiResponse(shopApiClient.get(`/shops/${shopId}`));
};

/**
 * @param {number} shopId - ID of the shop
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const getShopAssets = async (shopId) => {
  return handleApiResponse(shopApiClient.get(`/shops/${shopId}/assets`));
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} shopData - Updated shop data
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateShopDetails = async (shopId, shopData) => {
  return handleApiResponse(
    shopApiClient.put(`/shops/${shopId}/edit`, shopData)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} coordinates - 3D positioning data
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateShopCoordinates = async (shopId, coordinates) => {
  return handleApiResponse(
    shopApiClient.put(`/shops/${shopId}/coordinates`, coordinates)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} socialData - Social media platform and link
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateShopSocials = async (shopId, socialData) => {
  return handleApiResponse(
    shopApiClient.put(`/shops/${shopId}/socials`, socialData)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @param {Object} assetData - Asset data (gltf, bin, icon, texture)
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const uploadShopAssets = async (shopId, assetData) => {
  return handleApiResponse(
    shopApiClient.put(`/shops/${shopId}/upload-assets`, assetData)
  );
};

/**
 * @param {number} shopId - ID of the shop
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const deleteShop = async (shopId) => {
  return handleApiResponse(shopApiClient.delete(`/shops/${shopId}`));
};
