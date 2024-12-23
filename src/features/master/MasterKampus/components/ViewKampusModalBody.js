import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";

function ViewKampusModalBody({ closeModal, extraObject }) {
  const [kampusDetail, setKampusDetail] = useState(extraObject?.kampus || null);

  useEffect(() => {
    // Log the extraObject and kampusDetail to check the received data
    console.log("Received extraObject:", extraObject);

    // Update kampusDetail when extraObject changes
    if (extraObject && extraObject.kampusDetail) {
      setKampusDetail(extraObject.kampusDetail); // Change 'kampus' to 'kampusDetail'
    }
  }, [extraObject]);

  return (
    <>
      {/* Check if kampusDetail is available */}
      {kampusDetail ? (
        <>
          <InputText
            type="text"
            defaultValue={kampusDetail.name || "Name not available"}
            updateType="name"
            containerStyle="mt-4"
            labelTitle="Name"
            disabled={true} // Disabled for view-only
          />
          <InputText
            type="text"
            defaultValue={kampusDetail.rank || "rank not available"}
            updateType="rank"
            containerStyle="mt-4"
            labelTitle="Rank"
            disabled={true} // Disabled for view-only
          />
          <InputText
            type="text"
            defaultValue={
              kampusDetail.jurusan?.length > 0
                ? kampusDetail.jurusan.join(", ")
                : "No jurusan listed"
            }
            updateType="jurusan"
            containerStyle="mt-4"
            labelTitle="Jurusan"
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

export default ViewKampusModalBody;
