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
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Jurusan
            </label>
            <textarea
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              value={
                kampusDetail?.jurusan?.length
                  ? kampusDetail.jurusan
                      .map((jurusan) => jurusan.name)
                      .join(", ")
                  : "No jurusan listed"
              }
              disabled
              style={{ height: "253px" }}
            />
          </div>
        </>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
}

export default ViewKampusModalBody;
