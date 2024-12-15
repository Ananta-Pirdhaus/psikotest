import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Adding Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Async thunk to add a new jurusan
export const addJurusan = createAsyncThunk(
  "jurusan/addJurusan",
  async (newJurusan, { rejectWithValue }) => {
    try {
      const response = await axios.post("jurusan", {
        name: newJurusan.name,
        description: newJurusan.description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch all bakat data
export const getBakat = createAsyncThunk(
  "bakat/getBakat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("bakat");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch all jurusan data
export const getJurusan = createAsyncThunk(
  "jurusan/getJurusan",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("jurusan");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete a jurusan
export const deleteJurusan = createAsyncThunk(
  "jurusan/deleteJurusan",
  async (jurusanId, { rejectWithValue }) => {
    try {
      await axios.delete(`jurusan/${jurusanId}`);
      return jurusanId; // Return the ID of the deleted jurusan
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state for jurusan
const initialState = {
  jurusan: [], // Data jurusan
  status: "idle", // Loading status
  error: null, // Error state
};

const jurusanSlice = createSlice({
  name: "jurusan",
  initialState,
  reducers: {
    getJurusanContent(state, action) {
      // Ensure action payload is an array, else set to empty array
      state.jurusan = Array.isArray(action.payload) ? action.payload : [];
    },
    importJurusanData(state, action) {
      // Append new jurusan data
      state.jurusan = [
        ...state.jurusan,
        ...(Array.isArray(action.payload) ? action.payload : []),
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ensure jurusan data is an array
        state.jurusan = Array.isArray(action.payload?.data)
          ? action.payload?.data
          : [];
      })
      .addCase(getJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch jurusan data.";
      })
      .addCase(addJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the new jurusan to the list
        state.jurusan.push(action.payload);
      })
      .addCase(addJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add jurusan.";
      })
      .addCase(deleteJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Filter out the deleted jurusan
        state.jurusan = state.jurusan.filter(
          (jurusan) => jurusan.id !== action.payload
        );
      })
      .addCase(deleteJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete jurusan.";
      });
  },
});

// Export actions
export const { getJurusanContent, importJurusanData } = jurusanSlice.actions;

// Export reducer
export default jurusanSlice.reducer;
