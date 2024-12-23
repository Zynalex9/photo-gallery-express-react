import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
  "fetch/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/user/getuser");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unauthorized");
    }
  }
);

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    loggedIn: (state,action) => {
      state.isLoggedIn = true;
      console.log("isada",action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { logout,loggedIn } = authSlice.actions;
export default authSlice.reducer;
