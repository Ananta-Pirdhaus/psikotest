import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Adding Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Async thunk to add a new kampus with jurusan
export const addKampus = createAsyncThunk(
  "kampus/addKampus",
  async (newKampus, { rejectWithValue }) => {
    try {
      const response = await axios.post("perguruan-tinggi", {
        name: newKampus.name, // Nama kampus
        jurusan: newKampus.jurusan, // Array jurusan yang berisi ID-ID jurusan
      });
      return response.data; // Mengembalikan response.data sebagai hasil sukses
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update an existing kampus
export const updateKampus = createAsyncThunk(
  "kampus/updateKampus",
  async (updatedKampus, { rejectWithValue }) => {
    try {
      const response = await axios.put(`perguruan-tinggi/${updatedKampus.id}`, {
        name: updatedKampus.name, // Nama kampus
        jurusan: updatedKampus.jurusan, // Array jurusan yang berisi ID-ID jurusan
      });
      return response.data.data; // Mengembalikan response.data sebagai hasil sukses
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
      return response.data.data || response.data; // Consistency with response data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch all kampus data
export const getKampus = createAsyncThunk(
  "kampus/getKampus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("perguruan-tinggi");
      return response.data.data || response.data; // Consistency with response data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete a kampus
export const deleteKampus = createAsyncThunk(
  "kampus/deleteKampus",
  async (kampusId, { rejectWithValue }) => {
    try {
      await axios.delete(`perguruan-tinggi/${kampusId}`);
      return kampusId; // Return the ID of the deleted kampus
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state for kampus and jurusan
const initialState = {
  kampus: [], // Data kampus
  jurusan: [], // Data jurusan
  selectJurusanOptions: [], // Data untuk select options
  status: "idle", // Loading status
  error: null, // Error state
};

const kampusSlice = createSlice({
  name: "kampus",
  initialState,
  reducers: {
    getKampusContent(state, action) {
      state.kampus = Array.isArray(action.payload) ? action.payload : [];
    },
    importKampusData(state, action) {
      state.kampus = [
        ...state.kampus,
        ...(Array.isArray(action.payload) ? action.payload : []),
      ];
    },
    setJurusanData(state, action) {
      state.jurusan = action.payload; // Set jurusan data
    },
    setSelectJurusanOptions(state, action) {
      // Map jurusan data to select options
      state.selectJurusanOptions = action.payload.map((jurusan) => ({
        value: jurusan.id, // ID jurusan sebagai value
        label: jurusan.name, // Name jurusan sebagai label
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKampus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getKampus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kampus = Array.isArray(action.payload) ? action.payload : [];
        console.log("data dari kampus: ", action.payload);
      })
      .addCase(getKampus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch kampus data.";
      })
      .addCase(getJurusan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJurusan.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Check if action.payload is an array
        if (Array.isArray(action.payload)) {
          state.jurusan = action.payload;
          // Map jurusan data to select options
          state.selectJurusanOptions = action.payload.map((jurusan) => ({
            value: jurusan.id,
            label: jurusan.name,
          }));
        } else {
          console.error(
            "Invalid payload structure for getJurusan:",
            action.payload
          );
          state.jurusan = [];
          state.selectJurusanOptions = [];
        }
      })
      .addCase(getJurusan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch jurusan data.";
      })
      .addCase(addKampus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addKampus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kampus.push(action.payload);
      })
      .addCase(addKampus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add kampus.";
      })
      .addCase(updateKampus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateKampus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.kampus.findIndex(
          (kampus) => kampus.id === action.payload.id
        );
        if (index !== -1) {
          state.kampus[index] = action.payload;
        }
      })
      .addCase(updateKampus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update kampus.";
      })
      .addCase(deleteKampus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteKampus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kampus = state.kampus.filter(
          (kampus) => kampus.id !== action.payload
        );
      })
      .addCase(deleteKampus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete kampus.";
      });
  },
});

// Export actions
export const {
  getKampusContent,
  importKampusData,
  setJurusanData,
  setSelectJurusanOptions,
} = kampusSlice.actions;

// Export reducer
export default kampusSlice.reducer;
