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
    sekolahDetails: null, // Store the details of the selected school
    loading: false,
    error: null,
    meta: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchSekolah
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
      })

      // Handle fetchDetailsSekolah
      .addCase(fetchDetailsSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailsSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolahDetails = action.payload; // Store the school details
      })
      .addCase(fetchDetailsSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle addSekolah
      .addCase(addSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolah.push(action.payload);
      })
      .addCase(addSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle importSekolah
      .addCase(importSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importSekolah.fulfilled, (state, action) => {
        state.loading = false;
        state.sekolah = [...state.sekolah, ...action.payload];
      })
      .addCase(importSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateSekolah
      .addCase(updateSekolah.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSekolah.fulfilled, (state, action) => {
        state.loading = false;
        // Update the school in the state after successful update
        const updatedSekolah = action.payload;
        state.sekolah = state.sekolah.map((sekolah) =>
          sekolah.id === updatedSekolah.id ? updatedSekolah : sekolah
        );
        if (state.sekolahDetails?.id === updatedSekolah.id) {
          state.sekolahDetails = updatedSekolah; // If this is the current school detail being viewed, update it
        }
      })
      .addCase(updateSekolah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sekolahSlice.reducer;
