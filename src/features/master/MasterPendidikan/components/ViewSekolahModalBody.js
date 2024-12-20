import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";

function ViewSekolahModalBody({ closeModal, extraObject }) {
  // If extraObject is passed correctly, use its data
  const [sekolahDetail, setSekolahDetail] = useState(extraObject);

  useEffect(() => {
    // Ensure the data is updated when extraObject changes
    if (extraObject) {
      setSekolahDetail(extraObject);
    }
  }, [extraObject]);

  return (
    <>
      {/* Check if sekolahDetail is available */}
      {sekolahDetail ? (
        <>
          <InputText
            type="text"
            defaultValue={sekolahDetail.name}
            updateType="name"
            containerStyle="mt-4"
            labelTitle="Name"
            disabled={true} // Disabled for view-only
          />
          <InputText
            type="text"
            defaultValue={sekolahDetail.level}
            updateType="level"
            containerStyle="mt-4"
            labelTitle="Level"
            disabled={true} // Disabled for view-only
          />
        </>
      ) : (
        <div>No data available</div>
      )}

      <div className="modal-action">
        {/* Tombol untuk membatalkan dan menutup modal */}
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Close
        </button>
      </div>
    </>
  );
}

export default ViewSekolahModalBody;
