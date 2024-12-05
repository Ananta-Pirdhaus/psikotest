import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profesi: [], // Array profesi kosong untuk memuat data profesi
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
    addProfesi(state, action) {
      const newProfesi = action.payload;
      if (
        !state.profesi.some((p) => p.NamaProfesi === newProfesi.NamaProfesi)
      ) {
        state.profesi.push(newProfesi);
      }
    },
    importProfesiData(state, action) {
      const profesiData = Array.isArray(action.payload) ? action.payload : [];
      state.profesi = [...state.profesi, ...profesiData];
    },
  },
});

export const {
  getProfesiContent,
  deleteProfesi,
  addProfesi,
  importProfesiData,
} = profesiSlice.actions;

export default profesiSlice.reducer;
