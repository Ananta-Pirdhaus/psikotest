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
import { fetchSekolah, importSekolah } from "./sekolahSlice";
import { showNotification } from "../../common/headerSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewSekolahModal = () => {
    dispatch(
      openModal({
        title: "Add New School",
        bodyType: MODAL_BODY_TYPES.SEKOLAH_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={openAddNewSekolahModal}
      >
        Add New
      </button>
    </div>
  );
};

function MasterPendidikan() {
  const { sekolah, error, meta, status, message } = useSelector(
    (state) => state.sekolah
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSekolah({ level: selectedLevel, page: currentPage }));
  }, [dispatch, selectedLevel, currentPage]);

  const deleteCurrentSekolah = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this school record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SEKOLAH_DELETE,
          id,
        },
      })
    );
  };

  const updateSekolahDetails = (sekolah) => {
    dispatch(
      openModal({
        title: "Update School",
        bodyType: MODAL_BODY_TYPES.UPDATE_SEKOLAH,
        extraObject: sekolah,
      })
    );
  };

  const viewSekolahDetails = (sekolah) => {
    console.log("Viewing school details:", sekolah);
    dispatch(
      openModal({
        title: "School Details",
        bodyType: MODAL_BODY_TYPES.SEKOLAH_VIEW_DETAIL,
        extraObject: sekolah,
      })
    );
  };

  const filteredSekolah = useMemo(() => {
    if (!sekolah) return [];
    return sekolah.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const level = String(p.level || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || (selectedLevel && level === selectedLevel);
    });
  }, [sekolah, searchQuery, selectedLevel]);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSekolah = filteredSekolah.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = meta?.last_page || 1;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      dispatch(fetchSekolah({ level: selectedLevel, page: pageNumber }));
    }
  };

  return (
    <TitleCard
      title="Master Sekolah"
      topMargin="mt-2"
      TopSideButtons={<TopSideButtons />}
    >
      {status && message && (
        <div
          className={`text-${status === "failed" ? "red" : "green"}-500 mb-4`}
        >
          {message}
        </div>
      )}

      <div className="mb-4 flex justify-start items-start space-x-2">
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama Sekolah"
          className="input input-bordered w-full max-w-xs bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="btn  w-full max-w-xs flex items-center"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          aria-label="Filter by Level"
        >
          <option
            value=""
            className="bg-white text-start flex items-start justify-start"
          >
            All Levels
          </option>
          <option
            value="SMP"
            className="bg-white text-start flex items-start justify-start"
          >
            SMP
          </option>
          <option
            value="SMA"
            className="bg-white text-start flex items-start justify-start"
          >
            SMA
          </option>
        </select>
      </div>
      <div className="overflow-x-auto w-full mt-4">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Nama Sekolah</th>
              <th className="px-4 py-2 text-left">Tingkat</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sekolah?.length > 0 ? (
              currentSekolah.map((p, index) => (
                <tr key={p.id || index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.level}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateSekolahDetails(p)}
                      title="Update Sekolah"
                    >
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => viewSekolahDetails(p)}
                      title="Lihat Detail Sekolah"
                    >
                      <EyeIcon className="h-5 w-5 text-green-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentSekolah(p.id)}
                      title="Hapus Sekolah"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No school records found.
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
