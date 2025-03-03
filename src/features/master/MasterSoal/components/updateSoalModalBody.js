import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { fetchBakat, getVersion, updateSoalAsync } from "../soalSlice";
import Select from "react-select";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

const INITIAL_SOAL_OBJ = {
  versi: "",
  type: "Single",
  question: "",
  options: [
    { answer: "", bakat: "" },
    { answer: "", bakat: "" },
  ],
};

const typeOptions = [
  { value: "Single", label: "Single" },
  { value: "Multiple", label: "Multiple" },
];

function UpdateSoalModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const bakatOptions = useSelector((state) => state.soal.selectBakatOptions);
  const versions = useSelector((state) => state.soal.version);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [soalObj, setSoalObj] = useState({
    ...INITIAL_SOAL_OBJ,
    ...extraObject,
  });

  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(fetchBakat());
    }
  }, [bakatOptions, dispatch]);

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
    if (!soalObj.type) {
      setErrorMessage("Type is required!");
      return;
    }
    if (soalObj.question.trim() === "") {
      setErrorMessage("Question is required!");
      return;
    }
    if (!soalObj.options || soalObj.options.length === 0) {
      setErrorMessage("At least one option is required!");
      return;
    }
    if (soalObj.options.some((option) => option.answer.trim() === "")) {
      setErrorMessage("All options must have answers!");
      return;
    }

    setLoading(true);
    console.log("Data yang dikirim:", soalObj);
    dispatch(updateSoalAsync({ updatedSoal: soalObj }))
      .then((result) => {
        console.log("Result dari dispatch:", result);
        dispatch(showNotification({ message: "Updated Soal!", status: 1 }));
        closeModal();
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to update soal.");
        dispatch(
          showNotification({ message: `Error: ${error.message}`, status: 0 })
        );
      })
      .finally(() => setLoading(false));
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
    })) || [];

  const addOption = () => {
    setSoalObj((prevState) => ({
      ...prevState,
      options: [...prevState.options, { answer: "", bakat: "" }],
    }));
  };

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
            defaultValue={soalObj.versi || ""}
            onChange={(selectedOption) => {
              console.log("Selected version:", selectedOption);
              updateFormValue({
                updateType: "versi",
                value: selectedOption?.value || "",
              });
            }}
            className="mt-2"
            placeholder="Select Version"
          />
        </div>

        {/* Input untuk Tipe Soal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <Select
            options={typeOptions}
            defaultValue={
              typeOptions.find((opt) => opt.value === soalObj.type) || null
            }
            onChange={(selectedOption) =>
              updateFormValue({
                updateType: "type",
                value: selectedOption?.value || "",
              })
            }
            className="mt-2"
            placeholder="Select Type"
          />
        </div>
      </div>

      {/* Input untuk Pertanyaan */}
      <InputText
        type="text"
        defaultValue={soalObj.question || ""}
        updateType="question"
        containerStyle="mt-4"
        labelTitle="Question"
        updateFormValue={updateFormValue}
      />

      {/* Input untuk Opsi Jawaban */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {soalObj.options.map((option, index) => (
          <div key={index} className="flex flex-col gap-2">
            <InputText
              type="text"
              defaultValue={option.answer || ""}
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
              defaultValue={
                bakatSelectOptions.find(
                  (opt) => opt.value === option.bakat_id
                ) || null
              }
              onChange={(selectedOption) =>
                updateFormValue({
                  updateType: "options",
                  value: {
                    bakat: selectedOption?.value || "",
                    bakat_id: selectedOption?.value || null,
                  },
                  index,
                })
              }
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

export default UpdateSoalModalBody;
