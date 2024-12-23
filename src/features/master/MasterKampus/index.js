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

  const handleFileUpload = async (event) => {
    // Handle file upload logic here
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
        onClick={openAddNewKampusModal}
      >
        Add New
      </button>
    </div>
  );
};

function Kampus() {
  const dispatch = useDispatch();
  const { kampus, loading, error } = useSelector((state) => state.kampus);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getKampus());
  }, [dispatch]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(getKampus());
        console.log("Data from getKampus:", data); // Log the data returned by the action
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const deleteCurrentKampus = (id) => {
    dispatch(deleteKampus(id)); // Dispatch delete action
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
    dispatch(
      openModal({
        title: "Kampus Details",
        bodyType: MODAL_BODY_TYPES.KAMPUS_VIEW,
        extraObject: { id, kampusDetail },
      })
    );
  };

  const filteredKampus = useMemo(() => {
    return kampus.filter((k) => {
      const namaKampus = String(k.name).toLowerCase();
      return namaKampus.includes(searchQuery.toLowerCase());
    });
  }, [kampus, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKampus = filteredKampus.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredKampus.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <TitleCard
        title="Master Kampus"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Kampus Name"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Kampus"
          />
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
                    {k.jurusan ? k.jurusan.join(", ") : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateKampus(k.id, k)}
                    >
                      <PencilIcon className="w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => viewKampus(k.id, k)}
                    >
                      <EyeIcon className="w-5 text-green-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentKampus(k.id)}
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
}

export default Kampus;
