import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";

function ViewProfesiModalBody({ closeModal, extraObject }) {
  // Extract and initialize the profesi detail from the correct structure
  const [profesiDetail, setProfesiDetail] = useState(
    extraObject?.profesi || null
  );

  useEffect(() => {
    // Log the extraObject and profesiDetail to check the received data
    console.log("Received extraObject:", extraObject);

    // Update profesiDetail when extraObject changes
    if (extraObject && extraObject.profesi) {
      setProfesiDetail(extraObject.profesi);
    }
  }, [extraObject]);

  return (
    <>
      {/* Check if profesiDetail is available */}
      {profesiDetail ? (
        <>
          <InputText
            type="text"
            defaultValue={profesiDetail.name}
            updateType="name"
            containerStyle="mt-4"
            labelTitle="Name"
            disabled={true} // Disabled for view-only
          />
          <InputText
            type="text"
            defaultValue={
              profesiDetail.bakat?.join(", ") ||
              "Tidak ada bakat yang terdaftar"
            }
            updateType="description"
            containerStyle="mt-4"
            labelTitle="Description"
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

export default ViewProfesiModalBody;
