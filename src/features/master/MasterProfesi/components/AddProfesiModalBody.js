import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addProfesi } from "../profesiSlice";

const INITIAL_PROFESI_OBJ = {
  profesi_name: "",
  profesi_type: "",
};

function AddProfesiModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profesiObj, setProfesiObj] = useState(INITIAL_PROFESI_OBJ);

  const saveNewProfesi = () => {
    if (profesiObj.profesi_name.trim() === "")
      return setErrorMessage("Profession Name is required!");
    else if (profesiObj.profesi_type.trim() === "")
      return setErrorMessage("Profession Type is required!");
    else {
      let newProfesiObj = {
        id: 7,
        profesi_name: profesiObj.profesi_name,
        profesi_type: profesiObj.profesi_type,
      };
      dispatch(addProfesi({ newProfesiObj }));
      dispatch(
        showNotification({ message: "New Profession Added!", status: 1 })
      );
      closeModal();
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setProfesiObj({ ...profesiObj, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={profesiObj.profesi_name}
        updateType="profesi_name"
        containerStyle="mt-4"
        labelTitle="Profession Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={profesiObj.profesi_type}
        updateType="profesi_type"
        containerStyle="mt-4"
        labelTitle="Profession Type"
        updateFormValue={updateFormValue}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewProfesi()}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default AddProfesiModalBody;
