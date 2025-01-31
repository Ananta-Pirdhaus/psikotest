import { useEffect, useState } from "react";
import InputText from "../../../../components/Input/InputText";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { updateVersiPertanyaan } from "../versiSlice";

function UpdateVersiModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [data, setData] = useState(extraObject.item);
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
  const selectedOptions = {
    value: data.status,
    label: data.status,
  };

  const updateFormValue = ({ updateType, value }) => {
    setData((prev) => ({
      ...prev,
      [updateType]: value,
    }));
  };

  const toggleStatus = () => {
    setData((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  };

  console.log("Data:", data);

  const handleUpdate = () => {
    if (data) {
      const payload = {
        name: data.name,
        status: data.status,
      };
      dispatch(updateVersiPertanyaan({ id: data.id, data: payload }));
      closeModal();
    }
  };

  return (
    <>
      <InputText
        labelTitle="Name"
        type="text"
        defaultValue={data.name}
        containerStyle="mt-4"
        updateType="name"
        updateFormValue={updateFormValue}
      />
      <div className="mt-4 flex items-center gap-2">
        <span>Status:</span>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            data.status === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
          onClick={(prev) =>
            updateFormValue({
              updateType: "status",
              value: prev.status === "Active" ? "Inactive" : "Active",
            })
          }
        >
          {data.status}
        </button>
      </div>
      {/* <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <Select
          className="w-full"
          placeholder="Select Status"
          options={statusOptions}
          defaultValue={selectedOptions}
          onChange={(selected) =>
            updateFormValue({
              updateType: "status",
              value: selected.value,
            })
          }
        />
      </div> */}

      <div className="modal-action">
        <button className="btn btn-primary" onClick={handleUpdate}>
          Update
        </button>
        <button className="btn btn-secondary" onClick={closeModal}>
          Close
        </button>
      </div>
    </>
  );
}

export default UpdateVersiModalBody;
