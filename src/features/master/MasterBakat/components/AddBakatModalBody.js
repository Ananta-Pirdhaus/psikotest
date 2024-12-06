import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addNewBakatAsync } from "../bakatSlice"; // Menggunakan thunk yang sudah dibuat

const INITIAL_BAKAT_OBJ = {
  name: "",
  short_description: "",
  full_description: "",
  recommendation: "",
  icon: null, // Untuk file icon
};

function AddBakatModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bakatObj, setBakatObj] = useState(INITIAL_BAKAT_OBJ);

  const saveNewBakat = () => {
    if (bakatObj.name.trim() === "")
      return setErrorMessage("Name is required!");
    else if (!bakatObj.icon) return setErrorMessage("Icon is required!");

    // Membuat FormData untuk mengirimkan data termasuk file
    let formData = new FormData();
    formData.append("name", bakatObj.name);
    formData.append("short_description", bakatObj.short_description);
    formData.append("full_description", bakatObj.full_description);
    formData.append("recommendation", bakatObj.recommendation);
    formData.append("icon", bakatObj.icon); // Mengirimkan file icon

    // Mengaktifkan status loading saat permintaan dilakukan
    setLoading(true);

    // Dispatch action Redux untuk menambahkan bakat menggunakan thunk
    dispatch(addNewBakatAsync(formData))
      .then(() => {
        dispatch(showNotification({ message: "New Bakat Added!", status: 1 }));
        closeModal();
        setLoading(false); // Matikan loading setelah berhasil
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to add new bakat.");
        setLoading(false); // Matikan loading jika terjadi kesalahan
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    if (updateType === "icon") {
      // Jika yang diupdate adalah icon, simpan file-nya
      setBakatObj({ ...bakatObj, [updateType]: value[0] });
    } else {
      setBakatObj({ ...bakatObj, [updateType]: value });
    }
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={bakatObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={bakatObj.short_description}
        updateType="short_description"
        containerStyle="mt-4"
        labelTitle="Short Description"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={bakatObj.full_description}
        updateType="full_description"
        containerStyle="mt-4"
        labelTitle="Full Description"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={bakatObj.recommendation}
        updateType="recommendation"
        containerStyle="mt-4"
        labelTitle="Recommendation"
        updateFormValue={updateFormValue}
      />

      {/* Input file untuk Icon */}
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

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewBakat()}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddBakatModalBody;
