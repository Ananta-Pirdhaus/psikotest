import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import {
  deleteJurusan,
  getJurusanContent,
  importJurusanData,
} from "./jurusanSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { showNotification } from "../../common/headerSlice";
import * as XLSX from "xlsx";

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          defval: "", // Mengisi nilai kosong jika ada sel kosong
        });

        // Memproses data sesuai struktur dan menghindari duplikat
        const formattedData = sheetData
          .map((row) => ({
            No: row["No"],
            NamaJurusan: row["NamaJurusan"]
              ? row["NamaJurusan"].toLowerCase()
              : "", // Normalize the name to lowercase
            Fakultas: row["Fakultas"] || "", // Default to empty string if undefined
          }))
          .filter((row, index, self) => {
            // Filter out duplicates based on normalized NamaJurusan field
            return (
              row.NamaJurusan && // Pastikan NamaJurusan tidak kosong
              index === self.findIndex((r) => r.NamaJurusan === row.NamaJurusan)
            );
          });

        // Console log hasil datanya
        console.log("Formatted Data (duplicates removed):", formattedData);

        // Mengirimkan data ke Redux
        dispatch(importJurusanData(formattedData));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="inline-block float-right space-x-2">
      <label className="btn px-6 btn-sm normal-case btn-secondary cursor-pointer">
        Import CSV/Excel
        <input
          type="file"
          accept=".csv, .xlsx"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
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
  const { jurusan } = useSelector((state) => state.jurusan);
  const dispatch = useDispatch();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getJurusanContent());
  }, [dispatch]);

  const deleteCurrentJurusan = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this jurusan record?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.JURUSAN_DELETE,
          index,
        },
      })
    );
  };

  // UseMemo to optimize filtering
  const filteredJurusan = useMemo(() => {
    return jurusan.filter((j) => {
      const namaJurusan = String(j.NamaJurusan).toLowerCase();
      const fakultas = String(j.Fakultas).toLowerCase();

      return (
        namaJurusan.includes(searchQuery.toLowerCase()) ||
        fakultas.includes(searchQuery.toLowerCase())
      );
    });
  }, [jurusan, searchQuery]);

  // Paginate the data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJurusan = filteredJurusan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredJurusan.length / itemsPerPage);

  return (
    <>
      <TitleCard
        title="Master Jurusan"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Jurusan Name or Faculty"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Jurusan"
          />
        </div>

        {/* Jurusan List Table */}
        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Nama Jurusan</th>
                <th className="px-4 py-2 text-left">Fakultas</th>
                <th className="px-4 py-2 text-left">Dibuat Pada</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentJurusan.map((j, k) => (
                <tr
                  key={k}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{j.NamaJurusan}</td>
                  <td className="px-4 py-2">{j.Fakultas}</td>
                  <td className="px-4 py-2">
                    {moment(j.created_at).format("DD MMM YYYY")}
                  </td>
                  <td className="px-4 py-2">
                    <div
                      className={`badge ${
                        j.is_active ? "badge-primary" : "badge-ghost"
                      }`}
                    >
                      {j.is_active ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentJurusan(k)}
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

export default Jurusan;
