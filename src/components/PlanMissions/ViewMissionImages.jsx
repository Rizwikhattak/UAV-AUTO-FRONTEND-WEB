"use client";
import { getMissionImages } from "@/store/Actions/mssionImagesAction";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Grid3X3, Camera, Tag } from "lucide-react";
import { SET_IMAGE_URL } from "@/Utils/Helpers";

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

  useEffect(() => {
    dispatch(getMissionImages({ missionVideoId: id, label: label }));
  }, [dispatch, id, label]);

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

  // Get image URL (you might need to adjust this based on your backend setup)
  const getImageUrl = (imagePath) => {
    // Remove the leading "./" and convert backslashes to forward slashes
    const cleanPath = imagePath.replace(/^\.\//, "").replace(/\\/g, "/");
    return `/api/images/${cleanPath}` || imagePath; // Adjust this URL based on your backend
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
            {missionImages.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Images grid */}
      {!isLoading && missionImages && missionImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missionImages.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={SET_IMAGE_URL(image.image_path)}
                  alt={`Solar panel ${formatLabel(image.label)}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg"; // Fallback image
                    e.target.className =
                      "w-full h-full object-cover opacity-50";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-black/70 text-white">
                    ID: {image.id}
                  </Badge>
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
    </div>
  );
};

export default ViewMissionImagesPage;
