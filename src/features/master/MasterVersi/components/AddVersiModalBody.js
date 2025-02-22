import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addVersiPertanyaan } from "../versiSlice";

const INITIAL_VERSI_OBJ = {
  name: "",
  status: "Active",
};

function AddVersiModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [versiObj, setVersiObj] = useState(INITIAL_VERSI_OBJ);

  const saveNewVersi = async () => {
    if (versiObj.name.trim() === "") {
      return setErrorMessage("Name is required!");
    } else if (!["Active", "Inactive"].includes(versiObj.status)) {
      return setErrorMessage("Status must be either Active or Inactive!");
    }

    const requestData = {
      name: versiObj.name,
      status: versiObj.status,
    };

    setLoading(true);

    try {
      const response = await dispatch(addVersiPertanyaan(requestData));
      if (response.meta.requestStatus === "rejected") {
        const errorMessages = response.payload?.errors || [
          "Failed to add new version.",
        ];
        setErrorMessage(errorMessages.join(", "));
      } else {
        dispatch(
          showNotification({ message: "New Version Added!", status: 1 })
        );
        setVersiObj(INITIAL_VERSI_OBJ);
        closeModal();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add new version."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setVersiObj((prev) => ({ ...prev, [updateType]: value }));
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={versiObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Version Name"
        placeholder={"Nama Versi"}
        updateFormValue={updateFormValue}
      />

      <div className="mt-4 flex items-center gap-2">
        <span>Status:</span>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            versiObj.status === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
          onClick={() =>
            setVersiObj((prev) => ({
              ...prev,
              status: prev.status === "Active" ? "Inactive" : "Active",
            }))
          }
        >
          {versiObj.status}
        </button>
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewVersi}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddVersiModalBody;
