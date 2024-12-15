import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addJurusan } from "../jurusanSlice"; // Menggunakan thunk yang sudah dibuat

const INITIAL_JURUSAN_OBJ = {
  name: "",
  bakat: [], // Array untuk bakat yang dipilih
};

function AddJurusansModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jurusanObj, setJurusanObj] = useState(INITIAL_JURUSAN_OBJ);

  const saveNewJurusan = () => {
    if (jurusanObj.name.trim() === "")
      return setErrorMessage("Name is required!");
    else if (jurusanObj.bakat.length === 0)
      return setErrorMessage("At least one Bakat is required!");

    // Membuat FormData untuk mengirimkan data
    let formData = new FormData();
    formData.append("name", jurusanObj.name);
    formData.append("bakat", JSON.stringify(jurusanObj.bakat)); // Mengirimkan array bakat sebagai JSON

    // Mengaktifkan status loading saat permintaan dilakukan
    setLoading(true);

    // Dispatch action Redux untuk menambahkan jurusan menggunakan thunk
    dispatch(addJurusan(formData))
      .then(() => {
        dispatch(
          showNotification({ message: "New Jurusan Added!", status: 1 })
        );
        closeModal();
        setLoading(false); // Matikan loading setelah berhasil
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to add new jurusan.");
        setLoading(false); // Matikan loading jika terjadi kesalahan
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    if (updateType === "bakat") {
      // Jika yang diupdate adalah bakat, simpan array ID bakat
      setJurusanObj({ ...jurusanObj, [updateType]: value });
    } else {
      setJurusanObj({ ...jurusanObj, [updateType]: value });
    }
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={jurusanObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      {/* Untuk memilih bakat, Anda bisa menggunakan select atau checkbox */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Bakat</label>
        <select
          multiple
          value={jurusanObj.bakat}
          onChange={(e) =>
            updateFormValue({
              updateType: "bakat",
              value: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          className="select select-bordered w-full"
        >
          <option value="9d9ac6a3-812b-438e-bd61-a8f544cbe620">Bakat 1</option>
          <option value="9d9ac6a3-8598-466b-b185-9c97a91774b6">Bakat 2</option>
          {/* Tambahkan opsi lainnya sesuai kebutuhan */}
        </select>
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewJurusan()}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddJurusansModalBody;
