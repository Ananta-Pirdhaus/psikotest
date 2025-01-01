import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { deleteSoal, fetchSoal, importSoalData } from "./soalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { showNotification } from "../../common/headerSlice";
import * as XLSX from "xlsx";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewSoalModal = () => {
    dispatch(
      openModal({
        title: "Add New Question",
        bodyType: MODAL_BODY_TYPES.SOAL_ADD_NEW,
      })
    );
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = ["csv", "xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      dispatch(
        showNotification({
          message: "Invalid file format. Please upload a CSV or XLSX file.",
          type: "error",
        })
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          defval: "",
        });

        const formattedData = sheetData
          .map((row) => ({
            nama_soal: row["Nama Soal"] || "",
            deskripsi_singkat: row["Deskripsi Singkat"] || "",
            pilihan_jawaban: row["Pilihan Jawaban"] || "",
            jawaban_benar: row["Jawaban Benar"] || "",
            kategori: row["Kategori"] || "",
          }))
          .filter(
            (row, index, self) =>
              row.nama_soal &&
              index === self.findIndex((r) => r.nama_soal === row.nama_soal)
          );

        dispatch(importSoalData(formattedData));
      } catch (error) {
        dispatch(
          showNotification({
            message: "Error processing file. Please check the format.",
            type: "error",
          })
        );
      }
    };

    reader.readAsArrayBuffer(file);
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
        onClick={openAddNewSoalModal}
      >
        Add New
      </button>
    </div>
  );
};

function MasterSoal() {
  const { soal, status, error } = useSelector((state) => state.soal);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchSoal());
  }, [dispatch]);

  const deleteCurrentSoal = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this question record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SOAL_DELETE,
          index,
        },
      })
    );
  };

  const updateSoalDetails = (soal) => {
    dispatch(
      openModal({
        title: "Update Question",
        bodyType: MODAL_BODY_TYPES.SOAL_UPDATE,
        extraObject: soal,
      })
    );
  };

  const viewSoalDetails = (soal) => {
    dispatch(
      openModal({
        title: "Question Details",
        bodyType: MODAL_BODY_TYPES.SOAL_VIEW,
        extraObject: soal,
      })
    );
  };

  const filteredSoal = useMemo(() => {
    return soal.filter((s) => {
      const questionName = String(s.question || "").toLowerCase();
      const category = String(s.kategori || "").toLowerCase();

      return (
        questionName.includes(searchQuery.toLowerCase()) ||
        category.includes(searchQuery.toLowerCase())
      );
    });
  }, [soal, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSoal = filteredSoal.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSoal.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <TitleCard
        title="Master Soal"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Question Name or Category"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari Soal"
          />
        </div>

        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Question</th>
              <th>Category</th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSoal.map((s, index) => (
              <tr key={index}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td>{s.question}</td>
                <td>{s.type}</td>
                <td>
                  <ul>
                    {s.options.map((option, idx) => (
                      <li key={idx} className="mb-2 p-2 rounded-lg bg-gray-100">
                        <div className="flex items-center">
                          {/* Display Answer with Highlight */}
                          <div className="mr-2">
                            <strong className="text-blue-500">Answer: </strong>
                            <span className="text-lg font-semibold text-green-600">
                              {option.answer}
                            </span>
                          </div>

                          {/* Display Bakat with Badge */}
                          <div>
                            <strong className="text-indigo-500">Bakat: </strong>
                            <span
                              className={`px-2 py-1 rounded-full ${
                                option.bakat ? "bg-yellow-200" : "bg-gray-300"
                              }`}
                            >
                              {option.bakat ? option.bakat : "N/A"}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => viewSoalDetails(s)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => updateSoalDetails(s)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteCurrentSoal(s.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm mx-1 ${
                page === currentPage ? "btn-active" : ""
              }`}
              onClick={() => paginate(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </TitleCard>
    </>
  );
}

export default MasterSoal;
