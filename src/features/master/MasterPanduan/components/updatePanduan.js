import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePanduan } from "../panduanSlice";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

function UpdateVersiModalBody({ closeModal, extraObject }) {
  console.log("extraObject description: ", extraObject); // Debugging

  const dispatch = useDispatch();
  let initialEditorState;

  try {
    if (extraObject) {
      const blocksFromHTML = convertFromHTML(extraObject);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      initialEditorState = EditorState.createWithContent(contentState);
    } else {
      initialEditorState = EditorState.createEmpty();
    }
  } catch (error) {
    console.warn("Error parsing content, fallback to empty editor:", error);
    initialEditorState = EditorState.createEmpty();
  }

  const [editorState, setEditorState] = useState(initialEditorState);

  const handleEditorChange = (newState) => {
    setEditorState(newState);
  };

  const handleToggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleToggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleUpdate = () => {
    const contentState = editorState.getCurrentContent();
    const rawHTML = stateToHTML(contentState); // Convert Draft.js ke HTML

    dispatch(
      updatePanduan({
        description: rawHTML, // Kirim HTML ke Redux
      })
    );

    closeModal();
  };

  // Menentukan tombol mana yang sedang aktif
  const currentStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-100">
        <button
          className={`btn btn-sm ${
            currentStyle.has("BOLD") ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleInlineStyle("BOLD")}
        >
          Bold
        </button>
        <button
          className={`btn btn-sm ${
            currentStyle.has("ITALIC") ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleInlineStyle("ITALIC")}
        >
          Italic
        </button>
        <button
          className={`btn btn-sm ${
            currentStyle.has("UNDERLINE") ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleInlineStyle("UNDERLINE")}
        >
          Underline
        </button>
        <button
          className={`btn btn-sm ${
            currentBlockType === "header-one" ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleBlockType("header-one")}
        >
          H1
        </button>
        <button
          className={`btn btn-sm ${
            currentBlockType === "header-two" ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleBlockType("header-two")}
        >
          H2
        </button>
        <button
          className={`btn btn-sm ${
            currentBlockType === "unordered-list-item" ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleBlockType("unordered-list-item")}
        >
          • List
        </button>
        <button
          className={`btn btn-sm ${
            currentBlockType === "ordered-list-item" ? "bg-gray-300" : ""
          }`}
          onClick={() => handleToggleBlockType("ordered-list-item")}
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <div className="mt-4 border p-3 min-h-[150px] rounded-md bg-white">
        <Editor editorState={editorState} onChange={handleEditorChange} />
      </div>

      {/* Tombol Update */}
      <div className="modal-action mt-4 flex justify-end gap-2">
        <button className="btn btn-primary" onClick={handleUpdate}>
          Update
        </button>
        <button className="btn btn-secondary" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateVersiModalBody;
