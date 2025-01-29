import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Add Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Async thunk for adding profesi
export const addProfesi = createAsyncThunk(
  "profesi/addProfesi",
  async (newProfesi, { getState, rejectWithValue, dispatch }) => {
    const { bakat } = getState().profesi;

    if (!bakat || bakat.length === 0) {
      return rejectWithValue("Bakat data is not available.");
    }

    try {
      const response = await axios.post("profesi", {
        name: newProfesi.name,
        bakat: newProfesi.bakat,
      });

      dispatch(getProfesi());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for getting profesi
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

export const updateProfesi = createAsyncThunk(
  "profesi/updateProfesi",
  async (updatedData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`profesi/${updatedData.profesiId}`, {
        name: updatedData.profesiObj.name,
        bakat: updatedData.profesiObj.bakat,
      });

      // Refresh the profesi list after successful update
      dispatch(getProfesi());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching bakat
export const fetchBakat = createAsyncThunk(
  "profesi/fetchBakat",
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
  profesi: [],
  bakat: [],
  selectBakatOptions: [],
  status: "idle",
  error: null,
};

const profesiSlice = createSlice({
  name: "profesi",
  initialState,
  reducers: {
    getProfesiContent(state, action) {
      state.profesi = Array.isArray(action.payload) ? action.payload : [];
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
    setSelectBakatOptions(state, action) {
      state.selectBakatOptions = action.payload.map((bakat) => ({
        value: bakat.id,
        label: bakat.name,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfesi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfesi.fulfilled, (state, action) => {
        state.status = "succeeded";
        const profesiData = action.payload?.data || [];
        state.profesi = Array.isArray(profesiData) ? profesiData : [];
        console.log("data dari profesi", profesiData);
      })
      .addCase(getProfesi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch profesi data.";
      })
      .addCase(fetchBakat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBakat.fulfilled, (state, action) => {
        state.status = "succeeded";
        const bakatData = action.payload || [];
        state.bakat = Array.isArray(bakatData) ? bakatData : [];
        state.selectBakatOptions = bakatData.map((bakat) => ({
          value: bakat.id,
          label: bakat.name,
        }));
        console.log("Select Bakat Options:", state.selectBakatOptions);
      })
      .addCase(fetchBakat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch bakat data.";
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
      })
      .addCase(updateProfesi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfesi.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProfesi = action.payload;

        // Update the profesi in the state
        const index = state.profesi.findIndex(
          (profesi) => profesi.id === updatedProfesi.id
        );
        if (index !== -1) {
          state.profesi[index] = updatedProfesi;
        }

        // Log success
        console.log("Profesi updated successfully:", updatedProfesi);
      })
      .addCase(updateProfesi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update profesi.";

        // Log failure
        console.error(
          "Failed to update profesi:",
          action.payload || "Unknown error"
        );
      });
  },
});

// Export actions
export const {
  getProfesiContent,
  deleteProfesi,
  importProfesiData,
  getBakatContent,
  setSelectBakatOptions,
} = profesiSlice.actions;

// Export reducer
export default profesiSlice.reducer;
