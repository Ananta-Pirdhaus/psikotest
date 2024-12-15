import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL dari environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Async thunk untuk menambahkan profesi
export const addProfesi = createAsyncThunk(
  "profesi/addProfesi",
  async (newProfesi, { getState, rejectWithValue }) => {
    const bakat = getState().bakat.data;

    if (!bakat || bakat.length === 0) {
      return rejectWithValue("Bakat data is not available.");
    }

    try {
      const response = await axios.post("profesi", {
        name: newProfesi.name,
        bakat: newProfesi.bakat,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk untuk mendapatkan profesi
export const getProfesi = createAsyncThunk(
  "profesi/getProfesi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("profesi");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk untuk `bakat`
export const fetchBakat = createAsyncThunk(
  "data/fetchBakat",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("bakat");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Initial state
const initialState = {
  profesi: [], // Data profesi
  bakat: [],
  status: "idle", // Status loading
  error: null, // Error state
};

const profesiSlice = createSlice({
  name: "profesi",
  initialState,
  reducers: {
    getProfesiContent(state, action) {
      const profesiData = Array.isArray(action.payload) ? action.payload : [];
      state.profesi = profesiData;
    },
    deleteProfesi(state, action) {
      const idToDelete = action.payload;
      state.profesi = state.profesi.filter(
        (profesi) => profesi.id !== idToDelete
      );
    },
    importProfesiData(state, action) {
      const profesiData = Array.isArray(action.payload) ? action.payload : [];
      state.profesi = [...state.profesi, ...profesiData];
    },
    getBakatContent(state, action) {
      state.bakat = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfesi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfesi.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Access the 'data' field in the response
        const profesiData = action.payload?.data || [];

        // Update the state with the profesi data
        state.profesi = Array.isArray(profesiData) ? profesiData : [];

        // Log the data to the console
        console.log("data dari profesi", profesiData);
      })

      .addCase(fetchBakat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBakat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bakat = action.payload;
        console.log("data fetchBaka mantap: ", action.payload);
      })
      .addCase(fetchBakat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getProfesi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch profesi data.";
      })
      .addCase(addProfesi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProfesi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profesi.push(action.payload);
      })
      .addCase(addProfesi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add profesi.";
      });
  },
});

// Export actions
export const {
  getProfesiContent,
  deleteProfesi,
  importProfesiData,
  getBakatContent,
} = profesiSlice.actions;

// Export reducer
export default profesiSlice.reducer;
