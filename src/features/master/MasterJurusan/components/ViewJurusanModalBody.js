import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";

function ViewJurusanModalBody({ closeModal, extraObject }) {
  // Extract and initialize the jurusan detail from the correct structure
  const [jurusanDetail, setJurusanDetail] = useState(
    extraObject?.jurusanDetail || null
  );

  useEffect(() => {
    // Update jurusanDetail when extraObject changes
    if (extraObject && extraObject.jurusanDetail) {
      setJurusanDetail(extraObject.jurusanDetail);
    }
  }, [extraObject]);

  return (
    <>
      {/* Check if jurusanDetail is available */}
      {jurusanDetail ? (
        <>
          <InputText
            type="text"
            defaultValue={jurusanDetail.name}
            updateType="name"
            containerStyle="mt-4"
            labelTitle="Name"
            disabled={true} // Disabled for view-only
          />
          <InputText
            type="text"
            defaultValue={jurusanDetail.bakat.map((b) => b.name).join(", ")}
            updateType="bakat"
            containerStyle="mt-4"
            labelTitle="Bakat"
            disabled={true} // Disabled for view-only
          />
        </>
      ) : (
        <div>No data available</div>
      )}

      <div className="modal-action">
        {/* Button to close the modal */}
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Close
        </button>
      </div>
    </>
  );
}

export default ViewJurusanModalBody;
