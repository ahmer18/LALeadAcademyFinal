import axios from "axios";

/**
 * Uploads an image file to imgbb and returns the direct display URL.
 * @param {File} imageFile - The file object from the input field.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
async function handleUpload(imageFile) {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      formData
    );

    if (response.data.success) {
      // display_url is the direct link to the image
      return response.data.data.display_url;
    } else {
      throw new Error("imgbb upload failed");
    }
  } catch (error) {
    console.error("Image Upload Error:", error.response?.data || error.message);
    return null;
  }
}

export default handleUpload;