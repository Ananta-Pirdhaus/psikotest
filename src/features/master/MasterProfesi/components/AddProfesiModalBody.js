import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addProfesi } from "../profesiSlice";
import { fetchBakat } from "../../MasterBakat/bakatSlice";

const INITIAL_PROFESI_OBJ = {
  profesi_name: "",
  bakat: [], // Properti bakat untuk menyimpan bakat yang dipilih
};

function AddProfesiModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profesiObj, setProfesiObj] = useState(INITIAL_PROFESI_OBJ);

  // Ambil data bakat dari state menggunakan useSelector
  const bakatData = useSelector((state) => state.bakat.bakat || []); // Default to empty array if bakat data is not available
  const bakatStatus = useSelector((state) => state.bakat.status || "idle"); // Default to "idle" if undefined
  const profesiStatus = useSelector((state) => state.profesi.status || "idle");

  // Fetch bakat data jika belum ada di state
  useEffect(() => {
    if (
      bakatData.length === 0 &&
      bakatStatus !== "loading" &&
      bakatStatus !== "succeeded"
    ) {
      dispatch(fetchBakat());
    }
  }, [dispatch, bakatData, bakatStatus]);

  const saveNewProfesi = () => {
    if (profesiObj.profesi_name.trim() === "")
      return setErrorMessage("Profession Name is required!");
    else if (profesiObj.bakat.length === 0)
      return setErrorMessage("At least one skill must be selected!");

    let newProfesiObj = {
      profesi_name: profesiObj.profesi_name,
      bakat: profesiObj.bakat, // Sertakan bakat yang dipilih
    };

    setLoading(true);
    // Dispatch untuk menambahkan profesi dengan bakat yang sudah dipilih
    dispatch(addProfesi({ newProfesiObj }))
      .unwrap()
      .then(() => {
        dispatch(
          showNotification({ message: "New Profession Added!", status: 1 })
        );
        closeModal();
      })
      .catch((error) => {
        setErrorMessage("Failed to add profession!");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setProfesiObj({ ...profesiObj, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={profesiObj.profesi_name}
        updateType="profesi_name"
        containerStyle="mt-4"
        labelTitle="Profession Name"
        updateFormValue={updateFormValue}
      />

      {/* Multiple Select for Bakat */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Skills
        </label>
        <select
          value={profesiObj.bakat}
          onChange={(e) => {
            const selectedBakat = [...e.target.selectedOptions].map(
              (option) => option.value
            );
            updateFormValue({ updateType: "bakat", value: selectedBakat });
          }}
          className="mt-2 p-2 border rounded w-full"
        >
          {bakatStatus === "loading" ? (
            <option>Loading skills...</option>
          ) : (
            bakatData.map((bakat) => (
              <option key={bakat.id} value={bakat.id}>
                {bakat.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Display selected skills in InputText */}
      <InputText
        type="text"
        value={
          Array.isArray(profesiObj.bakat) ? profesiObj.bakat.join(", ") : ""
        } // Menampilkan skill yang dipilih dengan koma sebagai pemisah
        updateType="bakat"
        containerStyle="mt-4"
        labelTitle="Selected Skills"
        updateFormValue={updateFormValue}
        disabled={true}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewProfesi()}
          disabled={loading || profesiStatus === "loading"}
        >
          {loading || profesiStatus === "loading" ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddProfesiModalBody;
