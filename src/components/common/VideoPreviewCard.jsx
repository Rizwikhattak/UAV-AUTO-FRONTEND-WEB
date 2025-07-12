import React, { useState, useRef, useEffect } from "react";
import { Upload, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

const VideoPreviewCard = ({
  videoFile,
  videoUrl,
  onVideoSelect,
  onMultipleVideosSelect, // New prop for handling multiple files
  onRemove,
  className = "",
  allowMultiple = false, // New prop to enable multiple selection
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasVideo = videoFile || videoUrl;

  // Handle video source creation and cleanup
  useEffect(() => {
    if (videoFile) {
      setIsLoading(true);
      setError(null);

      // Create object URL for the video file
      const objectUrl = URL.createObjectURL(videoFile);
      setVideoSrc(objectUrl);

      // Cleanup function to revoke object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (videoUrl) {
      setVideoSrc(videoUrl);
    } else {
      setVideoSrc(null);
    }
  }, [videoFile, videoUrl]);
  useEffect(() => {
    // Clean up when videoSrc changes (or component unmounts)
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [videoSrc]);
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Filter for video files only
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    if (videoFiles.length === 0) {
      setError("Please select valid video files");
      return;
    }

    // If non-video files were selected, show warning
    if (videoFiles.length !== files.length) {
      setError(
        `${files.length - videoFiles.length} non-video files were ignored`
      );
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } else {
      setError(null);
    }

    if (allowMultiple && videoFiles.length > 1 && onMultipleVideosSelect) {
      // Handle multiple files
      onMultipleVideosSelect(videoFiles);
    } else {
      // Handle single file (use first video file)
      onVideoSelect(videoFiles[0]);
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        setError(null);
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error playing video:", error);
      setError(
        "Unable to play video. The file might be corrupted or in an unsupported format."
      );
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    setError(
      "Failed to load video. Please check the file format and try again."
    );
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / duration) * 100);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      }
    }
  };

  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 ${className}`}
    >
      {!hasVideo ? (
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Video{allowMultiple ? "s" : ""}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Select {allowMultiple ? "one or more video files" : "a video file"}{" "}
            from your computer
            {allowMultiple && <br />}
            {allowMultiple && (
              <span className="text-xs">
                (Hold Ctrl/Cmd to select multiple files)
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
          >
            Choose File{allowMultiple ? "s" : ""}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv,video/flv,video/mkv"
            onChange={handleFileSelect}
            multiple={allowMultiple}
            className="hidden"
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden group">
            {videoSrc && (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-64 object-contain cursor-pointer"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onError={handleVideoError}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadStart={() => setIsLoading(true)}
                preload="metadata"
                controls={false}
                onClick={handlePlayPause}
                playsInline
                muted={isMuted}
              />
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-sm">Loading video...</div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-white text-sm text-center px-4">
                  {error}
                </div>
              </div>
            )}

            {/* Play button overlay when paused */}
            {!isPlaying && !isLoading && !error && videoSrc && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  onClick={handlePlayPause}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-colors"
                >
                  <Play className="w-8 h-8" />
                </button>
              </div>
            )}

            {/* Video Controls Overlay */}
            {videoSrc && !error && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="space-y-2">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-1 bg-white/30 rounded cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-blue-500 rounded transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20 p-2 rounded"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={handleMute}
                        className="text-white hover:bg-white/20 p-2 rounded"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:bg-white/20 p-2 rounded"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          {!videoUrl && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {videoFile ? videoFile.name : "Video from URL"}
                </p>
                {videoFile && (
                  <p className="text-xs text-gray-500">
                    Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Change
                </button>
                <button
                  onClick={onRemove}
                  className="px-3 py-1 text-sm border border-gray-300 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv,video/flv,video/mkv"
            onChange={handleFileSelect}
            multiple={allowMultiple}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPreviewCard;

// import React, { useState, useRef, useEffect } from "react";
// import { Upload, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

// const VideoPreviewCard = ({
//   videoFile,
//   videoUrl,
//   onVideoSelect,
//   onRemove,
//   className = "",
// }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [videoSrc, setVideoSrc] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const videoRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const hasVideo = videoFile || videoUrl;
//   console.log("videoUrl", videoUrl, hasVideo);
//   // Handle video source creation and cleanup
//   useEffect(() => {
//     if (videoFile) {
//       setIsLoading(true);
//       setError(null);

//       // Create object URL for the video file
//       const objectUrl = URL.createObjectURL(videoFile);
//       setVideoSrc(objectUrl);

//       // Cleanup function to revoke object URL
//       return () => {
//         URL.revokeObjectURL(objectUrl);
//       };
//     } else if (videoUrl) {
//       setVideoSrc(videoUrl);
//     } else {
//       setVideoSrc(null);
//     }
//   }, [videoFile, videoUrl]);

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("video/")) {
//       setError(null);
//       onVideoSelect(file);
//     } else if (file) {
//       setError("Please select a valid video file");
//     }
//   };

//   const handlePlayPause = async () => {
//     if (!videoRef.current) return;

//     try {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         // Reset any previous errors
//         setError(null);
//         await videoRef.current.play();
//       }
//     } catch (error) {
//       console.error("Error playing video:", error);
//       setError(
//         "Unable to play video. The file might be corrupted or in an unsupported format."
//       );
//       setIsPlaying(false);
//     }
//   };

//   const handleMute = () => {
//     if (videoRef.current) {
//       const newMutedState = !isMuted;
//       videoRef.current.muted = newMutedState;
//       setIsMuted(newMutedState);
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current && !isNaN(videoRef.current.duration)) {
//       const current = videoRef.current.currentTime;
//       const total = videoRef.current.duration;
//       setCurrentTime(current);
//       setProgress(total > 0 ? (current / total) * 100 : 0);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (videoRef.current) {
//       setDuration(videoRef.current.duration);
//       setIsLoading(false);
//     }
//   };

//   const handleVideoError = (e) => {
//     console.error("Video error:", e);
//     setError(
//       "Failed to load video. Please check the file format and try again."
//     );
//     setIsLoading(false);
//     setIsPlaying(false);
//   };

//   const handleCanPlay = () => {
//     setIsLoading(false);
//     setError(null);
//   };

//   const handleProgressClick = (e) => {
//     if (videoRef.current && duration > 0) {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const clickX = e.clientX - rect.left;
//       const width = rect.width;
//       const newTime = (clickX / width) * duration;
//       videoRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//       setProgress((newTime / duration) * 100);
//     }
//   };

//   const formatTime = (time) => {
//     if (isNaN(time) || time === 0) return "0:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   const handleFullscreen = () => {
//     if (videoRef.current) {
//       if (videoRef.current.requestFullscreen) {
//         videoRef.current.requestFullscreen();
//       } else if (videoRef.current.webkitRequestFullscreen) {
//         videoRef.current.webkitRequestFullscreen();
//       } else if (videoRef.current.mozRequestFullScreen) {
//         videoRef.current.mozRequestFullScreen();
//       }
//     }
//   };

//   return (
//     <div
//       className={`border-2 border-dashed border-gray-300 rounded-lg p-6 ${className}`}
//     >
//       {!hasVideo ? (
//         <div className="text-center">
//           <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//             <Upload className="w-6 h-6 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             Upload Video
//           </h3>
//           <p className="text-sm text-gray-500 mb-4">
//             Select a video file from your computer or provide a video URL
//           </p>
//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
//           >
//             Choose File
//           </button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv,video/flv,video/mkv"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div className="relative bg-black rounded-lg overflow-hidden group">
//             {videoSrc && (
//               <video
//                 ref={videoRef}
//                 src={videoSrc}
//                 className="w-full h-64 object-contain cursor-pointer"
//                 onTimeUpdate={handleTimeUpdate}
//                 onLoadedMetadata={handleLoadedMetadata}
//                 onCanPlay={handleCanPlay}
//                 onError={handleVideoError}
//                 onEnded={() => setIsPlaying(false)}
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 onLoadStart={() => setIsLoading(true)}
//                 preload="metadata"
//                 controls={false}
//                 onClick={handlePlayPause}
//                 playsInline
//                 muted={isMuted}
//               />
//             )}

//             {/* Loading indicator */}
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//                 <div className="text-white text-sm">Loading video...</div>
//               </div>
//             )}

//             {/* Error message */}
//             {error && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/70">
//                 <div className="text-white text-sm text-center px-4">
//                   {error}
//                 </div>
//               </div>
//             )}

//             {/* Play button overlay when paused */}
//             {!isPlaying && !isLoading && !error && videoSrc && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                 <button
//                   onClick={handlePlayPause}
//                   className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-colors"
//                 >
//                   <Play className="w-8 h-8" />
//                 </button>
//               </div>
//             )}

//             {/* Video Controls Overlay */}
//             {videoSrc && !error && (
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <div className="space-y-2">
//                   {/* Progress Bar */}
//                   <div
//                     className="w-full h-1 bg-white/30 rounded cursor-pointer"
//                     onClick={handleProgressClick}
//                   >
//                     <div
//                       className="h-full bg-blue-500 rounded transition-all duration-200"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>

//                   {/* Control Buttons */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={handlePlayPause}
//                         className="text-white hover:bg-white/20 p-2 rounded"
//                       >
//                         {isPlaying ? (
//                           <Pause className="w-4 h-4" />
//                         ) : (
//                           <Play className="w-4 h-4" />
//                         )}
//                       </button>

//                       <button
//                         onClick={handleMute}
//                         className="text-white hover:bg-white/20 p-2 rounded"
//                       >
//                         {isMuted ? (
//                           <VolumeX className="w-4 h-4" />
//                         ) : (
//                           <Volume2 className="w-4 h-4" />
//                         )}
//                       </button>

//                       <span className="text-white text-sm">
//                         {formatTime(currentTime)} / {formatTime(duration)}
//                       </span>
//                     </div>

//                     <button
//                       onClick={handleFullscreen}
//                       className="text-white hover:bg-white/20 p-2 rounded"
//                     >
//                       <Maximize className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Video Info */}
//           {!videoUrl && (
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {videoFile ? videoFile.name : "Video from URL"}
//                 </p>
//                 {videoFile && (
//                   <p className="text-xs text-gray-500">
//                     Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
//                   </p>
//                 )}
//                 {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
//                 >
//                   Change
//                 </button>
//                 <button
//                   onClick={onRemove}
//                   className="px-3 py-1 text-sm border border-gray-300 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           )}

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv,video/flv,video/mkv"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPreviewCard;
