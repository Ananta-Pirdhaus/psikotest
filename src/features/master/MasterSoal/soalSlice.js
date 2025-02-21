import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Add Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Function to fetch questions (GET method)
export const fetchSoal = createAsyncThunk(
  "soal/fetchSoal",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("pertanyaan"); // Ganti 'soal' menjadi 'pertanyaan'
      return response.data.data; // Return the fetched data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

export const fetchBakat = createAsyncThunk(
  "bakat/fetchBakat",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("bakat"); // Replace with the correct API endpoint
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  }
);

// Function to add a new question (POST method)
export const addNewSoalAsync = createAsyncThunk(
  "soal/addNewSoalAsync",
  async (newSoal, thunkAPI) => {
    try {
      const bakatID = localStorage.getItem("bakatID"); // Ganti dengan cara mendapatkan bakatID yang sesuai
      const soalData = {
        versi: newSoal.versi,
        type: newSoal.type, // 'SINGLE' atau 'MULTIPLE'
        question: newSoal.question,
        options: newSoal.options.map((option) => ({
          answer: option.answer,
          bakat: option.bakat === "{{bakatID}}" ? bakatID : option.bakat, // Mengganti {{bakatID}} dengan nilai aktual
        })),
      };
      thunkAPI.dispatch(fetchSoal());
      // Kirimkan data soal ke server
      const response = await axios.post("pertanyaan", soalData);
      return response.data.data; // Return the added question
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat menambahkan soal"
      );
    }
  }
);

export const updateSoalAsync = createAsyncThunk(
  "soal/updateSoalAsync",
  async ({ id, updatedSoal }, thunkAPI) => {
    try {
      const response = await axios.put(`pertanyaan/${id}`, updatedSoal);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat memperbarui soal"
      );
    }
  }
);

// Function to get version (GET method)
export const getVersion = createAsyncThunk(
  "bakat/getVersion",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("versi-pertanyaan"); // Replace with the correct API endpoint
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  }
);

export const deleteSoalAsync = createAsyncThunk(
  "soal/deleteSoalAsync",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`pertanyaan/${id}`);
      return id; // Return the deleted question ID
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat menghapus soal"
      );
    }
  }
);

const initialState = {
  soal: [], // List of questions
  bakat: [], // List of bakat data
  status: "idle", // API calling status: idle | loading | succeeded | failed
  error: null, // Error message if any
};

const soalSlice = createSlice({
  name: "soal",
  initialState,
  reducers: {
    // Action to update soal content directly
    getSoalContent(state, action) {
      state.soal = action.payload || [];
    },
    // Action to import multiple soal data
    importSoalData(state, action) {
      if (Array.isArray(action.payload)) {
        state.soal = [...state.soal, ...action.payload];
      }
    },
    // Action to add new soal to state directly
    addNewSoal(state, action) {
      if (Array.isArray(state.soal)) {
        state.soal.push(action.payload); // Add new question to state
      }
    },
    // Action to update bakat data directly
    getBakatContent(state, action) {
      state.bakat = action.payload || [];
    },

    getVersion(state, action) {
      state.versi = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Soal (pertanyaan)
      .addCase(fetchSoal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSoal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.soal = action.payload; // Update soal state with data from API
        console.log("data soal: ", action.payload);
      })
      .addCase(fetchSoal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Bakat
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
        state.error = action.payload;
      })

      .addCase(addNewSoalAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewSoalAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.soal.push(action.payload); // Add the new soal to the array
      })
      .addCase(addNewSoalAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Soal
      .addCase(updateSoalAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSoalAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.soal.findIndex(
          (soal) => soal.id === action.payload.id
        );
        if (index !== -1) {
          state.soal[index] = action.payload;
        }
      })
      .addCase(updateSoalAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Soal
      .addCase(deleteSoalAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSoalAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.soal = state.soal.filter((soal) => soal.id !== action.payload); // Remove deleted question
      })
      .addCase(deleteSoalAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get Version (versi-pertanyaan)
      .addCase(getVersion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVersion.fulfilled, (state, action) => {
        state.status = "succeeded";
        const versionData = action.payload || [];
        state.versi = Array.isArray(versionData) ? versionData : [];
        state.version = versionData.map((version) => ({
          value: version.id,
          label: version.name,
          status: version.status,
        }));
        console.log("Version Options:", state.version);
      })
      .addCase(getVersion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { getSoalContent, importSoalData, addNewSoal, getBakatContent } =
  soalSlice.actions;

export default soalSlice.reducer;
