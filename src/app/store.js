import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import leadsSlice from "../features/leads/leadSlice";
import educationSlice from "../features/master/MasterPendidikan/pendidikanSlice"; // Tambahkan ini
import MasterJurusanSlice from "../features/master/MasterJurusan/jurusanSlice"; // Tambahkan ini
import MasterRegion from "../features/master/MasteRegion/regionSlice"; // Tambahkan ini
import MasterProfesi from "../features/master/MasterProfesi/profesiSlice";
import MasterSuccess from "../features/master/MasterSuccess/succesSlice";
import MasterBakat from "../features/master/MasterBakat/bakatSlice";
import MasterKelas from "../features/master/MasterKelas/kelasSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  lead: leadsSlice,
  education: educationSlice, // Tambahkan reducer ini
  jurusan: MasterJurusanSlice, // Tambahkan reducer ini
  region: MasterRegion, // Tambahkan reducer ini
  profesi: MasterProfesi, // Tambahkan reducer ini
  orangSukses: MasterSuccess, // Tambahkan reducer ini
  bakat: MasterBakat, // Tambahkan reducer ini
  kelas: MasterKelas, // Tambahkan reducer ini
};

export default configureStore({
  reducer: combinedReducer,
});
