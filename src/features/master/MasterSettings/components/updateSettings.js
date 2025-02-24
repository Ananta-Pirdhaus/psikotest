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
  const [google_analytics, setGoogleAnalytics] = useState(
    extraObject?.seo?.google_analytics || ""
  );
  const [bing_webmaster, setBingWebmaster] = useState(
    extraObject?.seo?.bing_webmaster || ""
  );
  const [icon, setIcon] = useState(extraObject?.icon || null);
  const [favicon, setFavicon] = useState(extraObject?.favicon || null);
  const [faviconPreview, setFaviconPreview] = useState(
    extraObject?.favicon || null
  );
  const [iconPreview, setIconPreview] = useState(extraObject?.icon || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchFileFromURL = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      // console.error("Failed to fetch file from URL:", error);
      return null;
    }
  };

  const handleUpdateSettings = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("id", extraObject?.id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("keywords", keywords);
      formData.append("author", author);

      // Menambahkan data kontak
      formData.append(
        "contact[email]",
        email || extraObject?.contact?.email || ""
      );
      formData.append(
        "contact[phone]",
        phone || extraObject?.contact?.phone || ""
      );
      formData.append(
        "contact[address]",
        address || extraObject?.contact?.address || ""
      );

      formData.append("google_analytics", google_analytics);
      formData.append("bing_webmaster", bing_webmaster);

      // Cek apakah icon masih berupa string (URL) dari extraObject
      let finalIcon = icon;
      if (!icon && extraObject?.icon) {
        finalIcon = await fetchFileFromURL(extraObject.icon, "icon.png");
      }
      if (finalIcon && typeof finalIcon !== "string") {
        formData.append("icon", finalIcon);
      }

      // Cek apakah favicon masih berupa string (URL) dari extraObject
      let finalFavicon = favicon;
      if (!favicon && extraObject?.favicon) {
        finalFavicon = await fetchFileFromURL(
          extraObject.favicon,
          "favicon.ico"
        );
      }
      if (finalFavicon && typeof finalFavicon !== "string") {
        formData.append("favicon", finalFavicon);
      }

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
    if (updateType === "icon" || updateType === "favicon") {
      const file = value[0];
      if (file) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/x-icon",
        ];
        if (!allowedTypes.includes(file.type)) {
          dispatch(
            showNotification({
              message: "Format gambar tidak valid!",
              status: 0,
            })
          );
          return;
        }

        if (updateType === "icon") {
          setIcon(file);
          setIconPreview(URL.createObjectURL(file));
        } else {
          setFavicon(file);
          setFaviconPreview(URL.createObjectURL(file));
        }
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
        case "google_analytics":
          setGoogleAnalytics(value);
          break;
        case "bing_webmaster":
          setBingWebmaster(value);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          label: "Title",
          type: "text",
          value: title,
          updateType: "title",
          defaultValue: extraObject?.title,
        },
        {
          label: "Description",
          type: "text",
          value: description,
          updateType: "description",
          defaultValue: extraObject?.description,
        },
        {
          label: "Keywords",
          type: "text",
          value: keywords,
          updateType: "keywords",
          defaultValue: extraObject?.keywords,
        },
        {
          label: "Author",
          type: "text",
          value: author,
          updateType: "author",
          defaultValue: extraObject?.author,
        },
        {
          label: "Address",
          type: "text",
          value: address,
          updateType: "address",
          defaultValue: extraObject?.contact?.address,
        },
        {
          label: "Email",
          type: "email",
          value: email,
          updateType: "email",
          defaultValue: extraObject?.contact?.email,
        },
        {
          label: "Phone",
          type: "text",
          value: phone,
          updateType: "phone",
          defaultValue: extraObject?.contact?.phone,
        },
        {
          label: "Google Analytics",
          type: "text",
          value: google_analytics,
          updateType: "google_analytics",
          defaultValue: extraObject?.seo?.google_analytics,
        },
        {
          label: "Bing Webmaster",
          type: "text",
          value: bing_webmaster,
          updateType: "bing_webmaster",
          defaultValue: extraObject?.seo?.bing_webmaster,
        },
      ].map(({ label, type, value, updateType, defaultValue }, index) => (
        <InputText
          key={index}
          type={type}
          value={value}
          updateType={updateType}
          containerStyle="mt-2"
          labelTitle={label}
          updateFormValue={updateFormValue}
          defaultValue={defaultValue}
        />
      ))}

      {/* Favicon Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Favicon
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            updateFormValue({ updateType: "favicon", value: e.target.files })
          }
          className="file-input file-input-bordered file-input-primary w-full"
        />
        {faviconPreview && (
          <img
            src={faviconPreview}
            alt="Favicon Preview"
            className="mt-2 w-16 h-16 object-cover rounded-lg shadow-md"
          />
        )}
      </div>

      {/* Icon Upload */}
      <div>
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

      {/* Modal Actions */}
      <div className="modal-action flex justify-end gap-2 mt-4">
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
    </div>
  );
}

export default UpdateSettingsModalBody;
