import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL // Gunakan variabel dari .env saat development
    : process.env.REACT_APP_PRODUCTION_URL; // Gunakan URL produksi dari .env

// Add Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fetch panduan data
export const fetchPanduan = createAsyncThunk(
  "panduan/fetchPanduan",
  async (page, thunkAPI) => {
    try {
      const response = await axios.get("panduan", {
        params: { page }, // Only pass the page parameter
      });

      if (response.data.status === "success") {
        return response.data.data; // Return the data part of the response
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Update panduan data
export const updatePanduan = createAsyncThunk(
  "panduan/updatePanduan",
  async ({ description }, thunkAPI) => {
    try {
      const response = await axios.put("panduan", { description });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

const panduanSlice = createSlice({
  name: "panduan",
  initialState: {
    panduan: [],
    panduanDetails: null,
    loading: false,
    error: null,
    status: "idle", // idle, loading, succeeded, failed
    meta: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchPanduan
      .addCase(fetchPanduan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"; // Update status
      })
      .addCase(fetchPanduan.fulfilled, (state, action) => {
        state.loading = false;

        // Menyesuaikan response agar memiliki ID
        const rawData = action.payload;
        const formattedData = {
          id: new Date().getTime(), // ID berdasarkan timestamp
          ...rawData,
        };

        state.panduan = formattedData;
        state.meta = action.meta.arg;
        state.status = "succeeded";
      })

      .addCase(fetchPanduan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed"; // Update status
      })

      // Handle updatePanduan
      .addCase(updatePanduan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })

      .addCase(updatePanduan.fulfilled, (state, action) => {
        state.loading = false;

        // Ambil deskripsi terbaru dari payload
        const updatedDescription = action.payload.description;

        // Pastikan state.panduan ada sebelum mengubahnya
        if (state.panduan) {
          state.panduan.description = updatedDescription;
        }

        // Jika ada detail panduan yang sedang ditampilkan, perbarui juga
        if (state.panduanDetails) {
          state.panduanDetails.description = updatedDescription;
        }

        state.status = "succeeded";
      })

      .addCase(updatePanduan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export default panduanSlice.reducer;
