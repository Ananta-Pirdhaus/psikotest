import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL // Gunakan variabel dari .env saat development
    : "PRODUCTION_URL"; // Gunakan URL produksi langsung

// Add Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fetch versi-pertanyaan data
export const fetchVersiPertanyaan = createAsyncThunk(
  "versi-pertanyaan/fetchVersiPertanyaan",
  async (page, thunkAPI) => {
    try {
      const response = await axios.get("versi-pertanyaan");

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

export const addVersiPertanyaan = createAsyncThunk(
  "versi-pertanyaan/addVersiPertanyaan",
  async ({ name, status }, thunkAPI) => {
    try {
      const response = await axios.post("versi-pertanyaan", {
        name,
        status,
      });
      thunkAPI.dispatch(fetchVersiPertanyaan()); // Menggunakan thunkAPI.dispatch untuk memanggil fetchVersiPertanyaan
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Fetch details of a specific versi-pertanyaan
export const fetchDetailsVersiPertanyaan = createAsyncThunk(
  "versi-pertanyaan/fetchDetailsVersiPertanyaan",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`versi-pertanyaan/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Add versi-pertanyaan data
export const importVersiPertanyaan = createAsyncThunk(
  "versi-pertanyaan/importVersiPertanyaan",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("versi-pertanyaan/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Update versi-pertanyaan data
export const updateVersiPertanyaan = createAsyncThunk(
  "versi-pertanyaan/updateVersiPertanyaan",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`versi-pertanyaan/${id}`, data);
      dispatch(fetchVersiPertanyaan());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete versi-pertanyaan data
export const deleteVersiPertanyaan = createAsyncThunk(
  "versi-pertanyaan/deleteVersiPertanyaan",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`versi-pertanyaan/${id}`);
      dispatch(fetchVersiPertanyaan()); // Refresh daftar versi pertanyaan setelah penghapusan
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Terjadi kesalahan");
    }
  }
);

const versiPertanyaanSlice = createSlice({
  name: "versi",
  initialState: {
    versiPertanyaan: [],
    versiPertanyaanDetails: null,
    loading: false,
    error: null,
    status: "idle", // idle, loading, succeeded, failed
    meta: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchVersiPertanyaan
      .addCase(fetchVersiPertanyaan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"; // Update status
      })
      .addCase(fetchVersiPertanyaan.fulfilled, (state, action) => {
        state.loading = false;
        state.versi = action.payload;
        state.meta = action.meta.arg; // Storing page info from the meta
        state.status = "succeeded";
        console.log("Fetch Versi Pertanyaan fulfilled:", action);
      })

      .addCase(fetchVersiPertanyaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed"; // Update status
      })

      // Handle fetchDetailsVersiPertanyaan
      .addCase(fetchDetailsVersiPertanyaan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchDetailsVersiPertanyaan.fulfilled, (state, action) => {
        state.loading = false;
        state.versiPertanyaanDetails = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDetailsVersiPertanyaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Handle addVersiPertanyaan
      .addCase(addVersiPertanyaan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(addVersiPertanyaan.fulfilled, (state, action) => {
        state.loading = false;
        state.versiPertanyaan.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(addVersiPertanyaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Handle importVersiPertanyaan
      .addCase(importVersiPertanyaan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(importVersiPertanyaan.fulfilled, (state, action) => {
        state.loading = false;
        state.versiPertanyaan = [...state.versiPertanyaan, ...action.payload];
        state.status = "succeeded";
      })
      .addCase(importVersiPertanyaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Handle updateVersiPertanyaan
      .addCase(updateVersiPertanyaan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVersiPertanyaan.fulfilled, (state, action) => {
        state.loading = false;
        state.versiPertanyaan = action.payload.data;
      })
      .addCase(updateVersiPertanyaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteVersiPertanyaan
      .addCase(deleteVersiPertanyaan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVersiPertanyaan.fulfilled, (state, action) => {
        state.loading = false;
        state.versiPertanyaan = state.versiPertanyaan.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteVersiPertanyaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default versiPertanyaanSlice.reducer;
