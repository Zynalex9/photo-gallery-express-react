import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchByTitle: false,
  searchByTags: false,
  sortByDate: false,
};
const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    queryByTitle: (state, action) => {
      state.searchByTitle = !state.searchByTitle;
      state.searchByTags = false;
      state.sortByDate = false;
    },
    queryByTags: (state, action) => {
      state.searchByTitle = false;
      state.searchByTags = !state.searchByTags;
      state.sortByDate = false;
    },
  },
});
export const { queryByTitle, queryByTags } = searchSlice.actions;
export default searchSlice.reducer;
