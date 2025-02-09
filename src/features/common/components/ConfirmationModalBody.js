import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_CLOSE_TYPES,
} from "../../../utils/globalConstantUtil";
import { deletePesertaById } from "../../leads/leadSlice";
import { deleteSesiById } from "../../hasil/HasilQuiz/hasilQuizSlice";
import { deleteSekolah } from "../../master/MasterPendidikan/sekolahSlice";
import { deleteKampus } from "../../master/MasterKampus/kampuSlice";
import { deleteJurusan } from "../../master/MasterJurusan/jurusanSlice";
import { deleteProfesi } from "../../master/MasterProfesi/profesiSlice";
import { deleteBakat } from "../../master/MasterBakat/bakatSlice";
import { showNotification } from "../headerSlice";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, id, index } = extraObject;

  const proceedWithYes = async () => {
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
      dispatch(deletePesertaById(id));
      dispatch(showNotification({ message: "Peserta Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SESI_DELETE) {
      dispatch(deleteSesiById(id));
      dispatch(showNotification({ message: "Sesi Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SEKOLAH_DELETE) {
      dispatch(deleteSekolah(id));
      dispatch(showNotification({ message: "Sekolah Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.CAMPUS_DELETE) {
      dispatch(deleteKampus(id));
      dispatch(showNotification({ message: "Kampus Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.JURUSAN_DELETE) {
      dispatch(deleteJurusan(id));
      dispatch(showNotification({ message: "Jurusan Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.PROFESI_DELETE) {
      dispatch(deleteProfesi(id));
      dispatch(showNotification({ message: "Profesi Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SKILL_DELETE) {
      dispatch(deleteBakat(id));
      dispatch(showNotification({ message: "Bakat Deleted!", status: 1 }));
    }

    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Yes
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
