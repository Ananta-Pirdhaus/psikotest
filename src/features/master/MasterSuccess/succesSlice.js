import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orangSukses: [], // Data awal untuk master Orang Sukses
};

const orangSuksesSlice = createSlice({
  name: "orangSukses",
  initialState,
  reducers: {
    importOrangSukses(state, action) {
      state.orangSukses = [...state.orangSukses, ...action.payload];
    },
    deleteOrangSukses(state, action) {
      const index = action.payload;
      state.orangSukses = state.orangSukses.filter((_, i) => i !== index);
    },
  },
});

export const { importOrangSukses, deleteOrangSukses } =
  orangSuksesSlice.actions;

export default orangSuksesSlice.reducer;
