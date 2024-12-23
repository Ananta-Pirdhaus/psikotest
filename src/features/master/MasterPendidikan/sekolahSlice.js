import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Add Authorization header with token from localStorage
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

export const addSekolah = createAsyncThunk(
  "sekolah/addSekolah",
  async ({ name, level }, thunkAPI) => {
    try {
      const response = await axios.post("sekolah", {
        name,
        level,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Fetch details of a specific sekolah (school)
export const fetchDetailsSekolah = createAsyncThunk(
  "sekolah/fetchDetailsSekolah",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`sekolah/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Add sekolah data

// Import sekolah data
export const importSekolah = createAsyncThunk(
  "sekolah/importSekolah",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("sekolah/import", formData, {
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

// Update sekolah data
export const updateSekolah = createAsyncThunk(
  "sekolah/updateSekolah",
  async ({ id, name, level }, thunkAPI) => {
    try {
      const response = await axios.put(`sekolah/${id}`, {
        name,
        level,
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
    sekolahDetails: null,
    loading: false,
    error: null,
    status: "idle", // idle, loading, succeeded, failed
    meta: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchSekolah
      .addCase(fetchSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"; // Update status
      })
      .addCase(fetchSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolah = action.payload;
        state.meta = action.payload.meta || {};
        state.status = "succeeded"; // Update status
      })
      .addCase(fetchSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed"; // Update status
      })

      // Handle fetchDetailsSekolah
      .addCase(fetchDetailsSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchDetailsSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolahDetails = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDetailsSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Handle addSekolah
      .addCase(addSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(addSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolah.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(addSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Handle importSekolah
      .addCase(importSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(importSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolah = [...state.sekolah, ...action.payload];
        state.status = "succeeded";
      })
      .addCase(importSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Handle updateSekolah
      .addCase(updateSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateSekolah.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSekolah = action.payload;
        state.sekolah = state.sekolah.map((sekolah) =>
          sekolah.id === updatedSekolah.id ? updatedSekolah : sekolah
        );
        if (state.sekolahDetails?.id === updatedSekolah.id) {
          state.sekolahDetails = updatedSekolah;
        }
        state.status = "succeeded";
      })
      .addCase(updateSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export default sekolahSlice.reducer;
