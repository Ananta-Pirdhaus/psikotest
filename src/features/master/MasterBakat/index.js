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
import { showNotification } from "../../common/headerSlice";
import * as XLSX from "xlsx";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewBakatModal = () => {
    dispatch(
      openModal({
        title: "Add New Skill",
        bodyType: MODAL_BODY_TYPES.SKILL_ADD_NEW,
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
            nama_bakat: row["Nama Bakat"] || "",
            deskripsi_singkat: row["Deskripsi Singkat"] || "",
            deskripsi_lengkap: row["Deskripsi Lengkap"] || "",
            saran_pengembangan: row["Saran Pengembangan"] || "",
            icon: row["Icon"] || "",
          }))
          .filter(
            (row, index, self) =>
              row.nama_bakat &&
              index === self.findIndex((r) => r.nama_bakat === row.nama_bakat)
          );

        dispatch(importBakatData(formattedData));
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
        onClick={openAddNewBakatModal}
      >
        Add New
      </button>
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
          message: "Are you sure you want to delete this skill record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SKILL_DELETE,
          id,
        },
      })
    );
  };

  const updateBakatDetails = (bakat) => {
    dispatch(
      openModal({
        title: "Update Skill",
        bodyType: MODAL_BODY_TYPES.SKILL_UPDATE,
        extraObject: bakat, // Mengirim seluruh objek bakat termasuk ID
      })
    );
  };

  const viewBakatDetails = (bakat) => {
    dispatch(
      openModal({
        title: "Skill Details",
        bodyType: MODAL_BODY_TYPES.SKILL_VIEW,
        extraObject: bakat, // Mengirim seluruh objek bakat termasuk ID
      })
    );
  };

  const filteredBakat = useMemo(() => {
    return bakat.filter((s) => {
      const skillName = String(s.nama_bakat || "").toLowerCase();
      const category = String(s.deskripsi_singkat || "").toLowerCase();

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
            placeholder="Search by Skill Name or Category"
            className="input input-bordered w-full max-w-xs"
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
                    <td className="px-4 py-2">{s.full_description}</td>
                    <td className="px-4 py-2">{s.recommendation}</td>
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
                      >
                        <PencilIcon className="w-5 text-blue-500" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentBakat(s.id)}
                        aria-label="Delete Skill Record"
                      >
                        <TrashIcon className="w-5 text-red-500" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => viewBakatDetails(s)} // Kirim seluruh objek bakat
                        aria-label="View Skill Details"
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
