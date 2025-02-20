import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL dari environment variable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Menambahkan header Authorization dengan token dari localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fungsi untuk mengambil data bakat
export const fetchBakat = createAsyncThunk(
  "bakat/fetchBakat",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("bakat"); // Ganti dengan endpoint API yang sesuai
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan"
      );
    }
  }
);

// Fungsi untuk menambahkan bakat baru
export const addNewBakatAsync = createAsyncThunk(
  "bakat/addNewBakatAsync",
  async (newBakat, thunkAPI) => {
    try {
      const response = await axios.post("bakat", newBakat); // Ganti dengan endpoint API yang sesuai
      return response.data.data; // Mengembalikan data bakat yang baru ditambahkan
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat menambahkan bakat"
      );
    }
  }
);

// Fungsi untuk memperbarui data bakat
export const updateBakatAsync = createAsyncThunk(
  "bakat/updateBakatAsync",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `bakat/${formData.get("id")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Pastikan backend menerima FormData
          },
        }
      );
      return response.data.data; // Mengembalikan data yang diperbarui
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat memperbarui bakat"
      );
    }
  }
);

// Fungsi untuk mendapatkan detail bakat berdasarkan ID
export const showBakatDetail = createAsyncThunk(
  "bakat/showBakatDetail",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`bakat/${id}`);
      return response.data.data; // Mengembalikan data detail bakat
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat mengambil detail bakat"
      );
    }
  }
);

// Fungsi untuk menghapus bakat berdasarkan ID
export const deleteBakat = createAsyncThunk(
  "bakat/deleteBakat",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/bakat/${id}`); // Pastikan path sesuai
      return id; // Mengembalikan ID bakat yang dihapus
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Terjadi kesalahan saat menghapus bakat"
      );
    }
  }
);

const initialState = {
  bakat: [], // Daftar bakat
  detailBakat: null, // Untuk menyimpan detail bakat yang dipilih
  status: "idle", // Status pemanggilan API: idle | loading | succeeded | failed
  error: null, // Untuk menyimpan pesan error jika ada
};

const bakatSlice = createSlice({
  name: "bakat",
  initialState,
  reducers: {
    getBakatContent(state, action) {
      state.bakat = action.payload || [];
    },
    importBakatData(state, action) {
      if (Array.isArray(action.payload)) {
        state.bakat = [...state.bakat, ...action.payload];
      }
    },
    addNewBakat(state, action) {
      if (Array.isArray(state.bakat)) {
        state.bakat.push(action.payload);
      }
    },

    deleteBakatFromState(state, action) {
      state.bakat = state.bakat.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bakat
      .addCase(fetchBakat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBakat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bakat = action.payload; // Perbarui state `bakat` dengan data dari API
      })
      .addCase(fetchBakat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add New Bakat
      .addCase(addNewBakatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewBakatAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bakat.push(action.payload); // Menambahkan bakat yang baru ke dalam array
      })
      .addCase(addNewBakatAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Bakat
      .addCase(updateBakatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBakatAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bakat = state.bakat.map((bakat) =>
          bakat.id === action.payload.id ? action.payload : bakat
        ); // Update bakat yang sesuai dengan ID
        state.error = null;
      })
      .addCase(updateBakatAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Simpan error jika request gagal
      })

      // Show Detail Bakat
      .addCase(showBakatDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(showBakatDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detailBakat = action.payload; // Menyimpan detail bakat di state
      })
      .addCase(showBakatDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Bakat
      .addCase(deleteBakat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBakat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bakat = state.bakat.filter(
          (bakat) => bakat.id !== action.payload
        ); // Menghapus bakat berdasarkan ID
      })
      .addCase(deleteBakat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  getBakatContent,
  importBakatData,
  addNewBakat,
  deleteBakatFromState,
} = bakatSlice.actions;

export default bakatSlice.reducer;
