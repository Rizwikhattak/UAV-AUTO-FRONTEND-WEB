export const SET_IMAGE_URL = (image_url) => {
  if (!image_url) return "";
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // Remove leading './' or '/' using regex
  const sanitizedURL = image_url.replace(/^\.?\//, "");

  return `${baseURL}${sanitizedURL}`;
};
