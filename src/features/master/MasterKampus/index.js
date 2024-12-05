import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import {
  deleteEducation,
  getEducationContent,
  importEducationData,
} from "./kampuSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { showNotification } from "../../common/headerSlice";
import * as XLSX from "xlsx";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewEducationModal = () => {
    dispatch(
      openModal({
        title: "Add New Education",
        bodyType: MODAL_BODY_TYPES.EDUCATION_ADD_NEW,
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

        // Memproses data sesuai struktur CSV dan menghindari duplikat
        const formattedData = sheetData
          .map((row) => ({
            No: row["No"], // Nomor baris
            NamaProdi: row["Nama Prodi"]?.toLowerCase(), // Normalisasi ke lowercase
            NamaPT: row["Nama PT"],
            Jenjang: row["Jenjang"],
            LLDikti: row["LLDikti"],
          }))
          .filter((row, index, self) => {
            // Filter untuk menghilangkan duplikat berdasarkan NamaProdi dan NamaPT
            return (
              index ===
              self.findIndex(
                (r) => r.NamaProdi === row.NamaProdi && r.NamaPT === row.NamaPT
              )
            );
          });

        // Console log hasil data yang diformat
        console.log("Formatted Data (duplicates removed):", formattedData);

        // Mengirimkan data ke Redux
        dispatch(importEducationData(formattedData));
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
        onClick={() => openAddNewEducationModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Education() {
  const { education } = useSelector((state) => state.education);
  const dispatch = useDispatch();

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getEducationContent());
  }, [dispatch]);

  // Memfilter data berdasarkan searchQuery
  const filteredEducation = education.filter((e) => {
    const nama = e.NamaProdi ? String(e.NamaProdi).toLowerCase() : "";
    const lldikti = e.LLDikti ? String(e.LLDikti).toLowerCase() : "";

    return (
      nama.includes(searchQuery.toLowerCase()) ||
      lldikti.includes(searchQuery.toLowerCase())
    );
  });

  // Pastikan currentPage tidak melebihi total halaman setelah filter
  useEffect(() => {
    if (currentPage > Math.ceil(filteredEducation.length / itemsPerPage)) {
      setCurrentPage(1); // Reset ke halaman pertama jika data berkurang
    }
  }, [filteredEducation, currentPage, itemsPerPage]);

  // Memotong data berdasarkan halaman yang aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEducation = filteredEducation.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Menghitung total halaman
  const totalPages = Math.ceil(filteredEducation.length / itemsPerPage);

  const deleteCurrentEducation = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this education record?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.EDUCATION_DELETE,
          index,
        },
      })
    );
  };

  return (
    <>
      <TitleCard
        title="Master Kampus"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Program Name or LLDikti"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-outline btn-sm ml-2"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        </div>

        {/* Education List in table format loaded from slice after API call */}
        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Nama Prodi</th>
                <th className="px-4 py-2 text-left">Nama PT</th>
                <th className="px-4 py-2 text-left">Jenjang</th>
                <th className="px-4 py-2 text-left">LLDikti</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentEducation.map((e, k) => (
                <tr
                  key={k}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{e.NamaProdi}</td>
                  <td className="px-4 py-2">{e.NamaPT}</td>
                  <td className="px-4 py-2">{e.Jenjang}</td>
                  <td className="px-4 py-2">{e.LLDikti}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentEducation(k)}
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
          <div className="btn-group">
            <button
              className="btn btn-sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button className="btn btn-sm">{currentPage}</button>
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
}

export default Education;
