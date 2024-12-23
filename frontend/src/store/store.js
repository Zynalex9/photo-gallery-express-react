import { configureStore } from "@reduxjs/toolkit";
import photoReducer from "./images.slice.js";
import authReducer from "./auth.slice.js";
export const store = configureStore({
  reducer: {
    photos: photoReducer,
    auth: authReducer,
  },
});
