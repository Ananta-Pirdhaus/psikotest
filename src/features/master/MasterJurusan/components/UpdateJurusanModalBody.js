import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector for accessing Redux store
import { openModal } from "../../../common/modalSlice"; // Import openModal action
import InputText from "../../../../components/Input/InputText"; // Import InputText component
import Select from "react-select"; // Import react-select for multiselect input
import { updateJurusan, getBakat } from "../jurusanSlice";
import { showNotification } from "../../../common/headerSlice";

function JurusanModalBody({ closeModal, extraObject }) {
  const [jurusanDetail, setJurusanDetail] = useState(
    extraObject?.jurusanDetail || { name: "", bakat: [] }
  );
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode
  const dispatch = useDispatch();

  // Safely accessing bakatOptions using optional chaining and providing a default empty array
  const bakatOptions = useSelector(
    (state) => state.jurusan.selectBakatOptions || []
  ); // Ensure bakatOptions is always an array

  console.log("opsi bakat: ", bakatOptions);

  useEffect(() => {
    if (extraObject && extraObject.jurusanDetail) {
      setJurusanDetail(extraObject.jurusanDetail);
    }
  }, [extraObject]);

  // Fetch bakat options on mount
  useEffect(() => {
    dispatch(getBakat()); // Dispatch action to fetch bakat options
  }, [dispatch]);

  // Handle changes in the selected bakat options
  const handleBakatChange = (selectedOptions) => {
    setJurusanDetail((prevState) => ({
      ...prevState,
      bakat: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [], // Map selected options to their values (UUIDs)
    }));
  };

  // Save the changes and close the modal
  const handleSave = () => {
    if (jurusanDetail) {
      // Validation check for both 'name' and 'bakat'
      if (
        !jurusanDetail.name ||
        typeof jurusanDetail.name !== "string" ||
        jurusanDetail.bakat.length === 0
      ) {
        console.log(
          "Validation failed. Both 'name' and 'bakat' are required and 'name' must be a string."
        );
        return; // Don't proceed with dispatch if validation fails
      }

      // Ensure 'name' is a string (if needed, you can trim spaces or other preprocessing)
      const nameToSend = String(jurusanDetail.name).trim(); // Make sure name is a string and trimmed of excess spaces

      // Log the data that will be sent to the updateJurusan action
      const dataToSend = {
        id: extraObject.id, // Assuming extraObject.id contains the correct ID
        name: nameToSend, // Ensure name is a clean string
        bakat: jurusanDetail.bakat, // Array of bakat (skills or talents)
      };
      console.log("Data being sent to updateJurusan: ", dataToSend);

      // Dispatch the updateJurusan action with the data
      dispatch(updateJurusan(dataToSend))
        .unwrap() // Handle the promise returned by the async thunk (optional)
        .then(() => {
          console.log("Jurusan updated successfully.");
          dispatch(
            showNotification({
              message: "Jurusan updated successfully!",
              status: 1, // Success status
            })
          );
          closeModal(); // Close the modal after saving
        })
        .catch((error) => {
          console.error("Error updating jurusan: ", error);
          dispatch(
            showNotification({
              message: `Error: ${error.message}`,
              status: 0, // Error status
            })
          );
        });
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Jurusan" : "View Jurusan"}</h2>

      <div>
        <InputText
          type="text"
          defaultValue={jurusanDetail.name}
          updateType="name"
          containerStyle="mt-4"
          labelTitle="Name"
          disabled={!isEditing} // Disable when not editing
          updateFormValue={(value) =>
            setJurusanDetail((prevState) => ({ ...prevState, name: value }))
          }
        />
      </div>

      <div>
        {isEditing ? (
          // Render react-select when in editing mode with label
          <div>
            <label className="block text-sm font-normal text-gray-700 my-2">
              Bakat
            </label>
            <Select
              isMulti
              options={bakatOptions.map((option) => ({
                label: option.label, // Use label for display
                value: option.value, // Use value (UUID) for selection
              }))}
              value={bakatOptions.filter((option) =>
                jurusanDetail.bakat.includes(option.value)
              )}
              onChange={handleBakatChange}
              className="w-full"
              placeholder="Select Bakat"
            />
          </div>
        ) : (
          <div>
            <InputText
              type="text"
              defaultValue={jurusanDetail.bakat.map((b) => b.name).join(", ")}
              updateType="bakat"
              containerStyle="mt-4"
              disabled={true} 
              labelTitle="Bakat"
            />
          </div>
        )}
      </div>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Close
        </button>
        {isEditing ? (
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default JurusanModalBody;
