import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jurusan: [], // Rename 'education' to 'jurusan'
};

const jurusanSlice = createSlice({
  name: "jurusan", // Rename 'education' to 'jurusan'
  initialState,
  reducers: {
    getJurusanContent(state, action) {
      // Fetch jurusan data (API call simulation)
    },
    deleteJurusan(state, action) {
      // Handle deletion
      const index = action.payload;
      state.jurusan.splice(index, 1); // Delete jurusan at the specified index
    },
    importJurusanData(state, action) {
      state.jurusan = [...state.jurusan, ...action.payload]; // Import data for jurusan
    },
  },
});

export const { getJurusanContent, deleteJurusan, importJurusanData } =
  jurusanSlice.actions;
export default jurusanSlice.reducer;
