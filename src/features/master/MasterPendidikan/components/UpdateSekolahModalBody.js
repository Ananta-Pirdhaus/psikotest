import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import { updateSekolah } from "../sekolahSlice"; // Import action updateSekolah
import { showNotification } from "../../../common/headerSlice";

function UpdateSekolahModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();

  // State lokal untuk menyimpan perubahan input sebelum update
  const [name, setName] = useState(extraObject ? extraObject.name : "");
  const [level, setLevel] = useState(extraObject ? extraObject.level : "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fungsi untuk menangani pembaruan sekolah
  const handleUpdateSekolah = async () => {
    setIsUpdating(true);
    try {
      // Dispatch action untuk update sekolah
      await dispatch(
        updateSekolah({ id: extraObject.id, name, level })
      ).unwrap();

      // Tampilkan notifikasi sukses
      dispatch(
        showNotification({ message: "School updated successfully!", status: 1 })
      );
      closeModal(); // Menutup modal setelah update berhasil
    } catch (error) {
      // Tampilkan notifikasi jika terjadi error
      dispatch(
        showNotification({ message: "Failed to update school!", status: 0 })
      );
    } finally {
      setIsUpdating(false);
    }
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
        <button
          className="btn btn-ghost"
          onClick={closeModal}
          disabled={isUpdating}
        >
          Cancel
        </button>
        {/* Tombol untuk mengupdate data sekolah */}
        <button
          className="btn btn-primary"
          onClick={handleUpdateSekolah}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

export default UpdateSekolahModalBody;
