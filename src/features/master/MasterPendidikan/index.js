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
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import { fetchSekolah } from "./sekolahSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewSekolahModal = () => {
    dispatch(
      openModal({
        title: "Tambahkan Sekolah Baru",
        bodyType: MODAL_BODY_TYPES.SEKOLAH_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2 text-white">
      <button
        className="btn btn-sm normal-case btn-primary flex items-center gap-2"
        onClick={openAddNewSekolahModal}
      >
        <PlusCircleIcon className="w-5 h-5 text-white" />
        <p className="text-white">Tambah Sekolah</p>
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
    dispatch(
      fetchSekolah({ level: selectedLevel || undefined, page: currentPage })
    );
  }, [dispatch, selectedLevel, currentPage]);

  const deleteCurrentSekolah = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Apakah anda ingin menghapus sekolah ini?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SEKOLAH_DELETE,
          id,
        },
      })
    );
  };

  const updateSekolahDetails = (sekolah) => {
    dispatch(
      openModal({
        title: "Ubah Sekolah",
        bodyType: MODAL_BODY_TYPES.UPDATE_SEKOLAH,
        extraObject: sekolah,
      })
    );
  };

  const filteredSekolah = useMemo(() => {
    if (!sekolah) return [];
    return sekolah.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const level = (p.level || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        name.includes(query) &&
        (!selectedLevel || level === selectedLevel.toLowerCase())
      );
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
      dispatch(
        fetchSekolah({ level: selectedLevel || undefined, page: pageNumber })
      );
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
          className="btn w-full max-w-xs"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          aria-label="Filter by Level"
        >
          <option value="">Semua Tingkat</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
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
            {currentSekolah.length > 0 ? (
              currentSekolah.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.level}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateSekolahDetails(p)}
                    >
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentSekolah(p.id)}
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
    </TitleCard>
  );
}

export default MasterPendidikan;
