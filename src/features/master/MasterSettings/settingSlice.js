import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Add Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fetch settings data
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("setting");

      if (response.data.status === "success") {
        return response.data.data;
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

// Update settings data
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settingsData, thunkAPI) => {
    try {
      const response = await axios.post("setting", settingsData);
      thunkAPI.dispatch(fetchSettings());
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

const settingSlice = createSlice({
  name: "settings",
  initialState: {
    settings: null,
    loading: false,
    error: null,
    status: "idle", // idle, loading, succeeded, failed
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })
      // Handle updateSettings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export default settingSlice.reducer;
