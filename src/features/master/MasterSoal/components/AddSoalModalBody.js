import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addNewSoalAsync, fetchBakat, getVersion } from "../soalSlice";
import Select from "react-select";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon"; // Import Plus icon

const INITIAL_SOAL_OBJ = {
  versi: "", // Akan diganti dengan versi id yang dipilih
  type: "Single", // Default type
  question: "",
  options: [
    { answer: "", bakat: "" },
    { answer: "", bakat: "" },
  ],
};

function AddSoalModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const bakatOptions = useSelector((state) => state.soal.selectBakatOptions);
  const versions = useSelector((state) => state.soal.version); // Ambil versi dari Redux store
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [soalObj, setSoalObj] = useState(INITIAL_SOAL_OBJ);

  // Fetch bakatOptions jika belum tersedia
  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(fetchBakat());
    }
  }, [bakatOptions, dispatch]);

  // Fetch versi jika belum tersedia
  useEffect(() => {
    if (!versions || versions.length === 0) {
      dispatch(getVersion());
    }
  }, [versions, dispatch]);

  const saveNewSoal = () => {
    if (!soalObj.versi) {
      setErrorMessage("Version is required!");
      return;
    }
    if (soalObj.question.trim() === "") {
      setErrorMessage("Question is required!");
      return;
    }
    if (soalObj.options.some((option) => option.answer.trim() === "")) {
      setErrorMessage("All options must have answers!");
      return;
    }

    setLoading(true);

    dispatch(addNewSoalAsync(soalObj))
      .then(() => {
        dispatch(showNotification({ message: "New Soal Added!", status: 1 }));
        closeModal();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error adding soal:", error.message || error);
        console.log("Body request sent:", soalObj); // Log body request yang dikirim
        setErrorMessage(error.message || "Failed to add soal.");
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value, index }) => {
    setErrorMessage("");

    if (updateType === "options") {
      const updatedOptions = [...soalObj.options];
      updatedOptions[index] = { ...updatedOptions[index], ...value };
      setSoalObj({ ...soalObj, options: updatedOptions });
    } else {
      setSoalObj({ ...soalObj, [updateType]: value });
    }
  };

  const bakatSelectOptions = bakatOptions.map((bakat) => ({
    value: bakat.value,
    label: bakat.label,
  }));

  const versionOptions =
    versions?.map((version) => ({
      value: version.value,
      label: version.label,
      status: version.status
    })) || [];

  console.log("Version Options:", versionOptions); // Tambahkan log di sini

  const addOption = () => {
    setSoalObj((prevState) => ({
      ...prevState,
      options: [...prevState.options, { answer: "", bakat: "" }],
    }));
  };

  return (
    <>
      {/* Input untuk Versi */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Versi</label>
        <Select
          options={versionOptions}
          value={
            versionOptions.find((opt) => opt.value === soalObj.versi) || null
          }
          onChange={(selectedOption) =>
            updateFormValue({
              updateType: "versi",
              value: selectedOption?.value || "",
            })
          }
          className="mt-2"
          placeholder="Select Version"
        />
      </div>

      {/* Input untuk Tipe Soal */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={soalObj.type || "Single"}
          onChange={(e) =>
            updateFormValue({ updateType: "type", value: e.target.value })
          }
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Single">SINGLE</option>
          <option value="Multiple">MULTIPLE</option>
        </select>
      </div>

      {/* Input untuk Pertanyaan */}
      <InputText
        type="text"
        value={soalObj.question || ""}
        updateType="question"
        containerStyle="mt-4"
        labelTitle="Question"
        updateFormValue={updateFormValue}
      />

      {/* Input untuk Opsi Jawaban */}
      {soalObj.options.map((option, index) => (
        <div key={index} className="mt-4">
          <InputText
            type="text"
            value={option.answer || ""}
            labelTitle={`Option ${index + 1} Answer`}
            updateType="options"
            containerStyle="mt-2"
            updateFormValue={({ value }) =>
              updateFormValue({
                updateType: "options",
                value: { answer: value },
                index,
              })
            }
          />
          <Select
            options={bakatSelectOptions}
            value={
              bakatSelectOptions.find((opt) => opt.value === option.bakat) ||
              null
            }
            onChange={(selectedOption) =>
              updateFormValue({
                updateType: "options",
                value: { bakat: selectedOption?.value || "" },
                index,
              })
            }
            className="mt-2"
            placeholder="Select Bakat"
          />
        </div>
      ))}

      {/* Tambahkan tombol untuk menambah opsi jawaban jika tipe soal MULTIPLE */}
      {soalObj.type === "Multiple" && (
        <button
          type="button"
          onClick={addOption}
          className="mt-4 flex items-center text-indigo-500 hover:text-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Option
        </button>
      )}

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      {/* Tombol Aksi */}
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewSoal}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddSoalModalBody;
