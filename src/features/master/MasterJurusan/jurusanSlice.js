import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

// Set base URL dari environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

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
