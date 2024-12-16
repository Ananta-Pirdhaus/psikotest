import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { importUniversityData, deleteUniversity } from "./kampuSlice";
import * as XLSX from "xlsx"; // Perbaikan impor XLSX
import { TrashIcon } from "@heroicons/react/outline";

const TopSideButtons = ({ onImport }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Process data: Remove duplicates by NamaProdi and NamaPT
      const uniqueData = sheetData.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.NamaProdi === value.NamaProdi && t.NamaPT === value.NamaPT
          )
      );

      onImport(uniqueData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex justify-end mb-4">
      <label htmlFor="file-upload" className="btn btn-primary mr-2">
        Import Data
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
      <button
        className="btn btn-secondary"
        onClick={() => alert("Add University Modal")}
      >
        Add University
      </button>
    </div>
  );
};

const Education = () => {
  const dispatch = useDispatch();
  const universityData = useSelector((state) => state.university.university);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this university?")) {
      dispatch(deleteUniversity(id));
    }
  };

  const handleImport = (data) => {
    dispatch(importUniversityData(data));
  };

  // Filter and paginate data
  const filteredData = universityData.filter(
    (item) =>
      item.NamaProdi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.LLDikti.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <TopSideButtons onImport={handleImport} />

      <input
        type="text"
        placeholder="Search by NamaProdi or LLDikti"
        className="input input-bordered w-full mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Prodi</th>
            <th>Nama PT</th>
            <th>LLDikti</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.NamaProdi}</td>
              <td>{item.NamaPT}</td>
              <td>{item.LLDikti}</td>
              <td>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Education;
