import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addUser } from "../userSlice";

const INITIAL_USER_OBJ = {
  name: "",
  email: "",
  password: "",
};

function AddUserModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const updateFormValue = useCallback(({ updateType, value }) => {
    setErrorMessage("");
    setUserObj((prev) => ({ ...prev, [updateType]: value }));
  }, []);

  const saveNewUser = () => {
    if (!userObj.name.trim()) {
      setErrorMessage("Name is required!");
      return;
    }
    if (!userObj.email.trim()) {
      setErrorMessage("Email is required!");
      return;
    }
    if (!userObj.password.trim()) {
      setErrorMessage("Password is required!");
      return;
    }

    setLoading(true);
    dispatch(addUser(userObj))
      .then(() => {
        dispatch(showNotification({ message: "New User Added!", status: 1 }));
        closeModal();
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.errors?.name?.[0] || "Failed to add new user."
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <InputText
        type="text"
        value={userObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
        placeholder="Enter Name"
      />

      <InputText
        type="email"
        value={userObj.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email"
        updateFormValue={updateFormValue}
        placeholder="Enter Email"
      />

      <InputText
        type="password"
        value={userObj.password}
        updateType="password"
        containerStyle="mt-4"
        labelTitle="Password"
        updateFormValue={updateFormValue}
        placeholder="Enter Password"
      />

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewUser}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddUserModalBody;
