import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import { updateSekolah } from "../sekolahSlice"; // Import action updateSekolah

function UpdateSekolahModalBody({ closeModal, extraObject }) {
  // Mengambil data sekolah yang ada di Redux store berdasarkan extraObject (sekolah yang dipilih)
  const dispatch = useDispatch();
  const sekolahDetail = useSelector((state) => state.sekolah.sekolahDetail);

  // State lokal untuk menyimpan perubahan input sebelum update
  const [name, setName] = useState(sekolahDetail ? sekolahDetail.name : "");
  const [level, setLevel] = useState(sekolahDetail ? sekolahDetail.level : "");

  useEffect(() => {
    // Pastikan data sekolah diperbarui ketika extraObject berubah
    if (extraObject) {
      setName(extraObject.name);
      setLevel(extraObject.level);
    }
  }, [extraObject]);

  // Fungsi untuk menangani perubahan input dan update sekolah
  const handleUpdateSekolah = () => {
    const updatedData = { id: extraObject.id, name, level };
    dispatch(updateSekolah(updatedData)); // Dispatch action untuk update sekolah
    closeModal(); // Menutup modal setelah update berhasil
  };

  // Fungsi untuk menangani perubahan nilai input
  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "name") {
      setName(value);
    } else if (updateType === "level") {
      setLevel(value);
    }
  };

  return (
    <>
      {/* Form untuk mengedit nama dan tingkat sekolah */}
      <InputText
        type="text"
        value={name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue} // Passing the update function to InputText
      />

      {/* Dropdown untuk memilih tingkat sekolah (SMA / SMP) */}
      <div className="mt-4">
        <label
          htmlFor="level"
          className="block text-sm font-medium text-gray-700"
        >
          Level
        </label>
        <select
          id="level"
          name="level"
          value={level}
          onChange={(e) =>
            updateFormValue({ updateType: "level", value: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="SMA">SMA</option>
          <option value="SMP">SMP</option>
        </select>
      </div>

      <div className="modal-action">
        {/* Tombol untuk membatalkan dan menutup modal */}
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        {/* Tombol untuk mengupdate data sekolah */}
        <button className="btn btn-primary" onClick={handleUpdateSekolah}>
          Update
        </button>
      </div>
    </>
  );
}

export default UpdateSekolahModalBody;
