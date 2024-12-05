import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  education: [],
};

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    getEducationContent(state, action) {
      // Fetch education data (API call simulation)
    },
    deleteEducation(state, action) {
      // Handle deletion
    },
    importEducationData(state, action) {
      state.education = [...state.education, ...action.payload];
    },
    addNewEducation(state, action) {
      state.education.push(action.payload); // Tambahkan data baru ke array
    },
  },
});

export const {
  getEducationContent,
  deleteEducation,
  importEducationData,
  addNewEducation, // Ekspor aksi baru
} = educationSlice.actions;

export default educationSlice.reducer;
