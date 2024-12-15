import moment from "moment";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import {
  getProfesi,
  addProfesi,
  deleteProfesi,
  importProfesiData,
} from "./profesiSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import * as XLSX from "xlsx";

const TopSideButtons = ({ onImport }) => {
  const dispatch = useDispatch();

  const openAddNewProfesiModal = () => {
    dispatch(
      openModal({
        title: "Add New Profesi",
        bodyType: MODAL_BODY_TYPES.PROFESI_ADD_NEW,
      })
    );
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvData = e.target.result;
        const workbook = XLSX.read(csvData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          defval: "",
        });

        const formattedData = sheetData
          .map((row) => ({
            id: row[0], // Ensure this matches the ID structure
            name: row[1] ? row[1].toLowerCase() : "",
            bakat: row[2] ? row[2].split(",") : [], // Assuming "bakat" is a comma-separated string in the CSV
          }))
          .filter((row, index, self) => {
            return (
              row.name && index === self.findIndex((r) => r.name === row.name)
            );
          });

        onImport(formattedData);
        dispatch(importProfesiData(formattedData));
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
      <button
        className="btn btn-primary btn-sm normal-case"
        onClick={openAddNewProfesiModal}
      >
        Add New
      </button>
    </div>
  );
};

function Profesi() {
  const profesi = useSelector((state) => state.profesi.profesi);
  const status = useSelector((state) => state.profesi.status);
  const error = useSelector((state) => state.profesi.error);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getProfesi());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      console.log("Fetched profesi data:", profesi);
    }
    if (status === "failed") {
      console.log("Error fetching profesi:", error);
    }
  }, [status, profesi, error]);

  const deleteCurrentProfesi = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this profesi record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.PROFESI_DELETE,
          id,
        },
      })
    );
    dispatch(deleteProfesi(id)); // Delete the profession with the given ID
  };

  const filteredProfesi = useMemo(() => {
    return profesi.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    });
  }, [profesi, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfesi = filteredProfesi.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredProfesi.length / itemsPerPage);

  return (
    <>
      <TitleCard
        title="Master Profesi"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons onImport={dispatch(importProfesiData)} />
        }
      >
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Failed to load data.</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Profesi Name"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Jurusan List Table */}
        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Profesi Name</th>
                <th className="px-4 py-2 text-left">Bakat</th>

                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProfesi.map((p, k) => (
                <tr
                  key={k}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">
                    {p.bakat && p.bakat.length > 0
                      ? p.bakat.join(", ")
                      : "No Bakat"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentProfesi(p.id)}
                      aria-label="Delete Profesi Record"
                    >
                      <TrashIcon className="w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DaisyUI Pagination */}
        <div className="flex justify-center mt-4">
          <div className="btn-group space-x-2">
            <button
              className="btn btn-sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="btn btn-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default Profesi;
