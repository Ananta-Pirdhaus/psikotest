import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { updateBakatAsync } from "../bakatSlice"; // Redux thunk for updating bakat
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

const createEditorStateFromHTML = (html) => {
  const blocksFromHTML = convertFromHTML(html);
  const contentState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  return EditorState.createWithContent(contentState);
};

const INITIAL_BAKAT_OBJ = {
  name: "",
  short_description: "",
  full_description: createEditorStateFromHTML("<p></p>"),
  recommendation: createEditorStateFromHTML("<p></p>"),
  icon: null,
  iconPreview: null,
};

function UpdateBakatModalBody({ closeModal, extraObject }) {
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

  // Use useEffect to populate form fields with data from extraObject when available
  useEffect(() => {
    if (extraObject) {
      setBakatObj({
        id: extraObject.id || "",
        name: extraObject.name || "",
        short_description: extraObject.short_description || "",
        full_description: extraObject.full_description
          ? createEditorStateFromHTML(extraObject.full_description)
          : EditorState.createEmpty(),
        recommendation: extraObject.recommendation
          ? createEditorStateFromHTML(extraObject.recommendation)
          : EditorState.createEmpty(),
        icon: extraObject.icon || null,
      });
    }
  }, [extraObject]);

  const updateBakat = () => {
    if (bakatObj.name.trim() === "") {
      setErrorMessage("Name is required!");
      dispatch(showNotification({ message: "Name is required!", status: 0 }));
      return;
    }
    if (!bakatObj.icon) {
      setErrorMessage("Icon is required!");
      dispatch(showNotification({ message: "Icon is required!", status: 0 }));
      return;
    }

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
    formData.append("id", bakatObj.id);
    formData.append("name", bakatObj.name);
    formData.append("short_description", bakatObj.short_description);
    formData.append("full_description", fullDescriptionHTML);
    formData.append("recommendation", recommendationHTML);
    formData.append("icon", bakatObj.icon);

    // Debugging: Log isi formData
    console.log("Data yang dikirim ke updateBakatAsync:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    setLoading(true);

    dispatch(updateBakatAsync(formData))
      .then((result) => {
        console.log("Response dari updateBakatAsync:", result);

        if (result.error) {
          // Jika ada error, lempar error agar masuk ke .catch()
          throw new Error(result.error.message || "Failed to update bakat.");
        }

        dispatch(showNotification({ message: "Bakat Updated!", status: 1 }));
        closeModal();
      })
      .catch((error) => {
        console.error("Error caught in .catch():", error);

        // Ambil pesan error dari response API jika ada
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to update bakat.";

        setErrorMessage(errorMsg);
        dispatch(
          showNotification({ message: "Failed to update bakat.", status: 0 })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage(""); // Reset the error message when a field changes
    if (updateType === "icon") {
      setBakatObj({ ...bakatObj, [updateType]: value[0] }); // Handle file input
    } else {
      setBakatObj({ ...bakatObj, [updateType]: value }); // Handle other inputs
    }
  };

  return (
    <>
      <InputText
        type="text"
        value={bakatObj.name || ""} // Set default value from bakatObj
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
        defaultValue={extraObject.name}
      />

      <InputText
        type="text"
        value={bakatObj.short_description || ""} // Set default value from bakatObj
        updateType="short_description"
        containerStyle="mt-4"
        labelTitle="Short Description"
        updateFormValue={updateFormValue}
        defaultValue={extraObject.short_description}
      />

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
      </div>

      {errorMessage && <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>}

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={updateBakat}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

export default UpdateBakatModalBody;
