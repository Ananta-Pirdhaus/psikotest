import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

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
  async ({ id, title, content }, thunkAPI) => {
    try {
      const response = await axios.put(`panduan/${id}`, {
        title,
        content,
      });
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
        state.panduan = action.payload;
        state.meta = action.meta.arg; // Storing page info from the meta
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
        const updatedPanduan = action.payload;
        state.panduan = state.panduan.map((panduan) =>
          panduan.id === updatedPanduan.id ? updatedPanduan : panduan
        );
        if (state.panduanDetails?.id === updatedPanduan.id) {
          state.panduanDetails = updatedPanduan;
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
