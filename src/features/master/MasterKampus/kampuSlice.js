import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  university: [],
};

const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {
    getUniversityContent(state, action) {
      // Fetch university data (API call simulation)
    },
    deleteUniversity(state, action) {
      // Handle deletion
    },
    importUniversityData(state, action) {
      state.university = [...state.university, ...action.payload];
    },
    addNewUniversity(state, action) {
      state.university.push(action.payload); // Tambahkan data baru ke array
    },
  },
});

export const {
  getUniversityContent,
  deleteUniversity,
  importUniversityData,
  addNewUniversity, // Ekspor aksi baru
} = universitySlice.actions;

export default universitySlice.reducer;
