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
import { fetchPanduan } from "./panduanSlice"; // Import dari PanduanSlice.js
import { showNotification } from "../../common/headerSlice";

const TopSideButtons = () => {
  return (
    <div className="inline-block float-right space-x-2">
      {/* Removed the Add New button */}
    </div>
  );
};

const MasterPanduan = () => {
  const { panduan, error, status, message } = useSelector(
    (state) => state.panduan // Mengambil data dari state panduan
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [description, setDescription] = useState(""); // Tambahkan state untuk description

  // Mengambil data panduan saat komponen dimuat
  useEffect(() => {
    dispatch(fetchPanduan(currentPage)) // Tetap menggunakan fetchPanduan dari PanduanSlice.js
      .then((response) => {
        console.log("Response from fetchPanduan:", response);
        // Akses description dari payload dan simpan dalam state
        const newDescription = response.payload.description;
        setDescription(newDescription);
        console.log("Description:", newDescription); // Menampilkan description di konsol
      })
      .catch((error) => {
        console.error("Error fetching panduan:", error);
      });
  }, [dispatch, currentPage]);

  // Filter data berdasarkan query pencarian
  const filteredMasterData = useMemo(() => {
    if (!panduan || !panduan.length) return []; // Pastikan data panduan ada
    return panduan.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query); // Filter berdasarkan nama
    });
  }, [panduan, searchQuery]);

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
  };

  const viewMasterDetails = (item) => {
    console.log("View Master Details:", item);
    // Implementasikan logika untuk melihat data lebih lanjut
  };

  const deleteCurrentMaster = (id) => {
    console.log("Delete Master with ID:", id);
    // Implementasikan logika untuk menghapus data
  };

  return (
    <TitleCard
      title="Master Guide"
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

      <div className="overflow-x-auto w-full mt-4">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <td className="px-4 py-2">{description}</td>
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default MasterPanduan;
