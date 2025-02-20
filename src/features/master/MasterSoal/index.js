import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { deleteSoal, fetchSoal, importSoalData, fetchBakat } from "./soalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { showNotification } from "../../common/headerSlice";

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

  return (
    <div className="inline-block float-right space-x-2">
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
  const { soal, bakat, status, error } = useSelector((state) => state.soal);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectType, setSelectedType] = useState("");

  // Menampilkan daftar versi unik dari soal yang tersedia
  const uniqueVersions = useMemo(() => {
    const versions = soal.map((s) => s.versi);
    return [...new Set(versions)].filter(Boolean);
  }, [soal]);

  const uniqueType = useMemo(() => {
    const type = soal.map((s) => s.type);
    return [...new Set(type)].filter(Boolean);
  }, [soal]);

  const filteredSoal = useMemo(() => {
    return soal.filter((s) => {
      const questionName = String(s.question || "").toLowerCase();
      const category = String(s.kategori || "").toLowerCase();
      const versionMatch = selectedVersion ? s.versi === selectedVersion : true;
      const typeMatch = selectType ? s.type === selectType : true; // Tambahkan filter berdasarkan selectType

      return (
        (questionName.includes(searchQuery.toLowerCase()) ||
          category.includes(searchQuery.toLowerCase())) &&
        versionMatch &&
        typeMatch
      );
    });
  }, [soal, searchQuery, selectedVersion, selectType]); // Tambahkan `selectType` ke dalam dependency array

  useEffect(() => {
    dispatch(fetchSoal());
    dispatch(fetchBakat()); // Fetch bakat data
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

  // const filteredSoal = useMemo(() => {
  //   return soal.filter((s) => {
  //     const questionName = String(s.question || "").toLowerCase();
  //     const category = String(s.kategori || "").toLowerCase();

  //     return (
  //       questionName.includes(searchQuery.toLowerCase()) ||
  //       category.includes(searchQuery.toLowerCase())
  //     );
  //   });
  // }, [soal, searchQuery]);

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
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Cari Berdasarkan Nama Soal atau Kategori"
            className="input input-bordered w-full max-w-xs bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari Soal"
          />

          <select
            className="select select-bordered w-full max-w-xs"
            value={selectType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueType.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
          >
            <option value="">All Versions</option>
            {uniqueVersions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>

        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Question</th>
              <th>Category</th>
              <th>Version</th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentSoal) && currentSoal.length > 0 ? (
              currentSoal.map((s, index) => (
                <tr key={index}>
                  <td>{index + 1 + indexOfFirstItem}</td>
                  <td>{s.question}</td>
                  <td>{s.type}</td>
                  <td>{s.versi}</td>
                  <td>
                    <ul className="space-y-2">
                      {Array.isArray(s.options) && s.options.length > 0 ? (
                        s.options.map((option, idx) => (
                          <li
                            key={idx}
                            className={`p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-lg ${
                              idx % 2 === 0 ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              {/* Display Answer */}
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`font-medium ${
                                    option.bakat
                                      ? "text-white"
                                      : "text-gray-200"
                                  }`}
                                >
                                  {option.answer}
                                </span>
                              </div>
                              {/* Display Bakat Name */}
                              <div className="text-sm flex justify-end w-full">
                                {option.bakat ? (
                                  <span className="text-white font-semibold">
                                    {option.bakat}
                                  </span>
                                ) : (
                                  <span className="italic text-gray-200">
                                    {option.bakat_id === null
                                      ? "Bakat tidak tersedia"
                                      : "Bakat tidak dikenal"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <span className="italic text-gray-200">
                          No options available
                        </span>
                      )}
                    </ul>
                  </td>
                  <td className="flex justify-center space-x-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => updateSoalDetails(s)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteCurrentSoal(index)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => viewSoalDetails(s)}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <div className="btn-group space-x-2">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="btn btn-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
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

export default MasterSoal;
