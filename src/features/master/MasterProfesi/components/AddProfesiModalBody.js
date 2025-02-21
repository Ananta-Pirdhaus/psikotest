import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addProfesi, fetchBakat } from "../profesiSlice";
import Select from "react-select"; // Import react-select

const INITIAL_PROFESI_OBJ = {
  name: "",
  bakat: [], // Array for selected "bakat"
};

function AddProfesiModalBody({ closeModal }) {
  const dispatch = useDispatch();

  // Get "bakatOptions" from Redux store
  const bakatOptions = useSelector((state) => state.profesi.selectBakatOptions);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profesiObj, setProfesiObj] = useState(INITIAL_PROFESI_OBJ);

  // Fetch "bakat" options if not available in Redux store
  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(fetchBakat());
    }
  }, [bakatOptions, dispatch]);

  const saveNewProfesi = () => {
    // Log tracking nilai profesiObj sebelum penyimpanan
    console.log("Profesi Object before save:", profesiObj);

    if (profesiObj.name.trim() === "") {
      setErrorMessage("Name is required!");
      return;
    } else if (profesiObj.bakat.length === 0) {
      setErrorMessage("At least one Bakat is required!");
      return;
    }

    // Membuat objek data JSON
    const payload = {
      name: profesiObj.name,
      bakat: profesiObj.bakat, // Ini adalah array bakat yang terpilih
    };

    // Log tracking nilai payload sebelum dikirimkan
    console.log("Payload before sending:", payload);

    setLoading(true);

    // Menggunakan axios atau fetch untuk mengirim data raw (JSON)
    dispatch(addProfesi(payload))
      .then((response) => {
        // Log hasil response dari action addProfesi
        console.log("Response from addProfesi:", response);

        dispatch(
          showNotification({ message: "New Profesi Added!", status: 1 })
        );
        closeModal();
        setLoading(false);
      })
      .catch((error) => {
        // Log error jika ada
        console.error("Error while adding profesi:", error);

        const errorDetails = error?.response?.data?.errors;
        if (errorDetails) {
          setErrorMessage(errorDetails.name?.[0] || errorDetails.bakat?.[0]);
        } else {
          setErrorMessage(error.message || "Failed to add new profesi.");
        }
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(`Updating ${updateType} with value:`, value); // Log perubahan input
    setErrorMessage(""); // Reset error message
    setProfesiObj({ ...profesiObj, [updateType]: value });
  };

  // Only render the component when bakatOptions are available
  // if (!bakatOptions || bakatOptions.length === 0) return <div>Loading...</div>;

  // Prepare options for react-select
  const bakatSelectOptions = bakatOptions.map((bakat) => ({
    value: bakat.value,
    label: bakat.label,
  }));

  return (
    <>
      <InputText
        type="text"
        value={profesiObj.name || ""} // Ensure it's always defined
        defaultValue={profesiObj.name || ""} // Add defaultValue for initial value
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        placeholder={"Nama Profesi"}
        updateFormValue={updateFormValue}
      />

      {/* Dropdown for selecting bakat using react-select */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Bakat</label>
        <Select
          isMulti
          options={bakatSelectOptions}
          value={bakatSelectOptions.filter((option) =>
            profesiObj.bakat.includes(option.value)
          )}
          onChange={(selectedOptions) =>
            updateFormValue({
              updateType: "bakat",
              value: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [], // Ensure bakat is always an array
            })
          }
          className="w-full"
          placeholder="Select Bakat"
        />
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewProfesi}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddProfesiModalBody;
