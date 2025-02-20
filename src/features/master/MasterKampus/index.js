import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { useDispatch, useSelector } from "react-redux";
import { getKampus, deleteKampus } from "./kampuSlice"; // Adjust import path
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewKampusModal = () => {
    dispatch(
      openModal({
        title: "Add New Kampus",
        bodyType: MODAL_BODY_TYPES.KAMPUS_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={openAddNewKampusModal}
      >
        Add New
      </button>
    </div>
  );
};

const Kampus = () => {
  const dispatch = useDispatch();
  const { kampus, loading, error } = useSelector((state) => state.kampus);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Default to ascending order

  useEffect(() => {
    dispatch(getKampus());
  }, [dispatch]);

  const deleteCurrentKampus = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this campus?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.CAMPUS_DELETE,
          id, // Kirim ID peserta
        },
      })
    );
  };

  const updateKampus = (id, kampusDetail) => {
    dispatch(
      openModal({
        title: "Update Kampus",
        bodyType: MODAL_BODY_TYPES.KAMPUS_UPDATE,
        extraObject: { id, kampusDetail },
      })
    );
  };

  const viewKampus = (id, kampusDetail) => {
    console.log("id yang dipanggil: ", id);
    console.log("data yang dipanggil: ", kampusDetail);
    dispatch(
      openModal({
        title: "Kampus Details",
        bodyType: MODAL_BODY_TYPES.KAMPUS_VIEW,
        extraObject: { id, kampusDetail },
      })
    );
  };

  const filteredKampus = useMemo(() => {
    let sortedKampus = [...kampus];
    if (sortOrder === "ascending") {
      sortedKampus.sort((a, b) => a.rank - b.rank);
    } else {
      sortedKampus.sort((a, b) => b.rank - a.rank);
    }
    return sortedKampus.filter((k) =>
      String(k.name).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [kampus, searchQuery, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKampus = filteredKampus.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredKampus.length / itemsPerPage);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) =>
      prevOrder === "ascending" ? "descending" : "ascending"
    );
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <>
      <TitleCard
        title="Master Kampus"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Cari Berdasarkan Nama Kampus"
            className="input input-bordered w-full max-w-xs bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Kampus"
          />

          {/* Sorting Button */}
          <button
            className="btn btn-sm flex items-center"
            onClick={toggleSortOrder}
          >
            {sortOrder === "ascending" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span>Urutkan dari atas</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span>Urutkan dari bawah</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Nama Kampus</th>
                <th className="px-4 py-2 text-left">Ranking</th>
                <th className="px-4 py-2 text-left">Jurusan</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentKampus.map((k, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{k.name}</td>
                  <td className="px-4 py-2">{k.rank}</td>
                  <td className="px-4 py-2">
                    {k.jurusan && k.jurusan.length > 0
                      ? k.jurusan.map((j) => j.name).join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateKampus(k.id, k)}
                      title="Update Kampus"
                    >
                      <PencilIcon className="w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => viewKampus(k.id, k)}
                      title="Lihat Detail Kampus"
                    >
                      <EyeIcon className="w-5 text-green-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentKampus(k.id)}
                      title="Hapus Kampus"
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
          <div className="btn-group space-x-2">
            <button
              className="btn btn-sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
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
            >
              Next
            </button>
          </div>
        </div>
      </TitleCard>
    </>
  );
};

export default Kampus;
