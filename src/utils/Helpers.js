"use client";
export const SET_IMAGE_URL = (image_url) => {
  if (!image_url) return "";
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // Remove leading './' or '/' using regex
  const sanitizedURL = image_url.replace(/^\.?\//, "");

  return `${baseURL}${sanitizedURL}`;
};

export const convertToISODateTime = (start_date, start_time) => {
  // Convert from "dd-mm-yyyy" to "yyyy-mm-dd"
  const [dd, mm, yyyy] = start_date.split("-");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  // Remove AM/PM and convert to 24-hour time
  const [time, modifier] = start_time.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const formattedTime = `${String(hours).padStart(
    2,
    "0"
  )}:${minutes}:${seconds}`;

  return new Date(`${formattedDate}T${formattedTime}`);
};

// Enhanced download functionality with better error handling and cross-origin support

// // Method 1: Enhanced download with fetch and blob (recommended)
// const handleDownload = async (imagePath, imageId) => {
//   try {
//     // Show loading state (optional)
//     const loadingToast = document.createElement("div");
//     loadingToast.textContent = "Downloading image...";
//     loadingToast.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       background: #333;
//       color: white;
//       padding: 10px 20px;
//       border-radius: 5px;
//       z-index: 1000;
//     `;
//     document.body.appendChild(loadingToast);

//     // Fetch the image as blob
//     const imageUrl = SET_IMAGE_URL(imagePath);
//     const response = await fetch(imageUrl);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch image: ${response.status}`);
//     }

//     const blob = await response.blob();

//     // Create download link
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;

//     // Get file extension from the original path or default to jpg
//     const extension = imagePath.split(".").pop() || "jpg";
//     link.download = `mission_image_${imageId}.${extension}`;

//     // Trigger download
//     document.body.appendChild(link);
//     link.click();

//     // Cleanup
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(loadingToast);

//     // Success feedback
//     showNotification("Image downloaded successfully!", "success");
//   } catch (error) {
//     console.error("Download failed:", error);
//     showNotification("Download failed. Please try again.", "error");
//   }
// };

// // Method 2: Canvas-based download (for cross-origin images)
// const handleDownloadWithCanvas = async (imagePath, imageId) => {
//   try {
//     const imageUrl = SET_IMAGE_URL(imagePath);

//     // Create image element
//     const img = new Image();
//     img.crossOrigin = "anonymous"; // Enable CORS

//     return new Promise((resolve, reject) => {
//       img.onload = () => {
//         try {
//           // Create canvas
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           // Set canvas size to image size
//           canvas.width = img.naturalWidth;
//           canvas.height = img.naturalHeight;

//           // Draw image on canvas
//           ctx.drawImage(img, 0, 0);

//           // Convert canvas to blob and download
//           canvas.toBlob(
//             (blob) => {
//               if (blob) {
//                 const url = window.URL.createObjectURL(blob);
//                 const link = document.createElement("a");
//                 link.href = url;
//                 link.download = `mission_image_${imageId}.jpg`;

//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);

//                 window.URL.revokeObjectURL(url);
//                 showNotification("Image downloaded successfully!", "success");
//                 resolve();
//               } else {
//                 reject(new Error("Failed to create blob"));
//               }
//             },
//             "image/jpeg",
//             0.95
//           );
//         } catch (error) {
//           reject(error);
//         }
//       };

//       img.onerror = () => {
//         reject(new Error("Failed to load image"));
//       };

//       img.src = imageUrl;
//     });
//   } catch (error) {
//     console.error("Canvas download failed:", error);
//     showNotification("Download failed. Please try again.", "error");
//   }
// };

// // Method 3: Simple link download (fallback)
// const handleSimpleDownload = (imagePath, imageId) => {
//   try {
//     const imageUrl = SET_IMAGE_URL(imagePath);
//     const link = document.createElement("a");

//     // Set attributes
//     link.href = imageUrl;
//     link.download = `mission_image_${imageId}.jpg`;
//     link.target = "_blank";
//     link.rel = "noopener noreferrer";

//     // For better browser support
//     link.style.display = "none";
//     document.body.appendChild(link);

//     // Trigger download
//     link.click();

//     // Cleanup
//     setTimeout(() => {
//       document.body.removeChild(link);
//     }, 100);

//     showNotification("Download started...", "info");
//   } catch (error) {
//     console.error("Simple download failed:", error);
//     showNotification("Download failed. Please try again.", "error");
//   }
// };

// // Utility function for notifications
// const showNotification = (message, type = "info") => {
//   const notification = document.createElement("div");
//   notification.textContent = message;

//   const colors = {
//     success: "#10B981",
//     error: "#EF4444",
//     info: "#3B82F6",
//   };

//   notification.style.cssText = `
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     background: ${colors[type]};
//     color: white;
//     padding: 12px 20px;
//     border-radius: 6px;
//     z-index: 1000;
//     font-size: 14px;
//     font-weight: 500;
//     box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//     animation: slideIn 0.3s ease-out;
//   `;

//   // Add animation keyframes
//   if (!document.getElementById("notification-styles")) {
//     const style = document.createElement("style");
//     style.id = "notification-styles";
//     style.textContent = `
//       @keyframes slideIn {
//         from { transform: translateX(100%); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   document.body.appendChild(notification);

//   // Auto remove after 3 seconds
//   setTimeout(() => {
//     if (notification.parentNode) {
//       notification.parentNode.removeChild(notification);
//     }
//   }, 3000);
// };

// // Progressive download function that tries different methods
// const handleProgressiveDownload = async (imagePath, imageId) => {
//   try {
//     // Try fetch method first
//     await handleDownload(imagePath, imageId);
//   } catch (error) {
//     console.log("Fetch download failed, trying canvas method...");
//     try {
//       await handleDownloadWithCanvas(imagePath, imageId);
//     } catch (canvasError) {
//       console.log("Canvas download failed, falling back to simple method...");
//       handleSimpleDownload(imagePath, imageId);
//     }
//   }
// };
