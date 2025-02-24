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
import { fetchVersiPertanyaan, importVersiPertanyaan } from "./versiSlice";
import { showNotification } from "../../common/headerSlice";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewMasterModal = () => {
    dispatch(
      openModal({
        title: "Add Version",
        bodyType: MODAL_BODY_TYPES.VERSI_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2 text-white">
      <button
        className="btn btn-sm normal-case btn-primary flex items-center gap-2"
        onClick={openAddNewMasterModal}
      >
        <PlusCircleIcon className="w-5 h-5 text-white" />
        <p className="text-white">Tambah Versi</p>
      </button>
    </div>
  );
};

const MasterVersion = () => {
  const { versi, error, status, message } = useSelector((state) => state.versi);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchVersiPertanyaan(currentPage)).catch((error) => {
      console.error("Error fetching versi pertanyaan:", error);
    });
  }, [dispatch, currentPage]);

  const filteredMasterData = useMemo(() => {
    if (!versi || !versi.length) return [];
    return versi.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const statusMatch = selectedStatus
        ? item.status === selectedStatus
        : true;
      return name.includes(query) && statusMatch;
    });
  }, [versi, searchQuery, selectedStatus]);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredMasterData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMasterData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const updateMasterDetails = (item) => {
    dispatch(
      openModal({
        title: "Update Versi Pertanyaan",
        bodyType: MODAL_BODY_TYPES.VERSI_UPDATE_NEW,
        extraObject: { item },
      })
    );
  };

  const deleteCurrentMaster = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this versi?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.VERSI_DELETE,
          id,
        },
      })
    );
  };

  return (
    <TitleCard
      title="Master Versi"
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
          placeholder="Cari Berdasarkan Nama Versi"
          className="input input-bordered w-full max-w-xs bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedStatus}
          onChange={(e) => setselectedStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="Active">Aktif</option>
          <option value="Inactive">Tidak Aktif</option>
        </select>
      </div>

      <div className="overflow-x-auto w-full mt-4">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateMasterDetails(item)}
                    >
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentMaster(item.id)}
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default MasterVersion;
