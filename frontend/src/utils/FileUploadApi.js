import axios from "axios";

/**
 * Uploads any file to ImageKit and returns the public URL.
 * @param {File} file - The file object from the input field.
 * @returns {Promise<string>} - The URL of the uploaded file.
 */
async function handleFileUpload(file) {
  if (!file) return null;

  try {
    // 1. Get Authentication Parameters from backend
    const authResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-ik-signature`, {
        withCredentials: true
    });
    
    const { signature, expire, token } = authResponse.data;

    // 2. Prepare FormData for ImageKit upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", signature);
    formData.append("expire", expire);
    formData.append("token", token);
    formData.append("useUniqueFileName", "true");

    // 3. Upload to ImageKit
    const uploadResponse = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (uploadResponse.status === 200) {
      return uploadResponse.data.url;
    } else {
      throw new Error("File upload failed");
    }
  } catch (error) {
    console.error("File Upload Error:", error.response?.data || error.message);
    throw error;
  }
}

export default handleFileUpload;
