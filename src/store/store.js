import rootReducer from "@/store/rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // required for redux-persist
//     }),
// });

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for File objects
        ignoredActions: [
          "missionVideo/updateCurrentVideo",
          "missionVideo/setVideos",
          "missionVideo/addVideo",
          "missionVideo/updateVideoByIndex",
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["payload.file"],
        // Ignore these paths in the state
        ignoredPaths: [
          "missionVideo.videos.0.file",
          "missionVideo.videos.1.file",
        ],
      },
    }),
});

export const persistor = persistStore(store);
