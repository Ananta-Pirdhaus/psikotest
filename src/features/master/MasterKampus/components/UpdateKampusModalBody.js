import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import Select from "react-select"; // Import react-select
import { updateKampus, getJurusan } from "../kampuSlice"; // Correct import paths
import { showNotification } from "../../../common/headerSlice";

const INITIAL_KAMPUS_OBJ = {
  name: "",
  rank: 1, // Default rank, can be modified
  jurusan: [], // Array for selected "jurusan" (departments)
};

function UpdateCampusModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const jurusanOptions = useSelector(
    (state) => state.kampus.selectJurusanOptions
  ); // Redux state for jurusan options
  const [kampusDetail, setKampusDetail] = useState(
    extraObject?.kampusDetail || INITIAL_KAMPUS_OBJ
  );
  const [kampusId, setKampusId] = useState(extraObject?.id || null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message for validation

  // Fetch jurusan options if not already fetched
  useEffect(() => {
    if (!jurusanOptions || jurusanOptions.length === 0) {
      dispatch(getJurusan()); // Dispatch action to fetch jurusan options
    }
  }, [jurusanOptions, dispatch]);

  // Syncing with extraObject prop
  useEffect(() => {
    if (extraObject) {
      setKampusDetail(extraObject.kampusDetail);
      setKampusId(extraObject.id);
    }
  }, [extraObject]);

  // Handling changes in input fields
  const updateFormValue = ({ updateType, value }) => {
    setKampusDetail((prev) => ({
      ...prev,
      [updateType]: value,
    }));
  };

  // Handling campus update with validation
  const handleUpdate = () => {
    if (!kampusDetail.jurusan || kampusDetail.jurusan.length === 0) {
      setErrorMessage("Please select at least one Jurusan."); // Show validation message
      return; // Prevent form submission if no jurusan is selected
    }

    setErrorMessage(""); // Clear previous error if jurusan is selected

    if (kampusDetail && kampusId) {
      setLoading(true);
      dispatch(updateKampus({ kampusId, kampusDetail }))
        .then((response) => {
          dispatch(
            showNotification({
              message: "Kampus updated successfully!",
              status: 1,
            })
          );
          closeModal(); // Close modal after successful update
        })
        .catch((error) => {
          dispatch(
            showNotification({ message: `Error: ${error.message}`, status: 0 })
          );
        })
        .finally(() => setLoading(false));
    } else {
      console.error("kampusId or kampusDetail is missing");
    }
  };

  // Mapping jurusan options for the select dropdown
  const jurusanSelectOptions = (jurusanOptions || []).map((jurusan) => ({
    label: jurusan.label, // Assuming 'label' is available in the data
    value: jurusan.value, // Assuming 'value' is available in the data
  }));

  return (
    <>
      {kampusDetail ? (
        <>
          <p className="text-gray-700">Kampus ID: {kampusId}</p>
          <InputText
            labelTitle="Name"
            type="text"
            defaultValue={kampusDetail.name || "Name not available"}
            containerStyle="mt-4"
            updateType="name"
            updateFormValue={updateFormValue}
          />

          <InputText
            labelTitle="Rank"
            type="text"
            defaultValue={kampusDetail.rank || "Rank not available"}
            containerStyle="mt-4"
            updateType="rank"
            updateFormValue={updateFormValue}
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Jurusan
            </label>
            <Select
              isMulti
              options={jurusanSelectOptions}
              value={jurusanSelectOptions.filter(
                (option) => kampusDetail.jurusan?.includes(option.value) // Match based on jurusan ID
              )}
              onChange={(selectedOptions) =>
                updateFormValue({
                  updateType: "jurusan",
                  value: selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : [], // Ensure jurusan is always an array
                })
              }
              className="w-full"
              placeholder="Select Jurusan"
            />
          </div>

          {/* Show error message if no jurusan is selected */}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
}

export default UpdateCampusModalBody;
