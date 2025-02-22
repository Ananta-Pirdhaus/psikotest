import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addKampus, getJurusan } from "../kampuSlice";
import Select from "react-select";

const INITIAL_KAMPUS_OBJ = {
  name: "",
  rank: 1,
  jurusan: [],
  status: "Active",
};

function AddKampusModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const jurusanOptions =
    useSelector((state) => state.kampus.selectJurusanOptions) || [];
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [kampusObj, setKampusObj] = useState(INITIAL_KAMPUS_OBJ);

  useEffect(() => {
    if (jurusanOptions.length === 0) {
      dispatch(getJurusan());
    }
  }, [jurusanOptions.length, dispatch]);

  const updateFormValue = useCallback(({ updateType, value }) => {
    setErrorMessage("");
    setKampusObj((prev) => ({ ...prev, [updateType]: value }));
  }, []);

  const saveNewKampus = () => {
    if (!kampusObj.name.trim()) {
      setErrorMessage("Name is required!");
      return;
    }
    if (kampusObj.jurusan.length === 0) {
      setErrorMessage("At least one Jurusan is required!");
      return;
    }
    if (isNaN(kampusObj.rank) || kampusObj.rank <= 0) {
      setErrorMessage("Rank must be a positive integer!");
      return;
    }

    const validatedKampusObj = {
      ...kampusObj,
      rank: parseInt(kampusObj.rank),
    };

    setLoading(true);
    dispatch(addKampus(validatedKampusObj))
      .then(() => {
        dispatch(showNotification({ message: "New Kampus Added!", status: 1 }));
        closeModal();
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.errors?.name?.[0] || "Failed to add new kampus."
        );
      })
      .finally(() => setLoading(false));
  };

  const jurusanSelectOptions = jurusanOptions.map(({ value, label }) => ({
    value,
    label,
  }));

  return (
    <>
      <InputText
        type="text"
        value={kampusObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
        placeholder="Nama Kampus"
      />

      <InputText
        type="number"
        value={kampusObj.rank}
        updateType="rank"
        containerStyle="mt-4"
        labelTitle="Rank"
        updateFormValue={updateFormValue}
        placeholder="Ranking Kampus"
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Jurusan
        </label>
        <Select
          isMulti
          options={jurusanSelectOptions}
          value={jurusanSelectOptions.filter((opt) =>
            (kampusObj.jurusan || []).includes(opt.value)
          )}
          onChange={(selected) =>
            updateFormValue({
              updateType: "jurusan",
              value: selected.map((opt) => opt.value),
            })
          }
          className="w-full"
          placeholder="Select Jurusan"
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span>Status:</span>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            kampusObj.status === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
          onClick={() =>
            updateFormValue({
              updateType: "status",
              value: kampusObj.status === "Active" ? "Inactive" : "Active",
            })
          }
        >
          {kampusObj.status}
        </button>
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewKampus}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddKampusModalBody;
