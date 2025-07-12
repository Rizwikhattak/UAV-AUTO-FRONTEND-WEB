// Updated component with enhanced download functionality

"use client";
import { getMissionImages } from "@/store/Actions/mssionImagesAction";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Grid3X3,
  Camera,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { SET_IMAGE_URL } from "@/utils/Helpers";

const ViewMissionImagesPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const dispatch = useDispatch();
  const {
    data: missionImages,
    isLoading,
    error,
  } = useSelector((state) => state.missionImages);

  // Modal state
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    dispatch(getMissionImages({ missionVideoId: id, label: label }));
  }, [dispatch, id, label]);

  // Enhanced download functionality
  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.textContent = message;

    const colors = {
      success: "#10B981",
      error: "#EF4444",
      info: "#3B82F6",
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  };

  const handleDownloadWithFetch = async (imagePath, imageId) => {
    try {
      setDownloadingId(imageId);

      const imageUrl = SET_IMAGE_URL(imagePath);
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get file extension from the original path or default to jpg
      const extension = imagePath.split(".").pop() || "jpg";
      link.download = `mission_image_${imageId}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      showNotification("Image downloaded successfully!", "success");
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadWithCanvas = async (imagePath, imageId) => {
    return new Promise((resolve, reject) => {
      const imageUrl = SET_IMAGE_URL(imagePath);
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `mission_image_${imageId}.jpg`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);
                showNotification("Image downloaded successfully!", "success");
                resolve();
              } else {
                reject(new Error("Failed to create blob"));
              }
            },
            "image/jpeg",
            0.95
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = imageUrl;
    });
  };

  const handleSimpleDownload = (imagePath, imageId) => {
    const imageUrl = SET_IMAGE_URL(imagePath);
    const link = document.createElement("a");

    link.href = imageUrl;
    link.download = `mission_image_${imageId}.jpg`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Download started...", "info");
  };

  // Main download handler with progressive fallback
  const handleDownload = async (imagePath, imageId) => {
    if (downloadingId) return; // Prevent multiple downloads

    try {
      await handleDownloadWithFetch(imagePath, imageId);
    } catch (error) {
      console.log("Fetch download failed, trying canvas method...");
      try {
        await handleDownloadWithCanvas(imagePath, imageId);
      } catch (canvasError) {
        console.log("Canvas download failed, falling back to simple method...");
        handleSimpleDownload(imagePath, imageId);
      }
    }
  };

  // Handle modal open
  const openModal = (index) => {
    setSelectedImageIndex(index);
    setZoomLevel(0.3);
    document.body.style.overflow = "hidden";
  };

  // Handle modal close
  const closeModal = () => {
    setSelectedImageIndex(null);
    setZoomLevel(1);
    document.body.style.overflow = "unset";
  };

  // Handle navigation
  const navigateImage = (direction) => {
    if (!missionImages || missionImages.length === 0) return;

    const newIndex =
      direction === "next"
        ? (selectedImageIndex + 1) % missionImages.length
        : (selectedImageIndex - 1 + missionImages.length) %
          missionImages.length;

    setSelectedImageIndex(newIndex);
    setZoomLevel(1);
  };

  // Handle zoom
  const handleZoom = (type) => {
    if (type === "in") {
      setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    } else {
      setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedImageIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          navigateImage("prev");
          break;
        case "ArrowRight":
          navigateImage("next");
          break;
        case "+":
        case "=":
          handleZoom("in");
          break;
        case "-":
          handleZoom("out");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImageIndex, missionImages]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error Loading Images
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Format label for display
  const formatLabel = (label) => {
    return (
      label?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Unknown"
    );
  };

  // Full Screen Modal Component
  const ImageModal = () => {
    if (selectedImageIndex === null || !missionImages) return null;

    const currentImage = missionImages[selectedImageIndex];
    const isFirstImage = selectedImageIndex === 0;
    const isLastImage = selectedImageIndex === missionImages.length - 1;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        onClick={closeModal}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
          {selectedImageIndex + 1} / {missionImages.length}
        </div>

        {/* Zoom controls */}
        {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoom("out");
            }}
            className="text-white hover:text-gray-300 bg-black bg-opacity-50 p-2 rounded-full"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="text-white bg-black bg-opacity-50 px-3 py-2 rounded-full">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoom("in");
            }}
            className="text-white hover:text-gray-300 bg-black bg-opacity-50 p-2 rounded-full"
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div> */}

        {/* Navigation arrows */}
        {!isFirstImage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 p-3 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {!isLastImage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 p-3 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Download button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(currentImage.image_path, currentImage.id);
          }}
          className={`absolute bottom-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 p-3 rounded-full transition-colors ${
            downloadingId === currentImage.id
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={downloadingId === currentImage.id}
        >
          {downloadingId === currentImage.id ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <Download className="h-5 w-5" />
          )}
        </button>

        {/* Image container */}
        <div
          className="relative max-w-full max-h-full overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={SET_IMAGE_URL(currentImage.image_path)}
            alt={`Solar panel ${formatLabel(currentImage.label)}`}
            className="max-w-none h-auto transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>

        {/* Image info */}
        <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Grid3X3 className="h-4 w-4" />
            <span className="font-semibold">
              {formatLabel(currentImage.label)}
            </span>
          </div>
          <div className="text-sm opacity-90">
            Row: {currentImage.solar_row}, Column: {currentImage.solar_column}
          </div>
          <div className="text-sm opacity-90">ID: {currentImage.id}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Mission Images</h1>
        </div>
        {label && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <Badge variant="secondary" className="text-sm">
              {formatLabel(label)}
            </Badge>
          </div>
        )}
        {missionImages && (
          <p className="text-gray-600 mt-2">
            Showing {missionImages.length} image
            {missionImages.length !== 1 ? "s" : ""} • Click any image to view
            full size
          </p>
        )}
      </div>

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Images grid */}
      {!isLoading && missionImages && missionImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missionImages.map((image, index) => (
            <Card
              key={image.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div
                className="relative h-48 bg-gray-100 cursor-pointer group"
                onClick={() => openModal(index)}
              >
                <img
                  src={SET_IMAGE_URL(image.image_path)}
                  alt={`Solar panel ${formatLabel(image.label)}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.className =
                      "w-full h-full object-cover opacity-50";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-black/70 text-white">
                    ID: {image.id}
                  </Badge>
                </div>

                {/* Download button on card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.image_path, image.id);
                  }}
                  className={`absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 ${
                    downloadingId === image.id ? "opacity-100" : ""
                  }`}
                  disabled={downloadingId === image.id}
                >
                  {downloadingId === image.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 p-2 rounded-full">
                      <Camera className="h-6 w-6 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card content */}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-blue-600" />
                  {formatLabel(image.label)}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Panel coordinates */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-gray-700">
                        Panel Position
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded-md">
                      <div className="text-xs text-blue-600 font-medium">
                        Row
                      </div>
                      <div className="text-lg font-bold text-blue-800">
                        {image.solar_row}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-md">
                      <div className="text-xs text-green-600 font-medium">
                        Column
                      </div>
                      <div className="text-lg font-bold text-green-800">
                        {image.solar_column}
                      </div>
                    </div>
                  </div>

                  {/* Mission info */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Mission Video ID:{" "}
                      <span className="font-medium">
                        {image.mission_video_id}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && missionImages && missionImages.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Images Found
          </h3>
          <p className="text-gray-600">
            No mission images were found for the selected criteria.
          </p>
        </div>
      )}

      {/* Full Screen Modal */}
      <ImageModal />
    </div>
  );
};

export default ViewMissionImagesPage;

// "use client";
// import { getMissionImages } from "@/store/Actions/mssionImagesAction";
// import { useParams, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   MapPin,
//   Grid3X3,
//   Camera,
//   Tag,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Download,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";
// import { SET_IMAGE_URL } from "@/Utils/Helpers";

// const ViewMissionImagesPage = () => {
//   const { id } = useParams();
//   const searchParams = useSearchParams();
//   const label = searchParams.get("label");
//   const dispatch = useDispatch();
//   const {
//     data: missionImages,
//     isLoading,
//     error,
//   } = useSelector((state) => state.missionImages);

//   // Modal state
//   const [selectedImageIndex, setSelectedImageIndex] = useState(null);
//   const [zoomLevel, setZoomLevel] = useState(1);

//   useEffect(() => {
//     dispatch(getMissionImages({ missionVideoId: id, label: label }));
//   }, [dispatch, id, label]);

//   // Handle modal open
//   const openModal = (index) => {
//     setSelectedImageIndex(index);
//     setZoomLevel(1);
//     document.body.style.overflow = "hidden"; // Prevent background scroll
//   };

//   // Handle modal close
//   const closeModal = () => {
//     setSelectedImageIndex(null);
//     setZoomLevel(1);
//     document.body.style.overflow = "unset"; // Restore background scroll
//   };

//   // Handle navigation
//   const navigateImage = (direction) => {
//     if (!missionImages || missionImages.length === 0) return;

//     const newIndex =
//       direction === "next"
//         ? (selectedImageIndex + 1) % missionImages.length
//         : (selectedImageIndex - 1 + missionImages.length) %
//           missionImages.length;

//     setSelectedImageIndex(newIndex);
//     setZoomLevel(1);
//   };

//   // Handle zoom
//   const handleZoom = (type) => {
//     if (type === "in") {
//       setZoomLevel((prev) => Math.min(prev + 0.5, 3));
//     } else {
//       setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
//     }
//   };

//   // Handle download
//   const handleDownload = (imagePath, imageId) => {
//     const link = document.createElement("a");
//     link.href = SET_IMAGE_URL(imagePath);
//     link.download = `mission_image_${imageId}.jpg`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Handle keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (selectedImageIndex === null) return;

//       switch (e.key) {
//         case "Escape":
//           closeModal();
//           break;
//         case "ArrowLeft":
//           navigateImage("prev");
//           break;
//         case "ArrowRight":
//           navigateImage("next");
//           break;
//         case "+":
//         case "=":
//           handleZoom("in");
//           break;
//         case "-":
//           handleZoom("out");
//           break;
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [selectedImageIndex, missionImages]);

//   // Loading skeleton
//   const LoadingSkeleton = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {[...Array(6)].map((_, index) => (
//         <Card key={index} className="overflow-hidden">
//           <Skeleton className="h-48 w-full" />
//           <CardHeader className="pb-2">
//             <Skeleton className="h-4 w-3/4" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <Skeleton className="h-3 w-1/2" />
//               <Skeleton className="h-3 w-2/3" />
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );

//   // Error state
//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <div className="text-red-500 text-lg font-semibold mb-2">
//             Error Loading Images
//           </div>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // Format label for display
//   const formatLabel = (label) => {
//     return (
//       label?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
//       "Unknown"
//     );
//   };

//   // Full Screen Modal Component
//   const ImageModal = () => {
//     if (selectedImageIndex === null || !missionImages) return null;

//     const currentImage = missionImages[selectedImageIndex];
//     const isFirstImage = selectedImageIndex === 0;
//     const isLastImage = selectedImageIndex === missionImages.length - 1;

//     return (
//       <div
//         className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
//         onClick={closeModal}
//       >
//         {/* Close button */}
//         <button
//           onClick={closeModal}
//           className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
//         >
//           <X className="h-8 w-8" />
//         </button>

//         {/* Image counter */}
//         <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
//           {selectedImageIndex + 1} / {missionImages.length}
//         </div>

//         {/* Zoom controls */}
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleZoom("out");
//             }}
//             className="text-white hover:text-gray-300 bg-black bg-opacity-50 p-2 rounded-full"
//             disabled={zoomLevel <= 0.5}
//           >
//             <ZoomOut className="h-5 w-5" />
//           </button>
//           <span className="text-white bg-black bg-opacity-50 px-3 py-2 rounded-full">
//             {Math.round(zoomLevel * 100)}%
//           </span>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleZoom("in");
//             }}
//             className="text-white hover:text-gray-300 bg-black bg-opacity-50 p-2 rounded-full"
//             disabled={zoomLevel >= 3}
//           >
//             <ZoomIn className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Navigation arrows */}
//         {!isFirstImage && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               navigateImage("prev");
//             }}
//             className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 p-3 rounded-full transition-colors"
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </button>
//         )}

//         {!isLastImage && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               navigateImage("next");
//             }}
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 p-3 rounded-full transition-colors"
//           >
//             <ChevronRight className="h-6 w-6" />
//           </button>
//         )}

//         {/* Download button */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDownload(currentImage.image_path, currentImage.id);
//           }}
//           className="absolute bottom-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 p-3 rounded-full transition-colors"
//         >
//           <Download className="h-5 w-5" />
//         </button>

//         {/* Image container */}
//         <div
//           className="relative max-w-full max-h-full overflow-auto"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={SET_IMAGE_URL(currentImage.image_path)}
//             alt={`Solar panel ${formatLabel(currentImage.label)}`}
//             className="max-w-none h-auto transition-transform duration-200"
//             style={{
//               transform: `scale(${zoomLevel})`,
//               transformOrigin: "center center",
//             }}
//             onError={(e) => {
//               e.target.src = "/placeholder-image.jpg";
//             }}
//           />
//         </div>

//         {/* Image info */}
//         <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-3 rounded-lg">
//           <div className="flex items-center gap-2 mb-1">
//             <Grid3X3 className="h-4 w-4" />
//             <span className="font-semibold">
//               {formatLabel(currentImage.label)}
//             </span>
//           </div>
//           <div className="text-sm opacity-90">
//             Row: {currentImage.solar_row}, Column: {currentImage.solar_column}
//           </div>
//           <div className="text-sm opacity-90">ID: {currentImage.id}</div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-2 mb-2">
//           <Camera className="h-6 w-6 text-blue-600" />
//           <h1 className="text-3xl font-bold text-gray-900">Mission Images</h1>
//         </div>
//         {label && (
//           <div className="flex items-center gap-2">
//             <Tag className="h-4 w-4 text-gray-500" />
//             <Badge variant="secondary" className="text-sm">
//               {formatLabel(label)}
//             </Badge>
//           </div>
//         )}
//         {missionImages && (
//           <p className="text-gray-600 mt-2">
//             Showing {missionImages.length} image
//             {missionImages.length !== 1 ? "s" : ""} • Click any image to view
//             full size
//           </p>
//         )}
//       </div>

//       {/* Loading state */}
//       {isLoading && <LoadingSkeleton />}

//       {/* Images grid */}
//       {!isLoading && missionImages && missionImages.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {missionImages.map((image, index) => (
//             <Card
//               key={image.id}
//               className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
//             >
//               {/* Image */}
//               <div
//                 className="relative h-48 bg-gray-100 cursor-pointer group"
//                 onClick={() => openModal(index)}
//               >
//                 <img
//                   src={SET_IMAGE_URL(image.image_path)}
//                   alt={`Solar panel ${formatLabel(image.label)}`}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                   onError={(e) => {
//                     e.target.src = "/placeholder-image.jpg";
//                     e.target.className =
//                       "w-full h-full object-cover opacity-50";
//                   }}
//                 />
//                 <div className="absolute top-2 right-2">
//                   <Badge variant="default" className="bg-black/70 text-white">
//                     ID: {image.id}
//                   </Badge>
//                 </div>
//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="bg-white bg-opacity-90 p-2 rounded-full">
//                       <Camera className="h-6 w-6 text-gray-800" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Card content */}
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Grid3X3 className="h-4 w-4 text-blue-600" />
//                   {formatLabel(image.label)}
//                 </CardTitle>
//               </CardHeader>

//               <CardContent>
//                 <div className="space-y-3">
//                   {/* Panel coordinates */}
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <MapPin className="h-4 w-4 text-green-600" />
//                       <span className="font-semibold text-gray-700">
//                         Panel Position
//                       </span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="text-center p-2 bg-blue-50 rounded-md">
//                       <div className="text-xs text-blue-600 font-medium">
//                         Row
//                       </div>
//                       <div className="text-lg font-bold text-blue-800">
//                         {image.solar_row}
//                       </div>
//                     </div>
//                     <div className="text-center p-2 bg-green-50 rounded-md">
//                       <div className="text-xs text-green-600 font-medium">
//                         Column
//                       </div>
//                       <div className="text-lg font-bold text-green-800">
//                         {image.solar_column}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mission info */}
//                   <div className="pt-2 border-t border-gray-200">
//                     <div className="text-xs text-gray-500">
//                       Mission Video ID:{" "}
//                       <span className="font-medium">
//                         {image.mission_video_id}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && missionImages && missionImages.length === 0 && (
//         <div className="text-center py-12">
//           <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             No Images Found
//           </h3>
//           <p className="text-gray-600">
//             No mission images were found for the selected criteria.
//           </p>
//         </div>
//       )}

//       {/* Full Screen Modal */}
//       <ImageModal />
//     </div>
//   );
// };

// export default ViewMissionImagesPage;

// "use client";
// import { getMissionImages } from "@/store/Actions/mssionImagesAction";
// import { useParams, useSearchParams } from "next/navigation";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { MapPin, Grid3X3, Camera, Tag } from "lucide-react";
// import { SET_IMAGE_URL } from "@/Utils/Helpers";

// const ViewMissionImagesPage = () => {
//   const { id } = useParams();
//   const searchParams = useSearchParams();
//   const label = searchParams.get("label");
//   const dispatch = useDispatch();
//   const {
//     data: missionImages,
//     isLoading,
//     error,
//   } = useSelector((state) => state.missionImages);

//   useEffect(() => {
//     dispatch(getMissionImages({ missionVideoId: id, label: label }));
//   }, [dispatch, id, label]);

//   // Loading skeleton
//   const LoadingSkeleton = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {[...Array(6)].map((_, index) => (
//         <Card key={index} className="overflow-hidden">
//           <Skeleton className="h-48 w-full" />
//           <CardHeader className="pb-2">
//             <Skeleton className="h-4 w-3/4" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <Skeleton className="h-3 w-1/2" />
//               <Skeleton className="h-3 w-2/3" />
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );

//   // Error state
//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <div className="text-red-500 text-lg font-semibold mb-2">
//             Error Loading Images
//           </div>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // Format label for display
//   const formatLabel = (label) => {
//     return (
//       label?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
//       "Unknown"
//     );
//   };

//   // Get image URL (you might need to adjust this based on your backend setup)
//   const getImageUrl = (imagePath) => {
//     // Remove the leading "./" and convert backslashes to forward slashes
//     const cleanPath = imagePath.replace(/^\.\//, "").replace(/\\/g, "/");
//     return `/api/images/${cleanPath}` || imagePath; // Adjust this URL based on your backend
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-2 mb-2">
//           <Camera className="h-6 w-6 text-blue-600" />
//           <h1 className="text-3xl font-bold text-gray-900">Mission Images</h1>
//         </div>
//         {label && (
//           <div className="flex items-center gap-2">
//             <Tag className="h-4 w-4 text-gray-500" />
//             <Badge variant="secondary" className="text-sm">
//               {formatLabel(label)}
//             </Badge>
//           </div>
//         )}
//         {missionImages && (
//           <p className="text-gray-600 mt-2">
//             Showing {missionImages.length} image
//             {missionImages.length !== 1 ? "s" : ""}
//           </p>
//         )}
//       </div>

//       {/* Loading state */}
//       {isLoading && <LoadingSkeleton />}

//       {/* Images grid */}
//       {!isLoading && missionImages && missionImages.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {missionImages.map((image) => (
//             <Card
//               key={image.id}
//               className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
//             >
//               {/* Image */}
//               <div className="relative h-48 bg-gray-100">
//                 <img
//                   src={SET_IMAGE_URL(image.image_path)}
//                   alt={`Solar panel ${formatLabel(image.label)}`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "/placeholder-image.jpg"; // Fallback image
//                     e.target.className =
//                       "w-full h-full object-cover opacity-50";
//                   }}
//                 />
//                 <div className="absolute top-2 right-2">
//                   <Badge variant="default" className="bg-black/70 text-white">
//                     ID: {image.id}
//                   </Badge>
//                 </div>
//               </div>

//               {/* Card content */}
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Grid3X3 className="h-4 w-4 text-blue-600" />
//                   {formatLabel(image.label)}
//                 </CardTitle>
//               </CardHeader>

//               <CardContent>
//                 <div className="space-y-3">
//                   {/* Panel coordinates */}
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <MapPin className="h-4 w-4 text-green-600" />
//                       <span className="font-semibold text-gray-700">
//                         Panel Position
//                       </span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="text-center p-2 bg-blue-50 rounded-md">
//                       <div className="text-xs text-blue-600 font-medium">
//                         Row
//                       </div>
//                       <div className="text-lg font-bold text-blue-800">
//                         {image.solar_row}
//                       </div>
//                     </div>
//                     <div className="text-center p-2 bg-green-50 rounded-md">
//                       <div className="text-xs text-green-600 font-medium">
//                         Column
//                       </div>
//                       <div className="text-lg font-bold text-green-800">
//                         {image.solar_column}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mission info */}
//                   <div className="pt-2 border-t border-gray-200">
//                     <div className="text-xs text-gray-500">
//                       Mission Video ID:{" "}
//                       <span className="font-medium">
//                         {image.mission_video_id}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && missionImages && missionImages.length === 0 && (
//         <div className="text-center py-12">
//           <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             No Images Found
//           </h3>
//           <p className="text-gray-600">
//             No mission images were found for the selected criteria.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewMissionImagesPage;
