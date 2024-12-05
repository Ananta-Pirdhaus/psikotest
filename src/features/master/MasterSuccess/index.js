import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { importOrangSukses, deleteOrangSukses } from "./succesSlice";
import * as XLSX from "xlsx";
import { openModal } from "../../common/modalSlice";
import TitleCard from "../../../components/Cards/TitleCard";
import {
  MODAL_BODY_TYPES,
  CONFIRMATION_MODAL_CLOSE_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

// TopSideButtons Component for Import functionality
const TopSideButtons = ({ onImport }) => {
  const dispatch = useDispatch();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          defval: "",
          header: ["ID", "Code", "NamaOrangSukses"],
        });

        const formattedData = sheetData
          .map((row) => ({
            ID: row["ID"],
            Code: row["Code"],
            NamaOrangSukses: row["NamaOrangSukses"]
              ? row["NamaOrangSukses"].toLowerCase()
              : "",
            Country: "Indonesia",
          }))
          .filter((row, index, self) => {
            return (
              row.NamaOrangSukses &&
              index ===
                self.findIndex((r) => r.NamaOrangSukses === row.NamaOrangSukses)
            );
          });

        // Dispatch import action
        dispatch(importOrangSukses(formattedData));
        // Call parent onImport method if needed
        if (onImport) onImport(formattedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="inline-block float-right space-x-2">
      <label className="btn btn-secondary btn-sm normal-case">
        Import CSV/Excel
        <input
          type="file"
          accept=".csv, .xlsx"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

const SuccessMaster = () => {
  const { orangSukses } = useSelector((state) => state.orangSukses);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const deleteCurrentSuccess = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this person?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SUCCESS_DELETE,
          index,
        },
      })
    );
  };

  const filteredSuccess = useMemo(() => {
    return orangSukses.filter((entry) => {
      const namaOrangSukses = String(entry.NamaOrangSukses || "").toLowerCase();
      const country = String(entry.Country || "").toLowerCase();

      return (
        namaOrangSukses.includes(searchQuery.toLowerCase()) ||
        country.includes(searchQuery.toLowerCase())
      );
    });
  }, [orangSukses, searchQuery]);

  const currentSuccess = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredSuccess.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredSuccess, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSuccess.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <TitleCard
      title="Manajemen Orang Sukses"
      topMargin="mt-2"
      TopSideButtons={<TopSideButtons onImport={null} />}
    >
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Country"
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Orang Sukses</th>
              <th>Negara</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentSuccess.map((item, index) => (
              <tr key={index} className="hover">
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{item.NamaOrangSukses}</td>
                <td>{item.Country}</td>
                <td>
                  <button
                    className="btn btn-square btn-ghost"
                    onClick={() => deleteCurrentSuccess(index)}
                  >
                    <TrashIcon className="w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <div className="btn-group">
          <button
            className="btn btn-sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button className="btn btn-sm">{currentPage}</button>
          <button
            className="btn btn-sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </TitleCard>
  );
};

export default SuccessMaster;
