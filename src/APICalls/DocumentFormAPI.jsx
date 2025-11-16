import api from '../services/apiInterceptor';
import { toast } from 'react-toastify';

/**
 * Helper function to normalize dropdown data from various API response formats.
 * @param {object} response - The API response object.
 * @returns {Array} - A normalized array of dropdown options.
 */
const normalizeDropdownData = (response) => {
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data?.dropdown && Array.isArray(response.data.dropdown)) {
    return response.data.dropdown;
  }
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  console.warn("Unexpected API format for dropdown:", response.data);
  return [];
};

/**
 * Fetches document type options for dropdowns.
 */
export const getDocumentTypes = async () => {
  try {
    const response = await api.get('DocumentType/GetDropdown');
    return normalizeDropdownData(response);
  } catch (error) {
    console.error("❌ Failed to load document types", error);
    toast.error("❌ Failed to load document types");
    return [];
  }
};

/**
 * Fetches user options for dropdowns.
 */
export const getUsers = async () => {
  try {
    const response = await api.get('User/GetDropdown');
    return normalizeDropdownData(response);
  } catch (error) {
    console.error("❌ Failed to load users", error);
    toast.error("❌ Failed to load users");
    return [];
  }
};

/**
 * Fetches priority options for dropdowns.
 */
export const getPriorities = async () => {
  try {
    const response = await api.get('Priority/GetDropdown');
    // This API has a specific structure
    if (response.data?.dropdown && Array.isArray(response.data.dropdown)) {
      return response.data.dropdown;
    }
    return [];
  } catch (error) {
    console.error("❌ Failed to load priorities", error);
    toast.error("❌ Failed to load priorities");
    return [];
  }
};

/**
 * Saves (Inserts/Updates) a document.
 * @param {FormData} formDataToSend - The FormData object to be sent to the API.
 */
export const saveDocument = async (formDataToSend) => {
  try {
    const response = await api.post("document/Insert", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.error("❌ Document save error:", error);
    const serverMsg = error.response?.data?.message || error.response?.data?.Message;
    toast.error(serverMsg ? "❌ " + serverMsg : "🚨 Internal Server Error. Please try again.");
    throw error; // Re-throw the error to be caught by the calling function
  }
};