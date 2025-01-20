import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { updateProfesi, fetchBakat } from "../profesiSlice";
import Select from "react-select"; // Import react-select

function UpdateProfesiModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();

  // Get "bakatOptions" from Redux store
  const bakatOptions = useSelector((state) => state.profesi.selectBakatOptions);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profesiObj, setProfesiObj] = useState({
    name: "",
    bakat: [],
  });

  // Fetch "bakat" options if not available in Redux store
  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(fetchBakat());
    }
  }, [bakatOptions, dispatch]);

  // Load existing "Profesi" data into the form from `extraObject`
  useEffect(() => {
    if (extraObject && extraObject.profesi) {
      console.log("extraObject.profesi:", extraObject.profesi); // Log isi dari extraObject.profesi
      const { name, bakat } = extraObject.profesi;
      setProfesiObj({
        name: name || "",
        bakat: bakat || [],
      });
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

    // Pastikan bakat yang dikirim adalah array ID string (UUID)
    const payload = {
      id: extraObject.id, // Assuming `extraObject` includes an `id` field
      name: profesiObj.name,
      bakat: profesiObj.bakat, // pastikan bakat adalah array ID string
    };

    console.log("Payload before sending:", payload);

    setLoading(true);

    dispatch(updateProfesi(payload))
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
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(`Updating ${updateType} with value:`, value);
    setErrorMessage("");
    setProfesiObj({ ...profesiObj, [updateType]: value });
  };

  if (!bakatOptions || bakatOptions.length === 0) return <div>Loading...</div>;

  const bakatSelectOptions = bakatOptions.map((bakat) => ({
    value: bakat.value,
    label: bakat.label,
  }));

  return (
    <>
      <InputText
        type="text"
        value={profesiObj.name || ""}
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
