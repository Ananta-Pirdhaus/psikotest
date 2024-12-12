import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set the base URL for axios requests
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Define the async thunk to add a profesi
export const addProfesi = createAsyncThunk(
  "profesi/addProfesi",
  async (newProfesi, { getState, rejectWithValue }) => {
    // Ambil data bakat dari state
    const bakat = getState().bakat.data;

    // Pastikan bakat tersedia
    if (!bakat || bakat.length === 0) {
      return rejectWithValue("Bakat data is not available.");
    }

    // Kirim request untuk menambahkan profesi baru
    try {
      const response = await axios.post("profesi", {
        name: newProfesi.name,
        bakat: newProfesi.bakat, // bakat yang dipilih, berupa array ID bakat
      });

      // Kembalikan data yang berhasil ditambahkan
      return response.data;
    } catch (error) {
      // Tangani error jika gagal
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const initialState = {
  profesi: [], // Initial empty array for profesi data
  status: "idle", // To track the loading status of profesi
  error: null, // For storing profesi errors
};

const profesiSlice = createSlice({
  name: "profesi",
  initialState,
  reducers: {
    getProfesiContent(state, action) {
      const profesiData = Array.isArray(action.payload) ? action.payload : [];
      state.profesi = profesiData;
    },
    deleteProfesi(state, action) {
      const idToDelete = action.payload;
      state.profesi = state.profesi.filter(
        (profesi) => profesi.id !== idToDelete
      );
    },
    importProfesiData(state, action) {
      const profesiData = Array.isArray(action.payload) ? action.payload : [];
      state.profesi = [...state.profesi, ...profesiData];
    },
  },
});

// Export actions for use in components
export const { getProfesiContent, deleteProfesi, importProfesiData } =
  profesiSlice.actions;

// Default export of the reducer for the slice
export default profesiSlice.reducer;
