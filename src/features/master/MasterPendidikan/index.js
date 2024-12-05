import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { showNotification } from "../../common/headerSlice";
import axios from "axios"; // Using axios to fetch API data
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewEducationModal = () => {
    dispatch(
      openModal({
        title: "Add New Education",
        bodyType: "EDUCATION_ADD_NEW", // Adjust if needed
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2">
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
  const dispatch = useDispatch();

  // State for pagination and filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchQuery, setSearchQuery] = useState(""); // Search term for school name
  const [selectedKabupaten, setSelectedKabupaten] = useState(""); // Kabupatan filter
  const [selectedBentuk, setSelectedBentuk] = useState(""); // Bentuk (type) filter
  const [selectedProvinsi, setSelectedProvinsi] = useState(""); // Province filter
  const [selectedKecamatan, setSelectedKecamatan] = useState(""); // District filter

  const [schools, setSchools] = useState([]); // Store schools data
  const [totalData, setTotalData] = useState(0); // Track total data count

  // Fetch data when page or filter changes
  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    searchQuery,
    selectedKabupaten,
    selectedBentuk,
    selectedProvinsi,
    selectedKecamatan,
  ]);

  const fetchData = async () => {
    try {
      let url = `https://api-sekolah-indonesia.vercel.app/sekolah?s=${searchQuery}&page=${currentPage}&perPage=${itemsPerPage}`;

      if (selectedProvinsi) url += `&provinsi=${selectedProvinsi}`;
      if (selectedKabupaten) url += `&kab_kota=${selectedKabupaten}`;
      if (selectedKecamatan) url += `&kec=${selectedKecamatan}`;
      if (selectedBentuk) url += `&bentuk=${selectedBentuk}`;

      const response = await axios.get(url);
      setSchools(response.data.dataSekolah || []);
      setTotalData(response.data.total_data);
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(
        showNotification({ message: "Failed to fetch data", type: "error" })
      );
    }
  };

  // Get unique kabupaten, provinsi, bentuk values for filtering
  const kabupatenList = [
    ...new Set(schools.map((school) => school.kabupaten_kota)),
  ];
  const provinsiList = [...new Set(schools.map((school) => school.propinsi))];
  const bentukList = ["SD", "SMP", "SMA", "SMK"]; // Filter by school level

  // Filter schools based on searchQuery, kabupaten_kota, and bentuk
  const filteredSchools = schools.filter(
    (e) =>
      (e.sekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery === "") &&
      (e.kabupaten_kota.includes(selectedKabupaten) ||
        selectedKabupaten === "") &&
      (e.propinsi.includes(selectedProvinsi) || selectedProvinsi === "") &&
      (e.kecamatan.includes(selectedKecamatan) || selectedKecamatan === "") &&
      (e.bentuk.includes(selectedBentuk) || selectedBentuk === "")
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchools = filteredSchools.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <TitleCard
        title="Master Pendidikan"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by School Name"
            className="input input-bordered w-full max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters for Province, Kabupaten, District, and School Type */}
        <div className="mb-4 flex space-x-4">
          <select
            className="select select-bordered"
            value={selectedProvinsi}
            onChange={(e) => setSelectedProvinsi(e.target.value)}
          >
            <option value="">Select Province</option>
            {provinsiList.map((provinsi, index) => (
              <option key={index} value={provinsi}>
                {provinsi}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={selectedKabupaten}
            onChange={(e) => setSelectedKabupaten(e.target.value)}
          >
            <option value="">Select Kabupaten</option>
            {kabupatenList.map((kabupaten, index) => (
              <option key={index} value={kabupaten}>
                {kabupaten}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
          >
            <option value="">Select District</option>
            {schools.map((school, index) => (
              <option key={index} value={school.kecamatan}>
                {school.kecamatan}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={selectedBentuk}
            onChange={(e) => setSelectedBentuk(e.target.value)}
          >
            <option value="">Select Bentuk</option>
            {bentukList.map((bentuk, index) => (
              <option key={index} value={bentuk}>
                {bentuk}
              </option>
            ))}
          </select>
        </div>

        {/* School List in table format */}
        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm">
            <thead className="bg-info  border-b ">
              <tr>
                <th className="px-4 py-2 text-left">Nama Sekolah</th>
                <th className="px-4 py-2 text-left">Bentuk</th>
                <th className="px-4 py-2 text-left">Alamat</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentSchools.map((e, k) => (
                <tr
                  key={k}
                  className="border-b hover:bg-base-100  transition duration-200"
                >
                  <td className="px-4 py-2">{e.sekolah}</td>
                  <td className="px-4 py-2">{e.bentuk}</td>
                  <td className="px-4 py-2">{e.alamat_jalan}</td>
                  <td className="px-4 py-2">
                    <div
                      className={`badge ${
                        e.status === "S" ? "badge-primary" : "badge-ghost"
                      }`}
                    >
                      {e.status === "S" ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button className="btn btn-square btn-ghost">
                      <TrashIcon className="w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <div className="btn-group space-x-2">
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
