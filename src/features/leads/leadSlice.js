import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Thunk untuk mendapatkan data peserta
export const getPesertaContent = createAsyncThunk(
  "/peserta/content",
  async () => {
    const response = await axios.get("/peserta?page=2");
    return response.data;
  }
);

// Thunk untuk menghapus peserta berdasarkan id
export const deletePesertaById = createAsyncThunk(
  "/peserta/delete",
  async (idPeserta, { rejectWithValue }) => {
    try {
      // Log ID peserta yang diterima
      console.log("ID Peserta yang akan dihapus:", idPeserta);

      // Menghapus peserta
      await axios.delete(`/peserta/${idPeserta}`);
      return idPeserta; // Mengembalikan idPeserta yang berhasil dihapus
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const pesertaSlice = createSlice({
  name: "peserta",
  initialState: {
    isLoading: false,
    peserta: [],
    error: null,
  },
  reducers: {
    addNewPeserta: (state, action) => {
      const { newPesertaObj } = action.payload;
      state.peserta = [...state.peserta, newPesertaObj];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPesertaContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPesertaContent.fulfilled, (state, action) => {
        state.peserta = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getPesertaContent.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePesertaById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePesertaById.fulfilled, (state, action) => {
        const idPeserta = action.payload;
        state.peserta = state.peserta.filter(
          (peserta) => peserta.id !== idPeserta
        );
        state.isLoading = false;
      })
      .addCase(deletePesertaById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Ekspor action dan reducer
export const { addNewPeserta } = pesertaSlice.actions;
export default pesertaSlice.reducer;
