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
  return response.data;
});

// Thunk untuk menghapus sesi berdasarkan id
export const deleteSesiById = createAsyncThunk(
  "/sesi/delete",
  async (idSesi, thunkAPI) => {
    try {
      await axios.delete(`/sesi/${idSesi}`);
      await thunkAPI.dispatch(getSesiContent());
      return idSesi;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Thunk untuk mengambil hasil jawaban
export const fetchResultAnswer = createAsyncThunk(
  "/jawaban/fetch",
  async (idSession) => {
    const response = await axios.get(`/jawaban/${idSession}`);
    return response.data;
  }
);

// Thunk untuk mengambil hasil survei
export const fetchResultSurvei = createAsyncThunk(
  "/jawaban-survei/fetch",
  async (idSession) => {
    const response = await axios.get(`/jawaban-survei/${idSession}`);
    return response.data;
  }
);

export const hasilQuizSlice = createSlice({
  name: "hasilQuiz",
  initialState: {
    isLoading: false,
    sesi: [],
    resultAnswer: null,
    resultSurvei: null,
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
        state.quizResults = state.sesi.filter(
          (sesi) => sesi.id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteSesiById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchResultAnswer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResultAnswer.fulfilled, (state, action) => {
        state.resultAnswer = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchResultAnswer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchResultSurvei.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResultSurvei.fulfilled, (state, action) => {
        state.resultSurvei = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchResultSurvei.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Ekspor action dan reducer
export const { addNewSesi } = hasilQuizSlice.actions;
export default hasilQuizSlice.reducer;
