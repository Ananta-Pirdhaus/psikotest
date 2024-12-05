import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { closeModal } from "../../common/modalSlice";
import * as XLSX from "xlsx";

const FileUploadModal = () => {
  const dispatch = useDispatch();
  const [fileData, setFileData] = useState(null);

  // Fungsi untuk memproses file setelah di-upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "", // Mengisi nilai kosong jika ada sel kosong
      });
      setFileData(sheetData);
      console.log("File data: ", sheetData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Setup drag and drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv, .xlsx",
    maxFiles: 1,
  });

  const closeHandler = () => {
    dispatch(closeModal());
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-xl font-bold">Upload Education Data</h2>

        <div className="my-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-6 text-center"
          >
            <input {...getInputProps()} />
            <p>Drag & Drop your file here, or</p>
            <button className="btn btn-primary">Click to select file</button>
          </div>
        </div>

        {fileData && (
          <div>
            <h3 className="text-lg">File Content:</h3>
            <pre>{JSON.stringify(fileData, null, 2)}</pre>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={closeHandler}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
