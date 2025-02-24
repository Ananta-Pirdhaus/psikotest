import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { updateUser } from "../userSlice";

function UpdateUserModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userObj, setUserObj] = useState(extraObject.userDetails);

  const updateFormValue = useCallback(({ updateType, value }) => {
    setErrorMessage("");
    setUserObj((prev) => ({ ...prev, [updateType]: value }));
  }, []);

  const saveUpdatedUser = () => {
    if (!userObj.name.trim()) {
      setErrorMessage("Name is required!");
      return;
    }
    if (!userObj.email.trim()) {
      setErrorMessage("Email is required!");
      return;
    }

    setLoading(true);
    dispatch(updateUser(userObj))
      .then(() => {
        dispatch(showNotification({ message: "User Updated!", status: 1 }));
        closeModal();
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.errors?.name?.[0] || "Failed to update user."
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
        defaultValue={userObj.name}
      />

      <InputText
        type="email"
        value={userObj.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email"
        updateFormValue={updateFormValue}
        placeholder="Enter Email"
        defaultValue={userObj.email}
      />

      <InputText
        type="password"
        value={userObj.password || ""}
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
          onClick={saveUpdatedUser}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

export default UpdateUserModalBody;
