import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { deleteBakat, fetchBakat, importBakatData } from "./bakatSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import { showNotification } from "../../common/headerSlice";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewBakatModal = () => {
    dispatch(
      openModal({
        title: "Tambahkan Bakat Baru",
        bodyType: MODAL_BODY_TYPES.SKILL_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2">
      <div className="inline-block float-right space-x-2 text-white">
        <button
          className="btn btn-sm normal-case btn-primary flex items-center gap-2"
          onClick={openAddNewBakatModal}
        >
          <PlusCircleIcon className="w-5 h-5 text-white" />
          <p className="text-white">Tambah Bakat</p>
        </button>
      </div>
    </div>
  );
};

function MasterBakat() {
  const { bakat, status, error } = useSelector((state) => state.bakat);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchBakat());
  }, [dispatch]);

  const deleteCurrentBakat = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Apakah anda ingin menghapus bakat ini?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SKILL_DELETE,
          id,
        },
      })
    );
  };

  const updateBakatDetails = (bakat) => {
    dispatch(
      openModal({
        title: "Ubah Bakat",
        bodyType: MODAL_BODY_TYPES.SKILL_UPDATE,
        extraObject: bakat, // Mengirim seluruh objek bakat termasuk ID
      })
    );
  };

  const viewBakatDetails = (bakat) => {
    dispatch(
      openModal({
        title: "Detail Bakat",
        bodyType: MODAL_BODY_TYPES.SKILL_VIEW,
        extraObject: bakat, // Mengirim seluruh objek bakat termasuk ID
      })
    );
  };

  const filteredBakat = useMemo(() => {
    return bakat.filter((s) => {
      const skillName = String(s.name || "").toLowerCase();
      const category = String(s.short_description || "").toLowerCase();

      return (
        skillName.includes(searchQuery.toLowerCase()) ||
        category.includes(searchQuery.toLowerCase())
      );
    });
  }, [bakat, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBakat = filteredBakat.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBakat.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <TitleCard
        title="Master Bakat"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari Berdasarkan Nama atau Deskripsi Singkat"
            className="input input-bordered w-full max-w-xs bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari Bakat"
          />
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
                <th className="px-4 py-2 text-left">Nama Bakat</th>
                <th className="px-4 py-2 text-left">Deskripsi Singkat</th>
                <th className="px-4 py-2 text-left">Deskripsi Lengkap</th>
                <th className="px-4 py-2 text-left">Saran Pengembangan</th>
                <th className="px-4 py-2 text-left">Icon</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBakat.length > 0 ? (
                currentBakat.map((s, k) => (
                  <tr
                    key={s.id || k}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">
                      {s.short_description || "No description available"}
                    </td>

                    <td className="px-4 py-2">
                      {parse(DOMPurify.sanitize(s.full_description))}
                    </td>
                    <td className="px-4 py-2">
                      {parse(DOMPurify.sanitize(s.recommendation))}
                    </td>
                    <td className="px-4 py-2">
                      {s.icon ? (
                        <img
                          src={s.icon}
                          alt="Icon"
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="italic text-gray-500">No Icon</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => updateBakatDetails(s)} // Kirim seluruh objek bakat
                        aria-label="Update Skill Record"
                        title="Ubah Bakat"
                      >
                        <PencilIcon className="w-5 text-blue-500" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentBakat(s.id)}
                        aria-label="Delete Skill Record"
                        title="Hapus Bakat"
                      >
                        <TrashIcon className="w-5 text-red-500" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => viewBakatDetails(s)} // Kirim seluruh objek bakat
                        aria-label="View Skill Details"
                        title="Lihat Detail Bakat"
                      >
                        <EyeIcon className="w-5 text-green-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No skills found.
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
    </>
  );
}

export default MasterBakat;
