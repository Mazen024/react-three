import apiClient, { handleApiResponse } from "./apiClient";

/**
 * @param {Object} data
 * @param {string} data.firstname
 * @param {string} data.lastname
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.birthDate
 * @param {string} data.gender
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const register = async (data) => {
  return handleApiResponse(apiClient.post("/auth/register", data));
};

/**
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<{data, success, error, statusCode}>}
 * @description Returns { token, refreshToken, roles, email, fullName } on success
 */
export const authenticate = async (data) => {
  return handleApiResponse(apiClient.post("/auth/authenticate", data));
};

/**
 * @param {string} token
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const activateAccount = async (token) => {
  return handleApiResponse(
    apiClient.get(`/auth/activate-account?token=${encodeURIComponent(token)}`)
  );
};

/**
 * @param {Object} data
 * @param {string} data.refreshToken
 * @returns {Promise<{data, success, error, statusCode}>}
 * @description Returns { token, refreshToken, roles, email, fullName } on success
 */
export const refreshToken = async (data) => {
  return handleApiResponse(apiClient.post("/auth/refresh-token", data));
};

/**
 * @param {Object} data
 * @param {string} data.email
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const forgotPassword = async (data) => {
  return handleApiResponse(apiClient.post("/auth/forgot-password", data));
};

/**
 * @param {string} token
 * @param {Object} data
 * @param {string} data.password
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const resetPassword = async (token, data) => {
  return handleApiResponse(
    apiClient.post(
      `/auth/reset-password?token=${encodeURIComponent(token)}`,
      data
    )
  );
};

/**
 * @param {Object} data
 * @param {string} data.refreshToken
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const logout = async (data) => {
  return handleApiResponse(apiClient.post("/auth/logout", data));
};

/**
 * @returns {Promise<{data, success, error, statusCode}>}
 * @description Returns user profile with firstName, lastName, email, gender, age, birthDate, photoUrl
 */
export const getUserProfile = async () => {
  return handleApiResponse(apiClient.get("/user/profile"));
};

/**
 * @param {Object} data
 * @param {string} data.firstname
 * @param {string} data.lastname
 * @param {string} data.gender
 * @param {string} data.birthDate
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const updateProfile = async (data) => {
  return handleApiResponse(apiClient.put("/user/profile", data));
};

/**
 * @param {File} file
 * @returns {Promise<{data, success, error, statusCode}>}
 * @description The API accepts multipart/form-data with a 'file' field
 */
export const uploadUserPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return handleApiResponse(
    apiClient.put("/user/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

/**
 * @param {Object} data
 * @param {string} data.currentPassword
 * @param {string} data.newPassword
 * @returns {Promise<{data, success, error, statusCode}>}
 */
export const changePassword = async (data) => {
  return handleApiResponse(apiClient.patch("/user/password", data));
};
