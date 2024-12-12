import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProvinces, fetchRegencies } from "./regionSlice";
import TitleCard from "../../../components/Cards/TitleCard";

const Region = () => {
  const dispatch = useDispatch();

  // State lokal untuk melacak provinsi terpilih dan regencies yang diambil
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [regenciesData, setRegenciesData] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch provinces and regencies
  const provinces = useSelector((state) => state.region.provinces);

  // Fetch provinces saat komponen pertama kali dimuat
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Fetch regencies saat provinsi dipilih
  useEffect(() => {
    if (selectedProvinceId) {
      dispatch(fetchRegencies(selectedProvinceId)).then((response) => {
        const { payload } = response; // Ambil payload dari respons
        if (payload && payload.regencies) {
          setRegenciesData(payload.regencies); // Update regenciesData
        }
      });
    } else {
      setRegenciesData([]); // Reset data jika tidak ada provinsi yang dipilih
    }
  }, [dispatch, selectedProvinceId]);

  // Paginate the data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRegencies = regenciesData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Total pages calculation
  const totalPages = Math.ceil(regenciesData.length / itemsPerPage);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <TitleCard title="Master Region" topMargin="mt-2">
        {/* Dropdown for selecting Province */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Provinsi:
          </label>
          <select
            className="border rounded px-4 py-2 w-full"
            value={selectedProvinceId || ""}
            onChange={(e) => setSelectedProvinceId(e.target.value || null)}
          >
            <option value="">-- Pilih Provinsi --</option>
            {(provinces.data || []).map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* Regencies List Table */}
        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama Kabupaten/Kota</th>
                <th className="px-4 py-2 text-left">No Provinsi</th>
              </tr>
            </thead>
            <tbody>
              {currentRegencies.length > 0 ? (
                currentRegencies.map((regency, k) => (
                  <tr
                    key={k}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2">{regency.id}</td>
                    <td className="px-4 py-2">{regency.name}</td>
                    <td className="px-4 py-2">{regency.provinceId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Tidak ada data kabupaten/kota.
                  </td>
                </tr>
              )}
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
};

export default Region;
