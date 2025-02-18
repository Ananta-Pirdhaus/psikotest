// src/features/master/MasterKelas/index.js

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import {
  fetchKelas,
  selectAllKelas,
  selectKelasStatus,
  selectKelasError,
} from "./kelasSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";

function MasterKelas() {
  const kelas = useSelector(selectAllKelas); // Get the array of classes from the store
  const status = useSelector(selectKelasStatus);
  const error = useSelector(selectKelasError);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(""); // Level filter state

  // Fetch Kelas data when component mounts or when level changes
  useEffect(() => {
    dispatch(fetchKelas(selectedLevel)); // Pass the selected level to the thunk
  }, [dispatch, selectedLevel]);

  const deleteCurrentKelas = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this class record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.CLASS_DELETE,
          index,
        },
      })
    );
  };

  const updateKelasDetails = (kelas) => {
    dispatch(
      openModal({
        title: "Update Class",
        bodyType: MODAL_BODY_TYPES.CLASS_UPDATE,
        extraObject: kelas,
      })
    );
  };

  const viewKelasDetails = (kelas) => {
    dispatch(
      openModal({
        title: "Class Details",
        bodyType: MODAL_BODY_TYPES.CLASS_VIEW,
        extraObject: kelas,
      })
    );
  };

  // Filter Kelas based on search query and selected level
  const filteredKelas = useMemo(() => {
    if (!Array.isArray(kelas)) {
      return [];
    }

    return kelas.filter((k) => {
      const className = String(k.name || "").toLowerCase();
      const level = String(k.level || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      // Filter by both name and level
      return (
        className.includes(query) || (selectedLevel && level === selectedLevel)
      );
    });
  }, [kelas, searchQuery, selectedLevel]);

  // Paginate filtered Kelas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKelas = filteredKelas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredKelas.length / itemsPerPage)
  );

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <TitleCard title="Master Kelas" topMargin="mt-2">
        <div className="mb-4 flex justify-start items-start space-x-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Class Name"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Classes"
          />

          {/* Level Filter */}
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            aria-label="Filter by Level"
          >
            <option value="">All Levels</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
          </select>
        </div>

        {status === "failed" && error && (
          <div className="text-red-500 mb-4">
            {typeof error === "string"
              ? error
              : error.message || "Unknown error occurred"}
          </div>
        )}

        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Nama Kelas</th>
                <th className="px-4 py-2 text-left">Tingkat</th>
              </tr>
            </thead>
            <tbody>
              {currentKelas.length > 0 ? (
                currentKelas.map((k, index) => (
                  <tr
                    key={k.id || index}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2">{k.name}</td>
                    <td className="px-4 py-2">{k.level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <div className="btn-group space-x-2">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="btn btn-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
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

export default MasterKelas;
