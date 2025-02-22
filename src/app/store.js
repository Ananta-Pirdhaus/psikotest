import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import leadsSlice from "../features/leads/leadSlice";
import educationSlice from "../features/master/MasterPendidikan/sekolahSlice"; // Tambahkan ini
import MasterJurusanSlice from "../features/master/MasterJurusan/jurusanSlice"; // Tambahkan ini
import MasterRegion from "../features/master/MasteRegion/regionSlice"; // Tambahkan ini
import MasterProfesi from "../features/master/MasterProfesi/profesiSlice";
import MasterBakat from "../features/master/MasterBakat/bakatSlice";
import MasterKelas from "../features/master/MasterKelas/kelasSlice";
import MasterKampus from "../features/master/MasterKampus/kampuSlice";
import MasterSoal from "../features/master/MasterSoal/soalSlice";
import MasterVersion from "../features/master/MasterVersi/versiSlice";
import MasterPanduan from "../features/master/MasterPanduan/panduanSlice";
import MasterSettings from "../features/master/MasterSettings/settingSlice"; // Tambahkan ini
import MasterUser from "../features/master/MasterUsers/userSlice"; // Tambahkan ini
import HasilQuiz from "../features/hasil/HasilQuiz/hasilQuizSlice"; // Tambahkan ini

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  peserta: leadsSlice,
  sekolah: educationSlice, // Tambahkan reducer ini
  jurusan: MasterJurusanSlice, // Tambahkan reducer ini
  region: MasterRegion, // Tambahkan reducer ini
  profesi: MasterProfesi, // Tambahkan reducer ini
  bakat: MasterBakat, // Tambahkan reducer ini
  kelas: MasterKelas, // Tambahkan reducer ini
  kampus: MasterKampus, // Tambahkan reducer ini
  soal: MasterSoal, // Tambahkan reducer ini
  versi: MasterVersion, // Tambahkan reducer ini
  panduan: MasterPanduan, // Tambahkan reducer ini
  settings: MasterSettings, // Tambahkan reducer ini
  users: MasterUser, // Tambahkan reducer ini
  hasilQuiz: HasilQuiz, // Tambahkan reducer ini
};

export default configureStore({
  reducer: combinedReducer,
});
