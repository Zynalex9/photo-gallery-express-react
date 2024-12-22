import { configureStore } from "@reduxjs/toolkit";
import photoReducer from "./images.slice.js";
export const store = configureStore({
  reducer: {
    photos: photoReducer,
  },
});
