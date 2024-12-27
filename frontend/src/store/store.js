import { configureStore } from "@reduxjs/toolkit";
import photoReducer from "./images.slice.js";
import authReducer from "./auth.slice.js";
import searchReducer from "./search.slice.js";

export const store = configureStore({
  reducer: {
    photos: photoReducer,
    auth: authReducer,
    searchState: searchReducer,
  },
});
