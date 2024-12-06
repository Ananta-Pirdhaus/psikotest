import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { updateBakatInState } from "../bakatSlice"; // Redux thunk for updating bakat

const INITIAL_BAKAT_OBJ = {
  id: "",
  name: "",
  short_description: "",
  full_description: "",
  recommendation: "",
  icon: null, // For the icon file
};

function UpdateBakatModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bakatObj, setBakatObj] = useState(INITIAL_BAKAT_OBJ);

  // Use useEffect to populate form fields with data from extraObject when available
  useEffect(() => {
    if (extraObject) {
      console.log("Extra object received:", extraObject); // Debugging line
      setBakatObj({
        id: extraObject.id || "", // Ensure ID is set properly
        name: extraObject.name || "",
        short_description: extraObject.short_description || "",
        full_description: extraObject.full_description || "",
        recommendation: extraObject.recommendation || "",
        icon: extraObject.icon || null, // Ensure icon is set correctly
      });
    }
  }, [extraObject]); // Re-run when extraObject changes

  const updateBakat = () => {
    // Validation before submission
    if (bakatObj.name.trim() === "") {
      return setErrorMessage("Name is required!");
    }
    if (!bakatObj.icon) {
      return setErrorMessage("Icon is required!");
    }

    // Prepare the form data for submission
    let formData = new FormData();
    formData.append("id", bakatObj.id); // Add ID to the form data
    formData.append("name", bakatObj.name);
    formData.append("short_description", bakatObj.short_description);
    formData.append("full_description", bakatObj.full_description);
    formData.append("recommendation", bakatObj.recommendation);
    formData.append("icon", bakatObj.icon); // Sending the icon file

    // Dispatch the update action
    setLoading(true);

    dispatch(updateBakatInState(formData))
      .then(() => {
        dispatch(showNotification({ message: "Bakat Updated!", status: 1 }));
        closeModal(); // Close the modal on success
        setLoading(false); // Reset loading state
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to update bakat.");
        setLoading(false); // Reset loading state on failure
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage(""); // Reset the error message when a field changes
    if (updateType === "icon") {
      setBakatObj({ ...bakatObj, [updateType]: value[0] }); // Handle file input
    } else {
      setBakatObj({ ...bakatObj, [updateType]: value }); // Handle other inputs
    }
  };

  return (
    <>
      <InputText
        type="text"
        value={bakatObj.name || ""} // Set default value from bakatObj
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        value={bakatObj.short_description || ""} // Set default value from bakatObj
        updateType="short_description"
        containerStyle="mt-4"
        labelTitle="Short Description"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        value={bakatObj.full_description || ""} // Set default value from bakatObj
        updateType="full_description"
        containerStyle="mt-4"
        labelTitle="Full Description"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        value={bakatObj.recommendation || ""} // Set default value from bakatObj
        updateType="recommendation"
        containerStyle="mt-4"
        labelTitle="Recommendation"
        updateFormValue={updateFormValue}
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            updateFormValue({ updateType: "icon", value: e.target.files })
          }
          className="file-input file-input-bordered file-input-primary w-full"
        />
      </div>

      {errorMessage && <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>}

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={updateBakat}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

export default UpdateBakatModalBody;
