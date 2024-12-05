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
  },
});

export const { getEducationContent, deleteEducation, importEducationData } =
  educationSlice.actions;
export default educationSlice.reducer;
