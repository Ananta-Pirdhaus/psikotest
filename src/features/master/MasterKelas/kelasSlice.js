// src/features/master/kelasSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL dari environment variable
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL // Gunakan variabel dari .env saat development
    : "PRODUCTION_URL"; // Gunakan URL produksi langsung


// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fungsi untuk mengambil data kelas
export const fetchKelas = createAsyncThunk(
  "kelas/fetchKelas",
  async (level, thunkAPI) => {
    try {
      const response = await axios.get("kelas", {
        params: { level }, // Pass the level filter to the API
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

const initialState = {
  kelas: [], // Daftar kelas
  status: "idle", // Status pemanggilan API: idle | loading | succeeded | failed
  error: null, // Untuk menyimpan pesan error jika ada
};

const kelasSlice = createSlice({
  name: "kelas",
  initialState,
  reducers: {
    getKelasContent(state, action) {
      state.kelas = action.payload || [];
    },
    updateKelasInState(state, action) {
      const index = state.kelas.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.kelas[index] = action.payload; // Update kelas yang sesuai
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKelas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKelas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kelas = action.payload; // Perbarui state `kelas` dengan data dari API
      })
      .addCase(fetchKelas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { getKelasContent, updateKelasInState } = kelasSlice.actions;

// Selectors
export const selectAllKelas = (state) => state.kelas.kelas;
export const selectKelasStatus = (state) => state.kelas.status;
export const selectKelasError = (state) => state.kelas.error;

export default kelasSlice.reducer;
