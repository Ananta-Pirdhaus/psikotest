import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL // Gunakan variabel dari .env saat development
    : process.env.REACT_APP_PRODUCTION_URL; // Gunakan URL produksi dari .env

// Fungsi untuk mengambil daftar provinces
export const fetchProvinces = createAsyncThunk(
  "region/fetchProvinces",
  async () => {
    const response = await axios.get("region/provinces");
    return response.data; // Mengembalikan data provinces
  }
);

// Fungsi untuk mengambil daftar regencies berdasarkan province ID
// Fungsi untuk mengambil daftar regencies berdasarkan province ID
export const fetchRegencies = createAsyncThunk(
  "region/fetchRegencies",
  async (provinceId) => {
    const response = await axios.get("region/regencies", {
      params: provinceId ? { province: provinceId } : {}, // Jika ada provinceId, kirimkan sebagai parameter
    });

    // Memodifikasi data yang diterima untuk menambahkan provinceId pada setiap regency
    const regenciesWithProvinceId = response.data.data.map((regency) => ({
      ...regency, // Menyalin data regency
      provinceId: provinceId, // Menambahkan provinceId ke setiap regency
    }));

    return {
      provinceId, // Kembalikan provinceId agar bisa digunakan
      regencies: regenciesWithProvinceId, // Kembalikan daftar regencies yang sudah dimodifikasi
    };
  }
);

// Fungsi untuk menghapus region berdasarkan ID
export const deleteRegion = createAsyncThunk(
  "region/deleteRegion",
  async (regionId) => {
    const response = await axios.delete(`/region/${regionId}`);
    return regionId; // Mengembalikan ID region yang berhasil dihapus
  }
);

const initialState = {
  provinces: [], // Ensure this is an empty array initially
  regencies: [],
};

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Mengatur loading dan error state saat melakukan fetch provinces
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload; // Menyimpan provinces
        console.log("Fetched Provinces:", action.payload); // Memastikan data diterima
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Mengatur loading dan error state saat melakukan fetch regencies
      .addCase(fetchRegencies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegencies.fulfilled, (state, action) => {
        state.loading = false;
        // Menyimpan regencies yang sudah dimodifikasi dengan provinceId
        state.regencies = action.payload.regencies;
        state.provinceId = action.payload.provinceId; // Menyimpan provinceId
        console.log("Fetched Regencies:", action.payload.regencies); // Memastikan data diterima
      })
      .addCase(fetchRegencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Mengatur loading, sukses, dan error state saat menghapus region
      .addCase(deleteRegion.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null; // Reset error
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Menghapus region yang dihapus berdasarkan ID
        state.provinces = state.provinces.filter(
          (province) => province.id !== action.payload
        );
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.error.message;
      });
  },
});

export default regionSlice.reducer;
export const { actions: regionActions } = regionSlice; // Export the actions
