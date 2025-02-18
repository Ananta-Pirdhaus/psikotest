import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { updateProfesi, fetchBakat } from "../profesiSlice";
import Select from "react-select"; // Import react-select

const INITIAL_PROFESI_OBJ = {
  name: "",
  bakat: [],
};

function UpdateProfesiModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();

  // Get "bakatOptions" from Redux store
  const bakatOptions = useSelector((state) => state.profesi.selectBakatOptions);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profesiId, setProfesiId] = useState(extraObject?.id || null);
  const [profesiObj, setProfesiObj] = useState(
    extraObject?.profesi || INITIAL_PROFESI_OBJ
  );

  // Fetch "bakat" options if not available in Redux store
  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(fetchBakat());
    }
  }, [bakatOptions, dispatch]);

  // Load existing "Profesi" data into the form from `extraObject`
  useEffect(() => {
    if (extraObject && extraObject.profesi) {
      setProfesiObj((prev) => ({
        ...prev,
        bakat: extraObject.profesi.bakat.map((b) => b.id),
      }));
      setProfesiId(extraObject.id);
    }
  }, [extraObject]);

  const saveUpdatedProfesi = () => {
    console.log("Profesi Object before update:", profesiObj);

    if (profesiObj.name.trim() === "") {
      setErrorMessage("Name is required!");
      return;
    } else if (profesiObj.bakat.length === 0) {
      setErrorMessage("At least one Bakat is required!");
      return;
    }

    setErrorMessage(""); // Clear previous error if jurusan is selected

    if (profesiObj && profesiId) {
      console.log("Payload before sending:", profesiObj);

      setLoading(true);

      dispatch(updateProfesi({profesiId, profesiObj}))
        .then((response) => {
          console.log("Response from updateProfesi:", response);

          dispatch(
            showNotification({
              message: "Profesi Updated Successfully!",
              status: 1,
            })
          );
          closeModal();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error while updating profesi:", error);

          const errorDetails = error?.response?.data?.errors;
          const errorMessage =
            errorDetails?.name?.[0] ||
            errorDetails?.bakat?.[0] ||
            error.message ||
            "Failed to update profesi.";

          setErrorMessage(errorMessage);

          dispatch(
            showNotification({
              message: `Error: ${errorMessage}`,
              status: 0, // 0 indicates an error
            })
          );

          setLoading(false);
        });
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setProfesiObj((prev) => ({ ...prev, [updateType]: value }));
  };

  // if (!bakatOptions || bakatOptions.length === 0) return <div>Loading...</div>;

  const bakatSelectOptions = bakatOptions.map((bakat) => ({
    value: bakat.value,
    label: bakat.label,
  }));

  console.log("Test 1:", profesiObj.name);

  return (
    <>
      <InputText
        type="text"
        defaultValue={profesiObj.name || ""}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

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
                ? selectedOptions.map((option) => option.value) // pastikan value adalah string UUID
                : [],
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
          onClick={saveUpdatedProfesi}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default UpdateProfesiModalBody;
