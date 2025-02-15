import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL // Gunakan variabel dari .env saat development
    : "PRODUCTION_URL"; // Gunakan URL produksi langsung

// Adding Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Async thunk to add a new jurusan with bakat
export const addJurusan = createAsyncThunk(
  "jurusan/addJurusan",
  async (newJurusan, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post("jurusan", {
        name: newJurusan.name, // Nama jurusan
        bakat: newJurusan.bakat, // Array bakat yang berisi ID-ID bakat
      });
      dispatch(getJurusan());
      return response.data; // Mengembalikan response.data sebagai hasil sukses
    } catch (error) {
      // Jika terjadi error, mengembalikan pesan error
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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

// Async thunk to update an existing jurusan
export const updateJurusan = createAsyncThunk(
  "jurusan/updateJurusan",
  async (updatedJurusan, { rejectWithValue }) => {
    try {
      // Update the API request body to match the provided structure
      const response = await axios.put(`jurusan/${updatedJurusan.id}`, {
        name: updatedJurusan.name, // Nama jurusan
        bakat: updatedJurusan.bakat, // Array bakat yang berisi ID-ID bakat
      });
      return response.data.data; // Mengembalikan response.data sebagai hasil sukses
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

// Initial state for jurusan and bakat
const initialState = {
  jurusan: [], // Data jurusan
  bakat: [], // Data bakat
  selectBakatOptions: [], // Data untuk select options
  status: "idle", // Loading status
  error: null, // Error state
};

const jurusanSlice = createSlice({
  name: "jurusan",
  initialState,
  reducers: {
    getJurusanContent(state, action) {
      state.jurusan = Array.isArray(action.payload) ? action.payload : [];
    },
    importJurusanData(state, action) {
      state.jurusan = [
        ...state.jurusan,
        ...(Array.isArray(action.payload) ? action.payload : []),
      ];
    },
    setBakatData(state, action) {
      state.bakat = action.payload; // Set bakat data
    },
    setSelectBakatOptions(state, action) {
      // Map bakat data to select options
      state.selectBakatOptions = action.payload.map((bakat) => ({
        value: bakat.id, // ID bakat sebagai value
        label: bakat.name, // Name bakat sebagai label
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jurusan = Array.isArray(action.payload?.data)
          ? action.payload?.data
          : [];
      })
      .addCase(getJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch jurusan data.";
      })
      .addCase(getBakat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBakat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bakat = Array.isArray(action.payload?.data)
          ? action.payload?.data
          : [];
        // After fetching bakat, update selectBakatOptions
        state.selectBakatOptions = action.payload?.data.map((bakat) => ({
          value: bakat.id,
          label: bakat.name,
        }));
      })
      .addCase(getBakat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch bakat data.";
      })
      .addCase(addJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jurusan.push(action.payload);
      })
      .addCase(addJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add jurusan.";
      })
      .addCase(updateJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the jurusan in the state with the updated data
        const index = state.jurusan.findIndex(
          (jurusan) => jurusan.id === action.payload.id
        );
        if (index !== -1) {
          state.jurusan[index] = action.payload; // Replace the old jurusan with the updated one
        }
      })
      .addCase(updateJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update jurusan.";
      })
      .addCase(deleteJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";
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
export const {
  getJurusanContent,
  importJurusanData,
  setBakatData,
  setSelectBakatOptions,
} = jurusanSlice.actions;

// Export reducer
export default jurusanSlice.reducer;
