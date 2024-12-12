import { useEffect } from "react";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import AddLeadModalBody from "../features/leads/components/AddLeadModalBody";
import AddCampusModalBody from "../features/master/MasterKampus/components/AddCampusModalBody";
import AddBakatModalBody from "../features/master/MasterBakat/components/AddBakatModalBody";
import UpdateBakatModalBody from "../features/master/MasterBakat/components/updateBakatModalBody";
import ViewBakatModalBody from "../features/master/MasterBakat/components/viewBakatModalBody";
import AddProfesiModalBody from "../features/master/MasterProfesi/components/AddProfesiModalBody";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";

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
        <div className={`modal-box ${size === "lg" ? "max-w-5xl" : ""}`}>
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
              [MODAL_BODY_TYPES.PROFESI_ADD_NEW]: (
                <AddProfesiModalBody {...modalBodyProps} />
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
              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModalBody {...modalBodyProps} />
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
