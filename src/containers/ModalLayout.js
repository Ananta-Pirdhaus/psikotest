import { useEffect } from "react";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import AddLeadModalBody from "../features/leads/components/AddLeadModalBody";
import AddCampusModalBody from "../features/master/MasterKampus/components/AddCampusModalBody";
import AddSekolahModalBody from "../features/master/MasterPendidikan/components/AddSekolahModalBody";
import ViewDetailSekolah from "../features/master/MasterPendidikan/components/ViewSekolahModalBody";
import UpdateSekolah from "../features/master/MasterPendidikan/components/UpdateSekolahModalBody";
import AddBakatModalBody from "../features/master/MasterBakat/components/AddBakatModalBody";
import UpdateBakatModalBody from "../features/master/MasterBakat/components/updateBakatModalBody";
import ViewBakatModalBody from "../features/master/MasterBakat/components/viewBakatModalBody";
import AddProfesiModalBody from "../features/master/MasterProfesi/components/AddProfesiModalBody";
import ViewProfesiModalBody from "../features/master/MasterProfesi/components/ViewProfesiModalBody";
import UpdateProfesiModalBody from "../features/master/MasterProfesi/components/UpdateProfesiModalBody";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import JurusanModalAddModalBody from "../features/master/MasterJurusan/components/AddJurusanModalBody";
import ViewJurusanModalBody from "../features/master/MasterJurusan/components/ViewJurusanModalBody";
import UpdateJurusanModalBody from "../features/master/MasterJurusan/components/UpdateJurusanModalBody";
import AddKampusModalBody from "../features/master/MasterKampus/components/AddCampusModalBody";
import ViewKampusModalBody from "../features/master/MasterKampus/components/ViewKampusModalBody";
import AddSoalModalBody from "../features/master/MasterSoal/components/AddSoalModalBody";
import UpdateCampusModalBody from "../features/master/MasterKampus/components/UpdateKampusModalBody";
import AddVersiModalBody from "../features/master/MasterVersi/components/AddVersiModalBody";
import UpdateVersiModalBody from "../features/master/MasterVersi/components/UpdateVersiModalBody";
import UpdatePanduanModalBody from "../features/master/MasterPanduan/components/updatePanduan";
import UpdateSettingsModalBody from "../features/master/MasterSettings/components/updateSettings";

function ModalLayout() {
  const { isOpen, bodyType, size, extraObject, title } = useSelector(
    (state) => state.modal
  );
  const dispatch = useDispatch();

  const close = (e) => {
    dispatch(closeModal(e));
  };

  // Log extraObject for debugging
  useEffect(() => {
    console.log("extraObject:", extraObject); // Check the value of extraObject
  }, [extraObject]);

  // Fallback for missing extraObject
  const modalBodyProps = {
    closeModal: close,
    extraObject: extraObject || {}, // Provide a fallback empty object if extraObject is undefined or null
  };

  return (
    <>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div
          className={`modal-box ${
            size === "lg" ||
            bodyType === MODAL_BODY_TYPES.PANDUAN_UPDATE ||
            bodyType === MODAL_BODY_TYPES.SKILL_ADD_NEW ||
            bodyType === MODAL_BODY_TYPES.SKILL_UPDATE ||
            bodyType === MODAL_BODY_TYPES.SKILL_VIEW
              ? "max-w-6xl w-full sm:w-11/12 lg:w-10/12 max-h-[80vh] overflow-y-auto"
              : ""
          }`}
        >
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => close()}
          >
            ✕
          </button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.LEAD_ADD_NEW]: (
                <AddLeadModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SEKOLAH_ADD_NEW]: (
                <AddSekolahModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SEKOLAH_VIEW_DETAIL]: (
                <ViewDetailSekolah {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.UPDATE_SEKOLAH]: (
                <UpdateSekolah {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SKILL_ADD_NEW]: (
                <AddBakatModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SKILL_UPDATE]: (
                <UpdateBakatModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SKILL_VIEW]: (
                <ViewBakatModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.EDUCATION_ADD_NEW]: (
                <AddCampusModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.JURUSAN_ADD_NEW]: (
                <JurusanModalAddModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.JURUSAN_VIEW]: (
                <ViewJurusanModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.JURUSAN_UPDATE]: (
                <UpdateJurusanModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.ADD_PROFESI_NEW]: (
                <AddProfesiModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.VIEW_PROFESI]: (
                <ViewProfesiModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.UPDATE_PROFESI]: (
                <UpdateProfesiModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.KAMPUS_ADD_NEW]: (
                <AddKampusModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.KAMPUS_VIEW]: (
                <ViewKampusModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.KAMPUS_UPDATE]: (
                <UpdateCampusModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SOAL_ADD_NEW]: (
                <AddSoalModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.VERSI_ADD_NEW]: (
                <AddVersiModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.VERSI_UPDATE_NEW]: (
                <UpdateVersiModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.PANDUAN_UPDATE]: (
                <UpdatePanduanModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.SETTINGS_UPDATE]: (
                <UpdateSettingsModalBody {...modalBodyProps} />
              ),
              [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
            }[bodyType]
          }
        </div>
      </div>
    </>
  );
}

export default ModalLayout;
