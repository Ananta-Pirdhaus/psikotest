import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { fetchSekolah } from "./sekolahSlice"; // Import fetchSekolah action

function MasterPendidikan() {
  const { sekolah, loading, error, meta } = useSelector(
    (state) => state.sekolah
  ); // Akses data sekolah dari Redux store
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch education data based on selected level and current page
  useEffect(() => {
    dispatch(fetchSekolah({ level: selectedLevel, page: currentPage }));
  }, [dispatch, selectedLevel, currentPage]);

  // Log the data whenever it changes
  useEffect(() => {
    if (sekolah) {
      console.log("Fetched Pendidikan Data:", sekolah);
    }
  }, [sekolah]);

  const deleteCurrentPendidikan = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this education record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.PENDIDIKAN_DELETE,
          id,
        },
      })
    );
  };

  const updatePendidikanDetails = (pendidikan) => {
    dispatch(
      openModal({
        title: "Update Education",
        bodyType: MODAL_BODY_TYPES.PENDIDIKAN_UPDATE,
        extraObject: pendidikan,
      })
    );
  };

  const viewPendidikanDetails = (pendidikan) => {
    dispatch(
      openModal({
        title: "Education Details",
        bodyType: MODAL_BODY_TYPES.PENDIDIKAN_VIEW,
        extraObject: pendidikan,
      })
    );
  };

  // Filter Pendidikan based on search query and selected level
  const filteredPendidikan = useMemo(() => {
    if (!sekolah) return []; // Handle case when sekolah is undefined
    return sekolah.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const level = String(p.level || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || (selectedLevel && level === selectedLevel);
    });
  }, [sekolah, searchQuery, selectedLevel]);

  // Paginate filteredPendidikan
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPendidikan = filteredPendidikan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = meta?.last_page || 1; // Define totalPages based on the response

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber); // Update the current page
      dispatch(fetchSekolah({ level: selectedLevel, page: pageNumber }));
    }
  };

  return (
    <TitleCard title="Master Pendidikan" topMargin="mt-2">
      {/* Search and Level Filter */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Education Name"
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
        </select>
      </div>
      {/* Error handling */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {/* Education Table */}
      <div className="overflow-x-auto w-full mt-4">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Nama Pendidikan</th>
              <th className="px-4 py-2 text-left">Tingkat</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sekolah?.length > 0 ? (
              sekolah.map((p, index) => (
                <tr key={p.id || index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.level}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updatePendidikanDetails(p)}
                    >
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => viewPendidikanDetails(p)}
                    >
                      <EyeIcon className="h-5 w-5 text-green-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentPendidikan(p.id)}
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No education records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
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
  );
}

export default MasterPendidikan;
