import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon"; // Import PencilIcon for Update
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"; // Import EyeIcon for View
import { useDispatch, useSelector } from "react-redux";
import { getJurusan, deleteJurusan } from "./jurusanSlice"; // Adjust import based on file structure
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";
import { Title } from "chart.js";

const TopSideButtons = () => {
  const dispatch = useDispatch();
  const openAddNewJurusanModal = () => {
    dispatch(
      openModal({
        title: "Add New Jurusan",
        bodyType: MODAL_BODY_TYPES.JURUSAN_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={openAddNewJurusanModal}
      >
        Add New
      </button>
    </div>
  );
};

function Jurusan() {
  const dispatch = useDispatch();
  const { jurusan, loading, error } = useSelector((state) => state.jurusan); // Accessing the state from the Redux store
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getJurusan()); // Fetch jurusan data when the component mounts
  }, [dispatch]);

  const deleteCurrentJurusan = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this jurusan?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.JURUSAN_DELETE,
          id, // Kirim ID peserta
        },
      })
    );
  };

  const updateJurusan = (id, jurusanDetail) => {
    console.log(`Updating Jurusan with ID: ${id}`);
    console.log("Jurusan Details: ", jurusanDetail); // Log the jurusan details
    dispatch(
      openModal({
        title: "Update Jurusan",
        bodyType: MODAL_BODY_TYPES.JURUSAN_UPDATE,
        extraObject: { id, jurusanDetail }, // Perbaikan pada struktur objek
      })
    );
  };

  const viewJurusan = (id, jurusanDetail) => {
    console.log(`Viewing details for Jurusan with ID: ${id}`);
    console.log("Jurusan Details: ", jurusanDetail); // Log the jurusan details
    dispatch(
      openModal({
        title: "Jurusan Details",
        bodyType: MODAL_BODY_TYPES.JURUSAN_VIEW,
        extraObject: { id, jurusanDetail }, // Perbaikan pada struktur objek
      })
    );
  };

  const filteredJurusan = useMemo(() => {
    return jurusan.filter((j) => {
      const namaJurusan = String(j.name).toLowerCase();
      return namaJurusan.includes(searchQuery.toLowerCase());
    });
  }, [jurusan, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJurusan = filteredJurusan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredJurusan.length / itemsPerPage);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <>
      <TitleCard
        title="Master Jurusan"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari Berdasarkan Nama Jurusan"
            className="input input-bordered w-full max-w-xs bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Jurusan"
          />
        </div>

        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Nama Jurusan</th>
                <th className="px-4 py-2 text-left">Bakat</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentJurusan.map((j, k) => (
                <tr
                  key={k}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{j.name}</td>
                  <td className="px-4 py-2">
                    {j.bakat && j.bakat.length > 0
                      ? j.bakat.map((b) => b.name).join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateJurusan(j.id, j)}
                      aria-label="Update Jurusan Record"
                    >
                      <PencilIcon className="w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => viewJurusan(j.id, j)}
                      aria-label="View Jurusan Record"
                    >
                      <EyeIcon className="w-5 text-green-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentJurusan(j.id)}
                      aria-label="Delete Jurusan Record"
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

export default Jurusan;
