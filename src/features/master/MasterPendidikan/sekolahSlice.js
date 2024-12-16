// sekolahSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL dari environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fetch sekolah data
export const fetchSekolah = createAsyncThunk(
  "sekolah/fetchSekolah",
  async ({ level, page }, thunkAPI) => {
    try {
      const response = await axios.get("sekolah", {
        params: { level, page },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

const sekolahSlice = createSlice({
  name: "sekolah",
  initialState: {
    sekolah: [],
    loading: false,
    error: null,
    meta: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolah = action.payload;
        state.meta = action.payload.meta || {};
      })
      .addCase(fetchSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sekolahSlice.reducer;
