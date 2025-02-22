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
      .then((result) => {
        console.log("Result dari dispatch:", result);
        if (result.error) {
          throw new Error(result.error.message);
        }
        dispatch(showNotification({ message: "New Soal Added!", status: 1 }));
        closeModal();
        setLoading(false);
      })
      .catch((error) => {
        dispatch(
          showNotification({ message: `Error: ${error.message}`, status: 0 })
        );
        console.error("Error adding soal:", error.message || error);
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
      status: version.status,
    })) || [];

  console.log("Version Options:", versionOptions); // Tambahkan log di sini

  const addOption = () => {
    setSoalObj((prevState) => ({
      ...prevState,
      options: [...prevState.options, { answer: "", bakat: "" }],
    }));
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "green" : provided.borderColor, // Border hijau saat fokus
      boxShadow: state.isFocused ? "0 0 0 1px green" : "none", // Efek glow hijau saat fokus
      "&:hover": {
        borderColor: "green", // Border hijau saat hover
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "green" : "white", // Warna hijau saat dipilih
      color: state.isSelected ? "white" : "black", // Warna teks kontras
      "&:hover": {
        backgroundColor: "#a3e635", // Warna hijau muda saat hover
        color: "black",
      },
    }),
  };

  const options = [
    { value: "Single", label: "SINGLE" },
    { value: "Multiple", label: "MULTIPLE" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input untuk Versi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Versi
          </label>
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
            styles={customStyles}
            className="mt-2"
            placeholder="Pilih Versi"
          />
        </div>

        {/* Input untuk Tipe Soal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <Select
            value={
              options.find((opt) => opt.value === soalObj.type) || options[0]
            }
            onChange={(selectedOption) =>
              updateFormValue({
                updateType: "type",
                value: selectedOption.value,
              })
            }
            options={options}
            styles={customStyles}
            className="mt-2"
            placeholder="Pilih Tipe Soal"
          />
        </div>
      </div>

      {/* Input untuk Pertanyaan */}
      <InputText
        type="text"
        value={soalObj.question || ""}
        updateType="question"
        containerStyle="mt-4"
        labelTitle="Question"
        updateFormValue={updateFormValue}
        placeholder="Pertanyaan"
      />

      {/* Input untuk Opsi Jawaban */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {soalObj.options.map((option, index) => (
          <div key={index} className="flex flex-col gap-2">
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
              styles={customStyles}
              className="mt-2"
              placeholder="Select Bakat"
            />
          </div>
        ))}
      </div>

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
      <div className="modal-action flex justify-end gap-4">
        <button className="btn btn-ghost" onClick={closeModal}>
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
