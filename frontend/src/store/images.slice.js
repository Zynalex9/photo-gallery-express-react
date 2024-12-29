import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchPhotos = createAsyncThunk("fetch/photos", async () => {
  const { data } = await axios.get("/api/v1/photo/all-photos");
  return data.data;
});
export const fetchPaginatedPhotos = createAsyncThunk(
  "fetch/paginate/photos",
  async ({ page }) => {
    try {
      const { data } = await axios.get(
        `/api/v1/photo/paginatephotos?page=${page}`
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  photos: [],
  paginatedPhotos: [],
  loading: false,
  error: false,
  filteredPhotos: false,
  isFiltered: false,
};
const imageSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchPaginatedPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchPaginatedPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.paginatedPhotos = action.payload;
        console.log("action", action.payload);
      })
      .addCase(fetchPaginatedPhotos.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default imageSlice.reducer;
