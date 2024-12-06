import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";

function ViewBakatModalBody({ closeModal, extraObject }) {
  // If extraObject is passed correctly, use its data
  const [bakatDetail, setBakatDetail] = useState(extraObject);

  useEffect(() => {
    // Ensure the data is updated when extraObject changes
    if (extraObject) {
      setBakatDetail(extraObject);
    }
  }, [extraObject]);

  const getIconUrl = (icon) => {
    // Check if icon is a Blob/File or a URL string
    if (icon instanceof Blob || icon instanceof File) {
      return URL.createObjectURL(icon);
    } else if (typeof icon === "string" && icon.trim() !== "") {
      return icon; // If it's a URL or image path, return it directly
    }
    return ""; // Fallback for invalid or missing icon
  };

  return (
    <>
      {/* Check if bakatDetail is available */}
      {bakatDetail ? (
        <>
          <InputText
            type="text"
            defaultValue={bakatDetail.name}
            updateType="name"
            containerStyle="mt-4"
            labelTitle="Name"
            disabled={true}
          />
          <InputText
            type="text"
            defaultValue={bakatDetail.short_description}
            updateType="short_description"
            containerStyle="mt-4"
            labelTitle="Short Description"
            disabled={true}
          />
          <InputText
            type="text"
            defaultValue={bakatDetail.full_description}
            updateType="full_description"
            containerStyle="mt-4"
            labelTitle="Full Description"
            disabled={true}
          />
          <InputText
            type="text"
            defaultValue={bakatDetail.recommendation}
            updateType="recommendation"
            containerStyle="mt-4"
            labelTitle="Recommendation"
            disabled={true}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <img
              src={getIconUrl(bakatDetail.icon)} // Use the getIconUrl function to handle icon safely
              alt="Icon"
              className="w-24 h-24 object-cover"
            />
          </div>
        </>
      ) : (
        <div>No data available</div>
      )}

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Close
        </button>
      </div>
    </>
  );
}

export default ViewBakatModalBody;
