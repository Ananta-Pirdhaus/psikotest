import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateJurusan, getBakat } from "../jurusanSlice";
import { showNotification } from "../../../common/headerSlice";
import InputText from "../../../../components/Input/InputText";
import Select from "react-select";

function JurusanModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();

  // State untuk menyimpan data jurusan yang sedang diedit
  const [profesiObj, setProfesiObj] = useState(
    extraObject?.jurusanDetail || { name: "", bakat: [] }
  );

  // Mengambil daftar bakat dari Redux store
  const bakatSelectOptions = useSelector(
    (state) => state.jurusan.selectBakatOptions || []
  );

  // Konversi bakat dari extraObject ke format { value, label }
  const defaultBakat = profesiObj.bakat.map((bakat) => ({
    value: bakat.id, // Ambil id sebagai value
    label: bakat.name, // Ambil name sebagai label
  }));

  // Fetch data bakat saat komponen dimuat
  useEffect(() => {
    dispatch(getBakat());
  }, [dispatch]);

  // Mengatur default value saat `extraObject` berubah
  useEffect(() => {
    if (extraObject && extraObject.jurusanDetail) {
      setProfesiObj(extraObject.jurusanDetail);
    }
  }, [extraObject]);

  // Fungsi untuk memperbarui state form
  const updateFormValue = ({ updateType, value }) => {
    setProfesiObj((prevState) => ({
      ...prevState,
      [updateType]: value,
    }));
  };

  // Fungsi untuk menyimpan data
  const handleSave = () => {
    if (!profesiObj.name || profesiObj.bakat.length === 0) {
      console.log("Validation failed. Both 'name' and 'bakat' are required.");
      return;
    }

    const dataToSend = {
      id: extraObject.id,
      name: profesiObj.name.trim(),
      bakat: profesiObj.bakat.map((bakat) => bakat.id), // Kirim ID saja ke backend
    };

    dispatch(updateJurusan(dataToSend))
      .unwrap()
      .then(() => {
        dispatch(
          showNotification({
            message: "Jurusan updated successfully!",
            status: 1,
          })
        );
        closeModal();
      })
      .catch((error) => {
        dispatch(
          showNotification({ message: `Error: ${error.message}`, status: 0 })
        );
      });
  };

  return (
    <div>
      {/* Input Nama */}
      <InputText
        type="text"
        defaultValue={profesiObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={(value) =>
          updateFormValue({ updateType: "name", value })
        }
      />

      {/* Select Bakat dengan Default Value */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Bakat</label>
        <Select
          isMulti
          options={bakatSelectOptions}
          defaultValue={defaultBakat} // Default dari extraObject
          value={defaultBakat} // Sinkron dengan state
          onChange={(selectedOptions) =>
            updateFormValue({
              updateType: "bakat",
              value: selectedOptions
                ? selectedOptions.map((option) => ({
                    id: option.value, // Simpan sebagai objek dengan id
                    name: option.label, // Simpan juga namanya
                  }))
                : [],
            })
          }
          className="w-full"
          placeholder="Select Bakat"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default JurusanModalBody;
