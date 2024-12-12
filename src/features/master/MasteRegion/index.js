import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { deleteRegion, fetchProvinces, fetchRegencies } from "./regionSlice";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

const Region = () => {
  const { provinces = [], regencies = [] } = useSelector(
    (state) => state.region
  );

  // Log for debugging regencies data
  console.log("Regencies:", regencies); // Check if regencies are available

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState(null); // Track the selected provinceId
  const [provinceIds, setProvinceIds] = useState([]);
  const previousProvinceIdsRef = useRef();

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    console.log("Provinces:", provinces);
  }, [provinces]);
  useEffect(() => {
    const provinceIds = provinces?.data?.map((province) => province.id);
    console.log("Province IDs:", provinceIds);
    setProvinceIds(provinceIds);
  }, [provinces]);

  useEffect(() => {
    if (Array.isArray(provinceIds) && provinceIds.length > 0) {
      // Hanya jalankan jika provinceIds baru berbeda dengan sebelumnya
      if (
        JSON.stringify(provinceIds) !==
        JSON.stringify(previousProvinceIdsRef.current)
      ) {
        console.log(
          "Starting to fetch regencies for province IDs:",
          provinceIds
        );
        provinceIds.forEach((provinceId) => {
          console.log(`Fetching regencies for province ID: ${provinceId}`);
          dispatch(fetchRegencies(provinceId));
        });

        // Update reference untuk provinceIds yang telah diproses
        previousProvinceIdsRef.current = provinceIds;
      }
    } else {
      console.log("No valid province IDs available to fetch regencies.");
    }
  }, [dispatch, provinceIds]); // This effect runs when 'provinceIds' changes

  const handleFetchRegencies = (provinceId) => {
    // Ensure that the provinceId is valid before proceeding
    if (!provinceId) {
      console.error("Province ID is missing or invalid");
      return;
    }

    console.log("Fetching regencies for province ID:", provinceId);
    setSelectedProvinceId(provinceId); // Trigger fetching regencies by setting the state
  };

  const filteredProvinces = useMemo(() => {
    if (!Array.isArray(provinces?.data)) return []; // Access provinces.data
    return provinces.data.filter((p) => {
      const namaRegion = String(p.NamaRegion || "").toLowerCase();
      return namaRegion.includes(searchQuery.toLowerCase());
    });
  }, [provinces?.data, searchQuery]);

  // Memoized currentProvinces for pagination based on filtered provinces
  const currentProvinces = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const result = filteredProvinces.slice(indexOfFirstItem, indexOfLastItem);
    return result;
  }, [filteredProvinces, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProvinces.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteRegion = (id) => {
    if (window.confirm("Are you sure you want to delete this region?")) {
      dispatch(deleteRegion(id));
    }
  };

  return (
    <TitleCard title="Master Region" topMargin="mt-2">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Region Name"
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search Region"
        />
      </div>

      <div className="overflow-x-auto w-full mt-4">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Nama Provinsi</th>
              <th className="px-4 py-2 text-left">Nama Kabupaten</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProvinces.length > 0 ? (
              currentProvinces.map((province, index) => (
                <tr
                  key={province.ID || index} // Ensure unique key
                  className="border-b hover:bg-gray-50 transition duration-200"
                  onClick={() => {
                    if (province.ID) {
                      handleFetchRegencies(province.ID); // Only call if province.ID is valid
                    } else {
                      console.error(
                        "Invalid Province ID clicked:",
                        province.ID
                      );
                    }
                  }}
                >
                  <td className="px-4 py-2">{province.name}</td>
                  <td className="px-4 py-2">
                    {/* Display regencies for the selected province */}
                    {Array.isArray(regencies) && regencies.length > 0 ? (
                      regencies
                        .filter(
                          (regency) => regency.province_id === province.ID
                        )
                        .map((regency) => (
                          <span key={regency.ID} className="mr-4">
                            {regency.name}
                          </span>
                        ))
                    ) : (
                      <p>No regencies available</p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteRegion(province.ID)}
                    >
                      <TrashIcon className="w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No data available.
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

export default Region;
