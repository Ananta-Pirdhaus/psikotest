import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addSekolah } from "../sekolahSlice"; // Action untuk menambahkan sekolah

const INITIAL_SEKOLAH_OBJ = {
  name: "",
  level: "SMP", // Default level adalah "SMP"
};

function AddSekolahModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Initial state as a string
  const [sekolahObj, setSekolahObj] = useState(INITIAL_SEKOLAH_OBJ);

  const saveNewSekolah = () => {
    if (sekolahObj.name.trim() === "") {
      return setErrorMessage("Name is required!");
    } else if (!["SMP", "SMA"].includes(sekolahObj.level)) {
      return setErrorMessage("Level must be either SMP or SMA!");
    }

    // Data yang akan dikirim sebagai JSON (raw)
    const requestData = {
      name: sekolahObj.name,
      level: sekolahObj.level,
    };

    // Mengaktifkan status loading saat permintaan dilakukan
    setLoading(true);

    // Dispatch action Redux untuk menambahkan sekolah
    dispatch(addSekolah(requestData))
      .then((response) => {
        // Check if there's any error in the response
        if (response.status === "error") {
          // Handle validation errors
          const errorMessages = [];

          // Loop through errors and add them to the errorMessages array
          if (response.errors) {
            for (const field in response.errors) {
              if (response.errors[field].length > 0) {
                errorMessages.push(response.errors[field][0]); // Display first error message for each field
              }
            }
          }

          // Combine general message and field-specific errors
          setErrorMessage(response.message + ": " + errorMessages.join(", "));
        } else {
          // Dispatch success notification
          dispatch(
            showNotification({ message: "New School Added!", status: 1 })
          );
          closeModal();
        }
        setLoading(false); // Matikan loading setelah berhasil
      })
      .catch((error) => {
        setErrorMessage(
          typeof error.message === "string"
            ? error.message
            : "Failed to add new school."
        );
        setLoading(false); // Matikan loading jika terjadi kesalahan
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage(""); // Clear any error message
    setSekolahObj({ ...sekolahObj, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={sekolahObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Nama Sekolah"
        updateFormValue={updateFormValue}
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <select
          value={sekolahObj.level}
          onChange={(e) =>
            updateFormValue({ updateType: "level", value: e.target.value })
          }
          className="select select-bordered w-full bg-white"
        >
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
        </select>
      </div>

      {/* Display Error Message if Exists */}
      <ErrorText styleClass="mt-4">
        {typeof errorMessage === "string" ? errorMessage : ""}
      </ErrorText>

      {/* Modal Actions */}
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewSekolah()}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddSekolahModalBody;
