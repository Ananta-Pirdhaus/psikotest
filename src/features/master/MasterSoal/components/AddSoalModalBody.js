import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addNewSoalAsync, fetchBakat } from "../soalSlice";
import Select from "react-select";

const INITIAL_SOAL_OBJ = {
  type: "SINGLE", // Default type
  question: "",
  options: [
    { answer: "", bakat: "" },
    { answer: "", bakat: "" },
  ],
};

function AddSoalModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const bakatOptions = useSelector((state) => state.soal.selectBakatOptions);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [soalObj, setSoalObj] = useState({
    type: "SINGLE", // Default type
    question: "",
    options: [
      { answer: "Setuju", bakat: "" }, // Default answer for option 1
      { answer: "Tidak Setuju", bakat: "" }, // Default answer for option 2
    ],
  });

  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(fetchBakat());
    }
  }, [bakatOptions, dispatch]);

  const saveNewSoal = () => {
    // Log bakat values for both answers if the type is MULTIPLE
    if (soalObj.type === "MULTIPLE") {
      console.log("Answer 1 Bakat:", soalObj.options[0].bakat);
      console.log("Answer 2 Bakat:", soalObj.options[1].bakat);
    }

    if (soalObj.question.trim() === "") {
      setErrorMessage("Question is required!");
      return;
    } else if (soalObj.options.some((option) => option.answer.trim() === "")) {
      setErrorMessage("All options must have answers!");
      return;
    }

    // Rest of your save logic
    setLoading(true);

    dispatch(addNewSoalAsync(soalObj))
      .then(() => {
        dispatch(showNotification({ message: "New Soal Added!", status: 1 }));
        closeModal();
        setLoading(false);
      })
      .catch((error) => {
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

      // Log bakat if the type is MULTIPLE
      if (soalObj.type === "MULTIPLE") {
        console.log(
          `Option ${index + 1} Selected Bakat:`,
          updatedOptions[index].bakat
        );
      }
    } else if (updateType === "type") {
      const newType = value;
      setSoalObj({
        ...soalObj,
        type: newType,
        options:
          newType === "MULTIPLE"
            ? [
                { answer: "Setuju", bakat: [] }, // Default empty bakat for MULTIPLE
                { answer: "Tidak Setuju", bakat: [] },
              ]
            : [
                { answer: "Setuju", bakat: "" },
                { answer: "Tidak Setuju", bakat: "" },
              ],
      });
    } else {
      setSoalObj({ ...soalObj, [updateType]: value });
    }
  };

  const bakatSelectOptions = bakatOptions.map((bakat) => ({
    value: bakat.value,
    label: bakat.label,
  }));

  return (
    <>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={soalObj.type}
          onChange={(e) =>
            updateFormValue({ updateType: "type", value: e.target.value })
          }
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="SINGLE">SINGLE</option>
          <option value="MULTIPLE">MULTIPLE</option>
        </select>
      </div>

      <InputText
        type="text"
        value={soalObj.question || ""}
        updateType="question"
        containerStyle="mt-4"
        labelTitle="Question"
        updateFormValue={updateFormValue}
      />

      {soalObj.options.map((option, index) => (
        <div key={index} className="mt-4">
          <InputText
            type="text"
            value={option.answer || ""} // Set default value here
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
            value={bakatSelectOptions.find((opt) => opt.value === option.bakat)}
            onChange={(selectedOption) =>
              updateFormValue({
                updateType: "options",
                value: { bakat: selectedOption?.value || "" },
                index,
              })
            }
            className="mt-2"
            placeholder="Select Bakat"
            isMulti={soalObj.type === "MULTIPLE"}
          />
        </div>
      ))}

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

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
