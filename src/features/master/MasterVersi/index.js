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
import { fetchVersiPertanyaan, importVersiPertanyaan } from "./versiSlice"; // Correct import
import * as XLSX from "xlsx";
import { showNotification } from "../../common/headerSlice";

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
            name: row["Name"] || "",
            shortDescription: row["Short Description"] || "",
            detailedDescription: row["Detailed Description"] || "",
            address: row["Address"] || "",
            icon: row["Icon"] || "",
          }))
          .filter(
            (row, index, self) =>
              row.name && index === self.findIndex((r) => r.name === row.name)
          );

        dispatch(importVersiPertanyaan(formattedData));
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
        onClick={openAddNewMasterModal}
      >
        Add New
      </button>
    </div>
  );
};

const MasterVersion = () => {
  const { versi, error, status, message } = useSelector(
    (state) => state.versi // Mengambil data dari state versi
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Mengambil data versi pertanyaan saat komponen dimuat
  useEffect(() => {
    dispatch(fetchVersiPertanyaan(currentPage))
      .then((response) => {
        // console.log("Response from fetchVersiPertanyaan:", response);
      })
      .catch((error) => {
        console.error("Error fetching versi pertanyaan:", error);
      });
  }, [dispatch, currentPage]);

  // Filter data berdasarkan query pencarian
  const filteredMasterData = useMemo(() => {
    if (!versi || !versi.length) return []; // Pastikan data versi ada
    return versi.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query); // Filter berdasarkan nama
    });
  }, [versi, searchQuery]);

  // Pagination
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
    console.log("Update Master Details:", item);
    // Implementasikan logika untuk update data
    dispatch(
      openModal({
        title: "Update Versi Pertanyaan",
        bodyType: MODAL_BODY_TYPES.VERSI_UPDATE_NEW,
        extraObject: { item },
      })
    );
  };

  const viewMasterDetails = (item) => {
    console.log("View Master Details:", item);
    // Implementasikan logika untuk melihat data lebih lanjut
  };

  const deleteCurrentMaster = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this versi?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.VERSI_DELETE,
          id, // Kirim ID peserta
        },
      })
    );
  };

  return (
    <TitleCard
      title="Master Version"
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
          placeholder="Search by Name"
          className="input input-bordered w-full max-w-xs bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedStatus}
          onChange={(e) => setselectedStatus(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
  );
};

export default MasterVersion;
