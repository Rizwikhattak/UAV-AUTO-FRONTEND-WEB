"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/common/SpinnerCommon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import VideoPreviewCard from "@/components/common/VideoPreviewCard";
import {
  getAllVideosFromFolder,
  uploadMissionVideo,
} from "@/store/Actions/planMissionActions";
import { ROUTES } from "@/utils/constants";
import {
  initializeVideos,
  setVideos,
  addVideo,
  removeVideo,
  setCurrentVideoIndex,
  updateCurrentVideo,
  updateVideoByIndex,
  setProcessing,
  clearVideos,
  resetMissionVideo,
  setLastLoadedMissionId,
} from "@/store/Reducers/missionVideoSlice";
import { CardSkeleton } from "@/components/common/SkeletonsCommon";

export default function ActiveMissionPlan() {
  const dispatch = useDispatch();
  const params = useParams();
  const missionId = params.id;
  const [isAllLoading, setIsAllLoading] = useState(false);
  const mission = useSelector((state) => state.planMission);
  const {
    videos,
    currentVideoIndex,
    isProcessing,
    isDataLoaded,
    lastLoadedMissionId,
  } = useSelector((state) => state.missionVideo);
  const router = useRouter();

  // Current video data
  const currentVideo = videos[currentVideoIndex] || null;

  // Auto-load video file names from server
  const autoLoadVideoPathsFromServer = async () => {
    try {
      const response = await dispatch(getAllVideosFromFolder()).unwrap();

      if (
        response.success &&
        response.data.success &&
        response.data.videos &&
        response.data.videos.length > 0
      ) {
        const newVideos = response.data.videos.map((fileName) => ({
          id: Date.now() + Math.random(),
          file: null,
          fileName: fileName,
          streamUrl: `http://127.0.0.1:5000/stream_task_video/${encodeURIComponent(
            fileName
          )}`,
          panelCounts: {
            clean: null,
            dusty: null,
            damage: null,
            total: null,
          },
          missionVideoId: null,
          isUploaded: false,
          isUploading: false,
          error: null,
        }));
        setAllVideos(newVideos);
        dispatch(setVideos(newVideos));
        dispatch(setLastLoadedMissionId(missionId));
        console.log(
          `Auto-loaded ${newVideos.length} video files from server directory`
        );
        return newVideos;
      } else {
        console.log("No video files found in the directory");
      }
    } catch (error) {
      console.error("Error auto-loading video files from server:", error);
    }
  };
  const [allVideos, setAllVideos] = useState([]);
  // Initialize videos on component mount - Only if not already loaded
  useEffect(() => {
    // Only load data if:
    // 1. Data is not loaded yet, OR
    // 2. We're loading data for a different mission
    const fetchVideos = async () => {
      if (!isDataLoaded || lastLoadedMissionId !== missionId) {
        dispatch(initializeVideos());
        // setIsAllLoading(true);
        const vid = await autoLoadVideoPathsFromServer();
        await handleUploadAll(vid);
        // setIsAllLoading(false);
      }
    };
    fetchVideos();
  }, [dispatch, missionId, isDataLoaded, lastLoadedMissionId]);

  // Optional: Clear data when mission changes (but not on unmount)
  useEffect(() => {
    return () => {
      // Only clear if we're changing missions, not just navigating away
      // You might want to remove this entirely to keep all data
      if (lastLoadedMissionId && lastLoadedMissionId !== missionId) {
        dispatch(clearVideos());
      }
    };
  }, [missionId, lastLoadedMissionId]);

  // Convert stream URL to File object when needed for upload
  const getFileFromStreamUrl = async (streamUrl, fileName) => {
    try {
      const response = await fetch(streamUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const blob = await response.blob();
      return new File([blob], fileName, { type: "video/mp4" });
    } catch (error) {
      console.error("Error getting file from stream URL:", error);
      throw error;
    }
  };

  // Fallback manual file picker (kept for backup)
  const showManualFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mp4";
    input.multiple = true;
    input.webkitdirectory = false;

    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      const mp4Files = files.filter(
        (file) =>
          file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4")
      );

      if (mp4Files.length > 0) {
        const newVideos = mp4Files.map((file) => ({
          id: Date.now() + Math.random(),
          file,
          fileName: file.name,
          streamUrl: null, // Manually selected files don't have stream URLs
          panelCounts: {
            clean: null,
            dusty: null,
            damage: null,
            total: null,
          },
          missionVideoId: null,
          isUploaded: false,
          isUploading: false,
          error: null,
        }));

        dispatch(setVideos(newVideos));
        console.log(`Loaded ${mp4Files.length} MP4 files manually`);
      }
    };

    input.click();
  };

  // Manual refresh function
  const handleRefreshVideos = () => {
    autoLoadVideoPathsFromServer();
  };

  // Add new video
  const handleAddVideo = () => {
    const newVideo = {
      id: Date.now(),
      file: null,
      fileName: null,
      streamUrl: null,
      panelCounts: {
        clean: null,
        dusty: null,
        damage: null,
        total: null,
      },
      missionVideoId: null,
      isUploaded: false,
      isUploading: false,
      error: null,
    };
    dispatch(addVideo(newVideo));
  };

  // Remove video
  const handleRemoveVideo = (index) => {
    dispatch(removeVideo(index));
  };

  // Handle single video file selection
  const handleVideoSelect = (file) => {
    dispatch(
      updateCurrentVideo({
        file,
        fileName: file.name,
        streamUrl: null,
      })
    );
  };

  // Handle multiple video files selection
  const handleMultipleVideosSelect = (files) => {
    const newVideos = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      fileName: file.name,
      streamUrl: null,
      panelCounts: {
        clean: null,
        dusty: null,
        damage: null,
        total: null,
      },
      missionVideoId: null,
      isUploaded: false,
      isUploading: false,
      error: null,
    }));

    dispatch(setVideos(newVideos));
  };

  // Handle video removal
  const handleRemoveVideoFile = () => {
    dispatch(
      updateCurrentVideo({
        file: null,
        fileName: null,
        streamUrl: null,
      })
    );
  };

  // Upload current video
  const handleUpload = async () => {
    if (!currentVideo || (!currentVideo.file && !currentVideo.streamUrl)) {
      alert("Please select a video first");
      return;
    }

    dispatch(updateCurrentVideo({ isUploading: true, error: null }));

    try {
      const formData = new FormData();

      if (missionId) {
        formData.set("mission_planner_id", missionId);
      }

      // If video is from stream URL, get the file object
      let fileToUpload = currentVideo.file;
      if (currentVideo.streamUrl && !currentVideo.file) {
        fileToUpload = await getFileFromStreamUrl(
          currentVideo.streamUrl,
          currentVideo.fileName
        );
        // Store the file object for future use
        dispatch(updateCurrentVideo({ file: fileToUpload }));
      }

      formData.set("video", fileToUpload);

      const resp = await dispatch(uploadMissionVideo(formData)).unwrap();

      dispatch(
        updateCurrentVideo({
          panelCounts: {
            clean: resp?.data?.counts?.clean,
            dusty: resp?.data?.counts?.dusty,
            damage: resp?.data?.counts?.damaged,
            total: resp?.data?.counts?.total,
          },
          missionVideoId: resp?.data?.id,
          isUploaded: true,
          isUploading: false,
        })
      );
    } catch (err) {
      console.log("Error uploading video:", err);
      dispatch(
        updateCurrentVideo({
          error: err.message || "Upload failed",
          isUploading: false,
        })
      );
    }
  };

  // Upload all videos
  // const handleUploadAll = async () => {
  //   dispatch(setProcessing(true));

  //   console.log("Coming nowwwwwwwwwwwwww", videos.length);

  //   for (let i = 0; i < videos.length; i++) {
  //     console.log("Coming nowwwwwwwwwwwwww");
  //     const video = videos[i];
  //     if ((video.file || video.streamUrl) && !video.isUploaded) {
  //       dispatch(setCurrentVideoIndex(i));

  //       try {
  //         const formData = new FormData();

  //         if (missionId) {
  //           formData.set("mission_planner_id", missionId);
  //         }

  //         // Get file object from stream URL if needed
  //         let fileToUpload = video.file;
  //         if (video.streamUrl && !video.file) {
  //           fileToUpload = await getFileFromStreamUrl(
  //             video.streamUrl,
  //             video.fileName
  //           );
  //           // Update the video with the file object
  //           dispatch(
  //             updateVideoByIndex({
  //               index: i,
  //               updates: { file: fileToUpload },
  //             })
  //           );
  //         }

  //         formData.set("video", fileToUpload);

  //         const resp = await dispatch(uploadMissionVideo(formData)).unwrap();

  //         dispatch(
  //           updateVideoByIndex({
  //             index: i,
  //             updates: {
  //               panelCounts: {
  //                 clean: resp?.data?.counts?.clean,
  //                 dusty: resp?.data?.counts?.dusty,
  //                 damage: resp?.data?.counts?.damaged,
  //                 total: resp?.data?.counts?.total,
  //               },
  //               missionVideoId: resp?.data?.id,
  //               isUploaded: true,
  //               isUploading: false,
  //             },
  //           })
  //         );
  //       } catch (err) {
  //         console.log(`Error uploading video ${i + 1}:`, err);
  //         dispatch(
  //           updateVideoByIndex({
  //             index: i,
  //             updates: {
  //               error: err.message || "Upload failed",
  //               isUploading: false,
  //             },
  //           })
  //         );
  //       }
  //     }
  //   }

  //   dispatch(setProcessing(false));
  // };
  const handleUploadAll = async (vids) => {
    dispatch(setProcessing(true));
    console.log("Coming", vids.length);
    setIsAllLoading(true);
    for (let i = 0; i < vids.length; i++) {
      console.log("Coming nowwwwwwwwwwwwww");
      const video = vids[i];
      if ((video.file || video.streamUrl) && !video.isUploaded) {
        dispatch(setCurrentVideoIndex(i));

        try {
          const formData = new FormData();

          if (missionId) {
            formData.set("mission_planner_id", missionId);
          }

          // Get file object from stream URL if needed
          let fileToUpload = video.file;
          if (video.streamUrl && !video.file) {
            fileToUpload = await getFileFromStreamUrl(
              video.streamUrl,
              video.fileName
            );
            // Update the video with the file object
            dispatch(
              updateVideoByIndex({
                index: i,
                updates: { file: fileToUpload },
              })
            );
          }

          formData.set("video", fileToUpload);

          const resp = await dispatch(uploadMissionVideo(formData)).unwrap();

          dispatch(
            updateVideoByIndex({
              index: i,
              updates: {
                panelCounts: {
                  clean: resp?.data?.counts?.clean,
                  dusty: resp?.data?.counts?.dusty,
                  damage: resp?.data?.counts?.damaged,
                  total: resp?.data?.counts?.total,
                },
                missionVideoId: resp?.data?.id,
                isUploaded: true,
                isUploading: false,
              },
            })
          );
        } catch (err) {
          console.log(`Error uploading video ${i + 1}:`, err);
          dispatch(
            updateVideoByIndex({
              index: i,
              updates: {
                error: err.message || "Upload failed",
                isUploading: false,
              },
            })
          );
        }
      }
    }
    setIsAllLoading(false);

    dispatch(setProcessing(false));
  };
  const pauseVideoBeforeSwitching = () => {
    const video = document.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const goToPrevious = () => {
    pauseVideoBeforeSwitching();
    if (currentVideoIndex > 0) {
      dispatch(setCurrentVideoIndex(currentVideoIndex - 1));
    }
  };

  const goToNext = () => {
    pauseVideoBeforeSwitching();
    if (currentVideoIndex < videos.length - 1) {
      dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
    }
  };

  // Navigate to previous video
  // const goToPrevious = () => {
  //   if (currentVideoIndex > 0) {
  //     dispatch(setCurrentVideoIndex(currentVideoIndex - 1));
  //   }
  // };

  // // Navigate to next video
  // const goToNext = () => {
  //   if (currentVideoIndex < videos.length - 1) {
  //     dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
  //   }
  // };

  // Handle navigation to images with data persistence
  const handleViewImages = (label) => {
    router.push(
      `${ROUTES.VIEW_MISSION_IMAGES}/${currentVideo.missionVideoId}?label=${label}`
    );
  };

  // Handle navigation to efficiency report with data persistence
  const handleViewEfficiencyReport = () => {
    router.push(`${ROUTES.EFFICIENCY_REPORT}/${missionId}`);
  };

  return (
    <div className="flex justify-center items-center p-10 min-h-screen bg-[--color-avocado-100]">
      <div className="flex flex-col sm:w-[70%] gap-6">
        {/* Header with Navigation */}
        <div className="content-header text-center space-y-4">
          <h1 className="text-xl font-bold">Upload Videos</h1>
          {/* <p className="text-sm text-gray-600">
            Videos are automatically loaded from: D:\UNIVERSITY
            PROJECT\TASK-VIDEOS
          </p> */}
          {isAllLoading && (
            <span className="text-blue-600 text-sm">
              Prcoessing Videos...⏳
            </span>
          )}
          {/* Navigation Controls */}
          {videos.length > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPrevious}
                disabled={currentVideoIndex === 0 || isAllLoading}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Video {currentVideoIndex + 1} of {videos.length}
              </span>

              <Button
                type="button"
                variant="outline"
                onClick={goToNext}
                disabled={
                  currentVideoIndex === videos.length - 1 || isAllLoading
                }
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Control Buttons */}
          {/* <div className="flex justify-center gap-2 flex-wrap">
            <Button
              type="button"
              onClick={handleRefreshVideos}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Videos
            </Button>

            <Button
              type="button"
              onClick={showManualFilePicker}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Manual Select
            </Button>
          </div> */}
        </div>

        {/* Loading indicator */}
        {videos.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Spinner />
              <span>Loading videos...</span>
            </div>
          </div>
        )}

        {/* Current Video Display */}
        {currentVideo && (
          <>
            {/* Video Preview Card */}
            <div className="relative">
              {isAllLoading ? (
                <CardSkeleton />
              ) : (
                <VideoPreviewCard
                  // videoFile={currentVideo.file}
                  videoUrl={currentVideo.streamUrl}
                  onVideoSelect={handleVideoSelect}
                  onMultipleVideosSelect={handleMultipleVideosSelect}
                  onRemove={handleRemoveVideoFile}
                  allowMultiple={true}
                  className="max-w-2xl mx-auto"
                />
              )}

              {/* Remove Video Button */}
              {/* {videos.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveVideo(currentVideoIndex)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                >
                  Remove Video
                </Button>
              )} */}

              {/* Video Status */}
              <div className="text-center mt-2">
                {currentVideo.isUploading && (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Spinner />
                    <span>Uploading...</span>
                  </div>
                )}
                {currentVideo.isUploaded && (
                  <div className="text-green-600 font-medium">
                    ✓ Video uploaded successfully
                  </div>
                )}
                {currentVideo.error && (
                  <div className="text-red-600 font-medium">
                    ✗ {currentVideo.error}
                  </div>
                )}
              </div>
            </div>

            {/* Mission Summary Table */}
            {isAllLoading ? (
              <CardSkeleton />
            ) : (
              <div className="p-8 mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Analysis Results - Video {currentVideoIndex + 1}
                </h3>
                <div className="border-2 border-black inline-block">
                  <table className="border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                          Clean
                        </td>
                        <td className="border border-black px-4 py-3 w-24">
                          {currentVideo.panelCounts?.clean !== null
                            ? currentVideo.panelCounts?.clean
                            : "N/A"}
                        </td>
                        <td
                          className={`border ${
                            currentVideo.panelCounts?.clean !== null
                              ? "cursor-pointer underline text-blue-500"
                              : ""
                          } border-black px-4 py-3 w-24`}
                          onClick={() => {
                            if (currentVideo.panelCounts?.clean !== null) {
                              handleViewImages("clean_solar_panel");
                            }
                          }}
                        >
                          {currentVideo.panelCounts?.clean !== null
                            ? "images"
                            : "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                          Dusty
                        </td>
                        <td className="border border-black px-4 py-3 w-24">
                          {currentVideo.panelCounts?.dusty !== null
                            ? currentVideo.panelCounts?.dusty
                            : "N/A"}
                        </td>
                        <td
                          className={`border ${
                            currentVideo.panelCounts?.dusty !== null
                              ? "cursor-pointer underline text-blue-500"
                              : ""
                          } border-black px-4 py-3 w-24`}
                          onClick={() => {
                            if (currentVideo.panelCounts?.dusty !== null) {
                              handleViewImages("dusty_solar_panel");
                            }
                          }}
                        >
                          {currentVideo.panelCounts?.dusty !== null
                            ? "images"
                            : "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                          Damage
                        </td>
                        <td className="border border-black px-4 py-3 w-24">
                          {currentVideo.panelCounts?.damage !== null
                            ? currentVideo.panelCounts?.damage
                            : "N/A"}
                        </td>
                        <td
                          className={`border ${
                            currentVideo.panelCounts?.damage !== null
                              ? "cursor-pointer underline text-blue-500"
                              : ""
                          } border-black px-4 py-3 w-24`}
                          onClick={() => {
                            if (currentVideo.panelCounts?.damage !== null) {
                              handleViewImages("damaged_solar_panel");
                            }
                          }}
                        >
                          {currentVideo.panelCounts?.damage !== null
                            ? "images"
                            : "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black px-4 py-3 w-24 text-left font-medium">
                          Total
                        </td>
                        <td className="border border-black px-4 py-3 w-24">
                          {currentVideo.panelCounts?.total !== null
                            ? currentVideo.panelCounts?.total
                            : "N/A"}
                        </td>
                        <td
                          className={`border ${
                            currentVideo.panelCounts?.total !== null
                              ? "cursor-pointer underline text-blue-500"
                              : ""
                          } border-black px-4 py-3 w-24`}
                          onClick={() => {
                            if (currentVideo.panelCounts?.total !== null) {
                              handleViewImages("total_solar_panel");
                            }
                          }}
                        >
                          {currentVideo.panelCounts?.total !== null
                            ? "images"
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        {/* <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="hover-blue-full"
              onClick={handleUpload}
              disabled={
                !currentVideo ||
                (!currentVideo.file && !currentVideo.streamUrl) ||
                currentVideo.isUploading ||
                isProcessing
              }
              isLoading={currentVideo?.isUploading}
            >
              Upload Current Video
            </Button>

            {videos.length > 1 && (
              <Button
                type="button"
                variant="hover-blue-full"
                onClick={handleUploadAll}
                disabled={
                  isProcessing ||
                  videos.every((v) => v.isUploaded || (!v.file && !v.streamUrl))
                }
                isLoading={isProcessing}
              >
                Upload All Videos
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="hover-blue-full"
            onClick={handleViewEfficiencyReport}
          >
            View Efficiency Report
          </Button>
        </div> */}

        {/* Summary of All Videos */}
        {isAllLoading ? (
          <CardSkeleton />
        ) : (
          videos.length > 1 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Upload Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos?.map((video, index) => (
                  <div
                    key={video.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      index === currentVideoIndex
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => dispatch(setCurrentVideoIndex(index))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Video {index + 1}</span>
                      <div className="flex items-center gap-1">
                        {video.isUploaded && (
                          <span className="text-green-600 text-sm">✓</span>
                        )}
                        {video.isUploading && (
                          <span className="text-blue-600 text-sm">⏳</span>
                        )}
                        {video.error && (
                          <span className="text-red-600 text-sm">✗</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {video.fileName || "No file selected"}
                    </div>
                    {video.isUploaded && (
                      <div className="text-xs text-gray-500 mt-1">
                        Clean: {video.panelCounts?.clean || 0} | Dusty:{" "}
                        {video.panelCounts?.dusty || 0} | Damage:{" "}
                        {video.panelCounts?.damage || 0}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
