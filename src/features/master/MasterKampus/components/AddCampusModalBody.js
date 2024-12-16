import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText"; // Tambahkan komponen ini
import { showNotification } from "../../../common/headerSlice";
import { addNewUniversity } from "../kampuSlice"; // Perbarui path sesuai lokasi slice

const INITIAL_FORM_DATA = {
  NamaProdi: "",
  NamaPT: "",
  Jenjang: "",
  LLDikti: "",
};

const AddCampusModalBody = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    // Validasi langsung di fungsi submit
    if (formData.NamaProdi.trim() === "") {
      setErrorMessage("Program name is required!");
      return;
    }
    if (formData.NamaPT.trim() === "") {
      setErrorMessage("Institution name is required!");
      return;
    }
    if (formData.Jenjang.trim() === "") {
      setErrorMessage("Level is required!");
      return;
    }
    if (formData.LLDikti.trim() === "") {
      setErrorMessage("LLDikti is required!");
      return;
    }

    // Data valid, kirim ke Redux
    dispatch(addNewUniversity(formData)); // Kirim data ke Redux
    dispatch(
      showNotification({
        message: "New campus added successfully!",
        status: 1, // Ganti "type: success" dengan status angka
      })
    );
    closeModal(); // Tutup modal
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage(""); // Reset error saat input diubah
    setFormData({ ...formData, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={formData.NamaProdi}
        updateType="NamaProdi"
        containerStyle="mt-4"
        labelTitle="Program Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={formData.NamaPT}
        updateType="NamaPT"
        containerStyle="mt-4"
        labelTitle="Institution Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={formData.Jenjang}
        updateType="Jenjang"
        containerStyle="mt-4"
        labelTitle="Level"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={formData.LLDikti}
        updateType="LLDikti"
        containerStyle="mt-4"
        labelTitle="LLDikti"
        updateFormValue={updateFormValue}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary px-6" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default AddCampusModalBody;
