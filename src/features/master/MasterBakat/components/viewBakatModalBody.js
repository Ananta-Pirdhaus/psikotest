import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

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
            defaultValue={bakatDetail?.name} // Pastikan bakatDetail tidak undefined
            updateType="name"
            containerStyle="mt-4 text-black font-semibold"
            labelTitle="Name"
            disabled={true}
          />

          <InputText
            type="text"
            defaultValue={bakatDetail.short_description}
            updateType="short_description"
            containerStyle="mt-4 text-black font-semibold"
            labelTitle="Short Description"
            disabled={true}
          />

          <div className="mt-4">
            <label className="font-semibold">Full Description:</label>
            <div
              className="input input-bordered w-full bg-white text-black py-2 min-h-[40px] h-auto"
              disabled
            >
              {parse(DOMPurify.sanitize(bakatDetail.full_description))}
            </div>
          </div>

          <div className="mt-4">
            <label className="font-semibold">Recommendation:</label>
            <div
              className="input input-bordered w-full bg-white text-black py-2 min-h-[40px] h-auto"
              disabled
            >
              {parse(DOMPurify.sanitize(bakatDetail.recommendation))}
            </div>
          </div>

          {bakatDetail.icon ? (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Icon
              </label>
              <img
                src={getIconUrl(bakatDetail.icon)}
                alt="Icon"
                className="w-24 h-24 object-cover"
              />
            </div>
          ) : (
            <InputText
              type="text"
              defaultValue="Icon"
              updateType="icon"
              containerStyle="mt-4 text-black font-semibold"
              labelTitle="Icon tidak ditemukan"
              disabled={true}
            />
          )}
        </>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
}

export default ViewBakatModalBody;
