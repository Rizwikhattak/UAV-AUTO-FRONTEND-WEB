// store/slices/missionVideoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  currentVideoIndex: 0,
  isProcessing: false,
  isDataLoaded: false, // Add this flag
  lastLoadedMissionId: null, // Track which mission data was loaded for
};

const missionVideoSlice = createSlice({
  name: "missionVideo",
  initialState,
  reducers: {
    // Initialize videos array
    initializeVideos: (state, action) => {
      if (state.videos.length === 0) {
        const newVideo = {
          id: Date.now(),
          file: null,
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
        state.videos = [newVideo];
        state.currentVideoIndex = 0;
      }
    },

    // Set all videos (for multiple file selection)
    setVideos: (state, action) => {
      state.videos = action.payload;
      state.currentVideoIndex = 0;
      state.isDataLoaded = true;
    },
    setDataLoaded: (state, action) => {
      state.isDataLoaded = action.payload;
    },
    setLastLoadedMissionId: (state, action) => {
      state.lastLoadedMissionId = action.payload;
    },
    clearVideos: (state) => {
      state.videos = [];
      state.currentVideoIndex = 0;
      state.isDataLoaded = false;
      state.lastLoadedMissionId = null;
    },
    // Add a new video
    addVideo: (state, action) => {
      const newVideo = action.payload || {
        id: Date.now(),
        file: null,
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
      state.videos.push(newVideo);
      state.currentVideoIndex = state.videos.length - 1;
    },

    // Remove video by index
    removeVideo: (state, action) => {
      const index = action.payload;
      state.videos = state.videos.filter((_, i) => i !== index);

      // Adjust current index if necessary
      if (state.currentVideoIndex >= state.videos.length) {
        state.currentVideoIndex = Math.max(0, state.videos.length - 1);
      }
    },

    // Set current video index
    setCurrentVideoIndex: (state, action) => {
      state.currentVideoIndex = action.payload;
    },

    // Update current video
    updateCurrentVideo: (state, action) => {
      const updates = action.payload;
      if (state.videos[state.currentVideoIndex]) {
        state.videos[state.currentVideoIndex] = {
          ...state.videos[state.currentVideoIndex],
          ...updates,
        };
      }
    },

    // Update specific video by index
    updateVideoByIndex: (state, action) => {
      const { index, updates } = action.payload;
      if (state.videos[index]) {
        state.videos[index] = {
          ...state.videos[index],
          ...updates,
        };
      }
    },

    // Set processing state
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },

    // Reset to initial state
    resetMissionVideo: (state) => {
      return initialState;
    },
  },
});

export const {
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
  setDataLoaded,
  setLastLoadedMissionId,
} = missionVideoSlice.actions;

export default missionVideoSlice.reducer;

// setVideos: (state, action) => {
//   state.videos = action.payload;
//   state.isDataLoaded = true;
// },
// setDataLoaded: (state, action) => {
//   state.isDataLoaded = action.payload;
// },
// setLastLoadedMissionId: (state, action) => {
//   state.lastLoadedMissionId = action.payload;
// },
// clearVideos: (state) => {
//   state.videos = [];
//   state.currentVideoIndex = 0;
//   state.isDataLoaded = false;
//   state.lastLoadedMissionId = null;
// },
