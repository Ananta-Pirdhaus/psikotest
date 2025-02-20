import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addNewBakatAsync } from "../bakatSlice";

const INITIAL_BAKAT_OBJ = {
  name: "",
  short_description: "",
  full_description: EditorState.createWithContent(
    ContentState.createFromBlockArray(convertFromHTML("<p></p>"))
  ),
  recommendation: EditorState.createWithContent(
    ContentState.createFromBlockArray(convertFromHTML("<p></p>"))
  ),
  icon: null,
  iconPreview: null,
};

function AddBakatModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bakatObj, setBakatObj] = useState(INITIAL_BAKAT_OBJ);

  const handleEditorChange = (updateType, editorState) => {
    setBakatObj({ ...bakatObj, [updateType]: editorState });
  };

  const handleToggleInlineStyle = (updateType, style) => {
    handleEditorChange(
      updateType,
      RichUtils.toggleInlineStyle(bakatObj[updateType], style)
    );
  };

  const handleToggleBlockType = (updateType, blockType) => {
    handleEditorChange(
      updateType,
      RichUtils.toggleBlockType(bakatObj[updateType], blockType)
    );
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    if (updateType === "icon") {
      const file = value[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBakatObj({ ...bakatObj, icon: file, iconPreview: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setBakatObj({ ...bakatObj, [updateType]: value });
    }
  };

  const saveNewBakat = () => {
    if (bakatObj.name.trim() === "") {
      setErrorMessage("Name is required!");
      dispatch(showNotification({ message: "Name is required!", status: 0 }));
      return;
    } else if (!bakatObj.icon) {
      setErrorMessage("Icon is required!");
      dispatch(showNotification({ message: "Icon is required!", status: 0 }));
      return;
    }

    try {
      let fullDescriptionHTML = "";
      let recommendationHTML = "";

      if (bakatObj.full_description.getCurrentContent().hasText()) {
        fullDescriptionHTML = stateToHTML(
          bakatObj.full_description.getCurrentContent()
        );
      }

      if (bakatObj.recommendation.getCurrentContent().hasText()) {
        recommendationHTML = stateToHTML(
          bakatObj.recommendation.getCurrentContent()
        );
      }

      let formData = new FormData();
      formData.append("name", bakatObj.name);
      formData.append("short_description", bakatObj.short_description);
      formData.append("full_description", fullDescriptionHTML);
      formData.append("recommendation", recommendationHTML);
      formData.append("icon", bakatObj.icon);

      setLoading(true);
      console.log("Sending formData:", formData);

      dispatch(addNewBakatAsync(formData))
        .then((result) => {
          console.log("Dispatch result:", result);
          if (result.error) {
            throw new Error(result.error.message || "Failed to add new bakat.");
          }
          dispatch(
            showNotification({ message: "New Bakat Added!", status: 1 })
          );
          closeModal();
        })
        .catch((error) => {
          console.error("Error caught in .catch():", error);
          setErrorMessage(error.message || "Failed to add new bakat.");
          // Pastikan error.response.data.message ada sebelum digunakan
          const errorMsg =
            error.response?.data?.message || "Failed to add new bakat.";

          setErrorMessage(errorMsg);
          dispatch(showNotification({ message: errorMsg, status: 0 }));
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error in try-catch:", error);
      setErrorMessage("Error processing content.");
      dispatch(
        showNotification({ message: "Error processing content.", status: 0 })
      );
    }
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={bakatObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={bakatObj.short_description}
        updateType="short_description"
        containerStyle="mt-4"
        labelTitle="Short Description"
        updateFormValue={updateFormValue}
      />

      {/* Rich Text Editor untuk Full Description */}
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Full Description
        </label>
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-100">
          <button
            className="btn btn-sm"
            onClick={() => handleToggleInlineStyle("full_description", "BOLD")}
          >
            Bold
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleInlineStyle("full_description", "ITALIC")
            }
          >
            Italic
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleInlineStyle("full_description", "UNDERLINE")
            }
          >
            Underline
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("full_description", "header-one")
            }
          >
            H1
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("full_description", "header-two")
            }
          >
            H2
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("full_description", "unordered-list-item")
            }
          >
            • List
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("full_description", "ordered-list-item")
            }
          >
            1. List
          </button>
        </div>
        <div className="mt-4 border p-3 min-h-[150px] rounded-md bg-white">
          <Editor
            editorState={bakatObj.full_description}
            onChange={(state) => handleEditorChange("full_description", state)}
          />
        </div>
      </div>

      {/* Rich Text Editor untuk Recommendation */}
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Recommendation
        </label>
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-100">
          <button
            className="btn btn-sm"
            onClick={() => handleToggleInlineStyle("recommendation", "BOLD")}
          >
            Bold
          </button>
          <button
            className="btn btn-sm"
            onClick={() => handleToggleInlineStyle("recommendation", "ITALIC")}
          >
            Italic
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleInlineStyle("recommendation", "UNDERLINE")
            }
          >
            Underline
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("recommendation", "header-one")
            }
          >
            H1
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("recommendation", "header-two")
            }
          >
            H2
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("recommendation", "unordered-list-item")
            }
          >
            • List
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              handleToggleBlockType("recommendation", "ordered-list-item")
            }
          >
            1. List
          </button>
        </div>
        <div className="mt-4 border p-3 min-h-[150px] rounded-md bg-white">
          <Editor
            editorState={bakatObj.recommendation}
            onChange={(state) => handleEditorChange("recommendation", state)}
          />
        </div>
      </div>

      {/* Input file untuk Icon */}
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
        {bakatObj.iconPreview && (
          <img
            src={bakatObj.iconPreview}
            alt="Icon Preview"
            className="mt-2 w-24 h-24 object-cover rounded-lg shadow-md"
          />
        )}
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewBakat}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddBakatModalBody;
