import { useDispatch } from "react-redux";
import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
import { deletePesertaById } from "../../leads/leadSlice";
import { deleteSesiById } from "../../hasil/HasilQuiz/hasilQuizSlice";
import { deleteSekolah } from "../../master/MasterPendidikan/sekolahSlice";
import { deleteKampus } from "../../master/MasterKampus/kampuSlice";
import { deleteJurusan } from "../../master/MasterJurusan/jurusanSlice";
import { deleteProfesi } from "../../master/MasterProfesi/profesiSlice";
import { deleteBakat } from "../../master/MasterBakat/bakatSlice";
import { deleteVersiPertanyaan } from "../../master/MasterVersi/versiSlice";
import { showNotification } from "../headerSlice";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const { message, type, id } = extraObject;

  const proceedWithYes = async () => {
    try {
      if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
        await dispatch(deletePesertaById(id)).unwrap();
        dispatch(showNotification({ message: "Peserta Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SESI_DELETE) {
        await dispatch(deleteSesiById(id)).unwrap();
        dispatch(showNotification({ message: "Sesi Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SEKOLAH_DELETE) {
        await dispatch(deleteSekolah(id)).unwrap();
        dispatch(showNotification({ message: "Sekolah Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.CAMPUS_DELETE) {
        await dispatch(deleteKampus(id)).unwrap();
        dispatch(showNotification({ message: "Kampus Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.JURUSAN_DELETE) {
        await dispatch(deleteJurusan(id)).unwrap();
        dispatch(showNotification({ message: "Jurusan Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.PROFESI_DELETE) {
        await dispatch(deleteProfesi(id)).unwrap();
        dispatch(showNotification({ message: "Profesi Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.SKILL_DELETE) {
        await dispatch(deleteBakat(id)).unwrap();
        dispatch(showNotification({ message: "Bakat Deleted!", status: 1 }));
      } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.VERSI_DELETE) {
        await dispatch(deleteVersiPertanyaan(id)).unwrap();
        dispatch(showNotification({ message: "Versi Deleted!", status: 1 }));
      }

      closeModal();
    } catch (error) {
      dispatch(
        showNotification({ message: `Error: ${error.message}`, status: 0 })
      );
    }
  };

  return (
    <>
      <p className="text-xl mt-8 text-center">{message}</p>

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
