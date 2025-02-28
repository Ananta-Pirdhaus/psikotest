import moment from "moment";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getProfesi, deleteProfesi, importProfesiData } from "./profesiSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"; // Import Eye Icon
import PencilIcon from "@heroicons/react/24/outline/PencilIcon"; // Import Pencil Icon
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";

const TopSideButtons = ({ onImport }) => {
  const dispatch = useDispatch();

  const openAddNewProfesiModal = () => {
    dispatch(
      openModal({
        title: "Tambahkan Profesi Baru",
        bodyType: MODAL_BODY_TYPES.ADD_PROFESI_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2 text-white">
      <button
        className="btn btn-sm normal-case btn-primary flex items-center gap-2"
        onClick={openAddNewProfesiModal}
      >
        <PlusCircleIcon className="w-5 h-5 text-white" />
        <p className="text-white">Tambah Profesi</p>
      </button>
    </div>
  );
};

function Profesi() {
  const profesi = useSelector((state) => state.profesi.profesi);
  const status = useSelector((state) => state.profesi.status);
  const error = useSelector((state) => state.profesi.error);
  const [selectedProfesiData, setSelectedProfesiData] = useState(null);
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
          message: `Apakah anda ingin menghapus profesi ini?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.PROFESI_DELETE,
          id, // Kirim ID peserta
        },
      })
    );
  };

  const viewProfesi = (id, profesi) => {
    console.log("View Profesi:", id);
    console.log("Data Profesi:", profesi);
    dispatch(
      openModal({
        title: "View Profesi",
        bodyType: MODAL_BODY_TYPES.VIEW_PROFESI,
        extraObject: { id, profesi }, // Kirim seluruh data profesi
      })
    );
  };

  const updateProfesi = (id, profesi) => {
    console.log("Update Profesi:", profesi);
    console.log("Update Profesi:", id);
    dispatch(
      openModal({
        title: "Ubah Profesi",
        bodyType: MODAL_BODY_TYPES.UPDATE_PROFESI,
        extraObject: { id, profesi }, // Kirim seluruh data profesi
      })
    );
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
        {/* {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Failed to load data.</p>} */}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari Berdasarkan Nama Profesi"
            className="input input-bordered w-full max-w-xs bg-white"
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

                <th className="px-4 py-2 text-center">Aksi</th>
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
                      ? p.bakat.map((b) => b.name).join(", ")
                      : "No Bakat"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateProfesi(p.id, p)}
                      aria-label="Edit Profesi Record"
                    >
                      <PencilIcon className="w-5 text-blue-500" />
                    </button>
                    {/* <button
                      className="btn btn-square btn-ghost"
                      onClick={() => viewProfesi(p.id, p)}
                      aria-label="View Profesi Record"
                    >
                      <EyeIcon className="w-5 text-green-500" />
                    </button> */}
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
