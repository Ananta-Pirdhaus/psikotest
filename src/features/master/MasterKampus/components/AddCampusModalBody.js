import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addKampus, getJurusan } from "../kampuSlice";
import Select from "react-select"; // Import react-select

const INITIAL_KAMPUS_OBJ = {
  name: "",
  rank: 1, // Default rank, can be modified
  jurusan: [], // Array for selected "jurusan" (departments)
  status: "Active", // Array for selected "jurusan" (departments)
};

function AddKampusModalBody({ closeModal }) {
  const dispatch = useDispatch();

  // Get "jurusanOptions" from Redux store
  const jurusanOptions = useSelector(
    (state) => state.kampus.selectJurusanOptions
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [kampusObj, setKampusObj] = useState(INITIAL_KAMPUS_OBJ);
  const [newKampusObj, setNewKampusObj] = useState(null); // New state for validated object

  // Fetch "jurusan" options if not available in Redux store
  useEffect(() => {
    if (!jurusanOptions || jurusanOptions.length === 0) {
      dispatch(getJurusan());
    }
  }, [jurusanOptions, dispatch]);

  const saveNewKampus = () => {
    // Log tracking nilai kampusObj sebelum penyimpanan
    console.log("Kampus Object before save:", kampusObj);

    // Validate kampusObj and prepare newKampusObj
    if (kampusObj.name.trim() === "") {
      setErrorMessage("Name is required!");
      return;
    } else if (kampusObj.jurusan.length === 0) {
      setErrorMessage("At least one Jurusan is required!");
      return;
    } else if (isNaN(kampusObj.rank) || kampusObj.rank <= 0) {
      setErrorMessage("Rank must be a positive integer!");
      return;
    }

    // Create the validated newKampusObj
    const validatedKampusObj = {
      name: kampusObj.name,
      rank: parseInt(kampusObj.rank), // Ensure rank is an integer
      jurusan: kampusObj.jurusan, // Array of selected jurusan IDs
      status: kampusObj.status, // Array of selected jurusan IDs
    };

    // Update the newKampusObj state with the validated data
    setNewKampusObj(validatedKampusObj);

    // Log tracking nilai payload sebelum dikirimkan
    console.log("Validated Payload before sending:", validatedKampusObj);

    setLoading(true);

    // Menggunakan axios atau fetch untuk mengirim data raw (JSON)
    dispatch(addKampus(validatedKampusObj))
      .then((response) => {
        // Log hasil response dari action addKampus
        console.log("Response from addKampus:", response);

        dispatch(showNotification({ message: "New Kampus Added!", status: 1 }));
        closeModal();
        setLoading(false);
      })
      .catch((error) => {
        // Log error jika ada
        console.error("Error while adding kampus:", error);

        const errorDetails = error?.response?.data?.errors;
        if (errorDetails) {
          setErrorMessage(errorDetails.name?.[0] || errorDetails.jurusan?.[0]);
        } else {
          setErrorMessage(error.message || "Failed to add new kampus.");
        }
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(`Updating ${updateType} with value:`, value); // Log perubahan input
    setErrorMessage(""); // Reset error message
    setKampusObj({ ...kampusObj, [updateType]: value });
  };

  // Render loading message while jurusanOptions is not available
  // if (!jurusanOptions || jurusanOptions.length === 0) {
  //   return <div>Loading...</div>;
  // }

  // If there is an error message for jurusan, display it
  if (errorMessage === "Jurusan tidak tersedia") {
    return <div className="text-red-500 mt-4">Jurusan tidak tersedia</div>;
  }

  // Prepare options for react-select
  const jurusanSelectOptions = jurusanOptions.map((jurusan) => ({
    value: jurusan.value,
    label: jurusan.label,
  }));

  return (
    <>
      <InputText
        type="text"
        value={kampusObj.name || ""} // Ensure it's always defined
        defaultValue={kampusObj.name || ""} // Add defaultValue for initial value
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
        placeholder={"Nama Kampus"}
      />

      <InputText
        type="number"
        value={kampusObj.rank || 1} // Ensure it's always defined
        defaultValue={kampusObj.rank || 1} // Add defaultValue for initial value
        updateType="rank"
        containerStyle="mt-4"
        labelTitle="Rank"
        updateFormValue={updateFormValue}
        placeholder={"Ranking Kampus"}
      />

      {/* Dropdown for selecting jurusan using react-select */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Jurusan
        </label>
        <Select
          isMulti
          options={jurusanSelectOptions}
          value={jurusanSelectOptions.filter((option) =>
            kampusObj.jurusan.includes(option.value)
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

      <InputText
        type="text"
        value={kampusObj.status || "Active"} // Ensure it's always defined
        defaultValue={kampusObj.status || "Active"} // Add defaultValue for initial value
        updateType="status"
        containerStyle="mt-4"
        labelTitle="Status"
        updateFormValue={updateFormValue}
        placeholder={"Status Kampus"}
      />

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewKampus}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddKampusModalBody;
