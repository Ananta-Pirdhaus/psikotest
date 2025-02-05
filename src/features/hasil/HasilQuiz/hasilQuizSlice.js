import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL dari environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Thunk untuk mendapatkan data sesi
export const getSesiContent = createAsyncThunk("/sesi/content", async () => {
  const response = await axios.get("/sesi?page=2");
  console.log("Data Sesi:", response.data);
  return response.data;
});

// Thunk untuk menghapus sesi berdasarkan id
export const deleteSesiById = createAsyncThunk(
  "/sesi/delete",
  async (idSesi, { rejectWithValue }) => {
    try {
      // Log ID sesi yang diterima
      console.log("ID Sesi yang akan dihapus:", idSesi);

      // Menghapus sesi
      await axios.delete(`/sesi/${idSesi}`);
      return idSesi; // Mengembalikan idSesi yang berhasil dihapus
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const hasilQuizSlice = createSlice({
  name: "hasilQuiz",
  initialState: {
    isLoading: false,
    sesi: [],
    error: null,
  },
  reducers: {
    addNewSesi: (state, action) => {
      const { newSesiObj } = action.payload;
      state.sesi = [...state.sesi, newSesiObj];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSesiContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSesiContent.fulfilled, (state, action) => {
        state.quizResults = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getSesiContent.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteSesiById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSesiById.fulfilled, (state, action) => {
        const idSesi = action.payload;
        state.sesi = state.sesi.filter((sesi) => sesi.id !== idSesi);
        state.isLoading = false;
      })
      .addCase(deleteSesiById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Ekspor action dan reducer
export const { addNewSesi } = hasilQuizSlice.actions;
export default hasilQuizSlice.reducer;
