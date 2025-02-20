import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import { updateSettings } from "../settingSlice";
import { showNotification } from "../../../common/headerSlice";

function UpdateSettingsModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(extraObject?.title || "");
  const [description, setDescription] = useState(
    extraObject?.description || ""
  );
  const [keywords, setKeywords] = useState(extraObject?.keywords || "");
  const [author, setAuthor] = useState(extraObject?.author || "");
  const [address, setAddress] = useState(extraObject?.contact?.address || "");
  const [email, setEmail] = useState(extraObject?.contact?.email || "");
  const [phone, setPhone] = useState(extraObject?.contact?.phone || "");
  const [icon, setIcon] = useState(extraObject?.icon || null);
  const [iconPreview, setIconPreview] = useState(extraObject?.icon || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateSettings = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("id", extraObject?.id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("keywords", keywords);
      formData.append("author", author);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("phone", phone);
      if (icon) formData.append("icon", icon);

      await dispatch(updateSettings(formData)).unwrap();

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
    if (updateType === "icon") {
      const file = value[0];
      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          dispatch(
            showNotification({
              message: "Format gambar tidak valid!",
              status: 0,
            })
          );
          return;
        }
        setIcon(file);
        setIconPreview(URL.createObjectURL(file));
      }
    } else {
      switch (updateType) {
        case "title":
          setTitle(value);
          break;
        case "description":
          setDescription(value);
          break;
        case "keywords":
          setKeywords(value);
          break;
        case "author":
          setAuthor(value);
          break;
        case "address":
          setAddress(value);
          break;
        case "email":
          setEmail(value);
          break;
        case "phone":
          setPhone(value);
          break;
        case "icon":
          if (value.length > 0) {
            setIcon(value[0]);
            setIconPreview(URL.createObjectURL(value[0]));
          }
          break;
        default:
          break;
      }
    }
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
        defaultValue={extraObject?.title}
      />
      <InputText
        type="text"
        value={description}
        updateType="description"
        containerStyle="mt-4"
        labelTitle="Description"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.description}
      />
      <InputText
        type="text"
        value={keywords}
        updateType="keywords"
        containerStyle="mt-4"
        labelTitle="Keywords"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.keywords}
      />
      <InputText
        type="text"
        value={author}
        updateType="author"
        containerStyle="mt-4"
        labelTitle="Author"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.author}
      />
      <InputText
        type="text"
        value={address}
        updateType="address"
        containerStyle="mt-4"
        labelTitle="Address"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.contact?.address}
      />
      <InputText
        type="email"
        value={email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.contact?.email}
      />
      <InputText
        type="text"
        value={phone}
        updateType="phone"
        containerStyle="mt-4"
        labelTitle="Phone"
        updateFormValue={updateFormValue}
        defaultValue={extraObject?.contact?.phone}
      />
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            updateFormValue({ updateType: "icon", value: e.target.files })
          }
          className="file-input file-input-bordered file-input-primary w-full"
        />
        {iconPreview && (
          <img
            src={iconPreview}
            alt="Icon Preview"
            className="mt-2 w-24 h-24 object-cover rounded-lg shadow-md"
          />
        )}
      </div>
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
