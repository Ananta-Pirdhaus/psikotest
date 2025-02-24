import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import Select from "react-select"; // Import react-select
import { updateKampus, getJurusan } from "../kampuSlice"; // Correct import paths
import { showNotification } from "../../../common/headerSlice";

const INITIAL_KAMPUS_OBJ = {
  name: "",
  jurusan: [], // Array for selected "jurusan" (departments)
  status: "Active", // Array for selected "jurusan" (departments)
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
      setKampusDetail((prev) => ({
        ...prev,
        jurusan: extraObject.kampusDetail.jurusan.map((j) => j.id),
      }));
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
      console.log("Data:", kampusDetail);

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

  console.log(
    "Test: ",
    jurusanSelectOptions.filter(
      (option) => kampusDetail.jurusan.some((j) => j.id === option.value) // Match based on jurusan ID
    )
  );

  return (
    <>
      {kampusDetail ? (
        <>
          {/* <p className="text-gray-700">Kampus ID: {kampusId}</p> */}
          <InputText
            labelTitle="Name"
            type="text"
            defaultValue={kampusDetail.name || "Name not available"}
            containerStyle="mt-4"
            updateType="name"
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
                (option) => kampusDetail.jurusan.includes(option.value) // Match based on jurusan ID
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

          <div className="mt-4 flex items-center gap-2">
            <span>Status:</span>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                kampusDetail.status === "Active"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
              onClick={() =>
                updateFormValue({
                  updateType: "status",
                  value:
                    kampusDetail.status === "Active" ? "Inactive" : "Active",
                })
              }
            >
              {kampusDetail.status}
            </button>
          </div>

          {/* Show error message if no jurusan is selected */}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}

          <div className="modal-action">
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
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
