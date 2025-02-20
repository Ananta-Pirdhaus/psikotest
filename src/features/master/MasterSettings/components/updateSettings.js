import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import { updateSettings } from "../settingSlice";
import { showNotification } from "../../../common/headerSlice";

function UpdateSettingsModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(extraObject ? extraObject.title : "");
  const [description, setDescription] = useState(
    extraObject ? extraObject.description : ""
  );
  const [keywords, setKeywords] = useState(
    extraObject ? extraObject.keywords : ""
  );
  const [author, setAuthor] = useState(extraObject ? extraObject.author : "");
  const [address, setAddress] = useState(extraObject?.contact?.address || "");
  const [email, setEmail] = useState(extraObject?.contact?.email || "");
  const [phone, setPhone] = useState(extraObject?.contact?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateSettings = async () => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateSettings({
          id: extraObject.id,
          title,
          description,
          keywords,
          author,
          contact: { address, email, phone },
        })
      ).unwrap();

      dispatch(
        showNotification({
          message: "Settings updated successfully!",
          status: 1,
        })
      );
      closeModal();
    } catch (error) {
      dispatch(
        showNotification({ message: "Failed to update settings!", status: 0 })
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "title") setTitle(value);
    else if (updateType === "description") setDescription(value);
    else if (updateType === "keywords") setKeywords(value);
    else if (updateType === "author") setAuthor(value);
    else if (updateType === "address") setAddress(value);
    else if (updateType === "email") setEmail(value);
    else if (updateType === "phone") setPhone(value);
  };

  return (
    <>
      <InputText
        type="text"
        value={title}
        updateType="title"
        containerStyle="mt-4"
        labelTitle="Title"
        updateFormValue={updateFormValue}
        defaultValue={extraObject.title || ""}
      />
      <InputText
        type="text"
        value={description}
        updateType="description"
        containerStyle="mt-4"
        labelTitle="Description"
        updateFormValue={updateFormValue}
        defaultValue={extraObject.description || ""}
      />
      <InputText
        type="text"
        value={keywords}
        updateType="keywords"
        containerStyle="mt-4"
        labelTitle="Keywords"
        updateFormValue={updateFormValue}
        defaultValue={extraObject.keywords || ""}
      />
      <InputText
        type="text"
        value={author}
        updateType="author"
        containerStyle="mt-4"
        labelTitle="Author"
        updateFormValue={updateFormValue}
        defaultValue={extraObject.author || ""}
      />
      <InputText
        type="text"
        value={address}
        updateType="address"
        containerStyle="mt-4"
        labelTitle="Address"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.contact?.address || ""}
      />
      <InputText
        type="email"
        value={email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.contact?.email || ""}
      />
      <InputText
        type="text"
        value={phone}
        updateType="phone"
        containerStyle="mt-4"
        labelTitle="Phone"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.contact?.phone || ""}
      />
      <div className="modal-action">
        <button
          className="btn btn-ghost"
          onClick={closeModal}
          disabled={isUpdating}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleUpdateSettings}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

export default UpdateSettingsModalBody;
