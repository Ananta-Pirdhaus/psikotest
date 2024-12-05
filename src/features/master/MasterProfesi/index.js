import moment from "moment";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import {
  deleteProfesi,
  getProfesiContent,
  importProfesiData,
} from "./profesiSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { showNotification } from "../../common/headerSlice";
import * as XLSX from "xlsx";

const TopSideButtons = ({ onImport }) => {
  const dispatch = useDispatch();

  const openAddNewProfesiModal = () => {
    dispatch(
      openModal({
        title: "Add New Profesi",
        bodyType: MODAL_BODY_TYPES.PROFESI_ADD_NEW,
      })
    );
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvData = e.target.result;
        const workbook = XLSX.read(csvData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          defval: "",
        });

        const formattedData = sheetData
          .map((row) => ({
            ID: row[0],
            NamaProfesi: row[1] ? row[1].toLowerCase() : "",
          }))
          .filter((row, index, self) => {
            return (
              row.NamaProfesi &&
              index === self.findIndex((r) => r.NamaProfesi === row.NamaProfesi)
            );
          });

        onImport(formattedData);
        dispatch(importProfesiData(formattedData));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="inline-block float-right space-x-2">
      <label className="btn btn-secondary btn-sm normal-case">
        Import CSV/Excel
        <input
          type="file"
          accept=".csv, .xlsx"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
      <button
        className="btn btn-primary btn-sm normal-case"
        onClick={openAddNewProfesiModal}
      >
        Add New
      </button>
    </div>
  );
};

function Profesi() {
  const profesi = useSelector((state) => state.profesi?.profesi || []);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [importedProfesi, setImportedProfesi] = useState([]);

  useEffect(() => {
    dispatch(getProfesiContent());
  }, [dispatch]);

  const deleteCurrentProfesi = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: "Are you sure you want to delete this profesi record?",
          type: CONFIRMATION_MODAL_CLOSE_TYPES.PROFESI_DELETE,
          index,
        },
      })
    );
  };

  const filteredProfesi = useMemo(() => {
    return profesi.filter((p) => {
      const namaProfesi = String(p.NamaProfesi).toLowerCase();
      const institusi = String(p.Institusi).toLowerCase();
      return (
        namaProfesi.includes(searchQuery.toLowerCase()) ||
        institusi.includes(searchQuery.toLowerCase())
      );
    });
  }, [profesi, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfesi = filteredProfesi.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredProfesi.length / itemsPerPage);

  return (
    <>
      <TitleCard
        title="Master Profesi"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons onImport={setImportedProfesi} />}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Profesi Name or Institution"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Profesi</th>
                <th>Institusi</th>
                <th>Dibuat Pada</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentProfesi.map((p, k) => (
                <tr key={k} className="hover">
                  <td>{p.NamaProfesi}</td>
                  <td>{p.Institusi}</td>
                  <td>{moment(p.created_at).format("DD MMM YYYY")}</td>
                  <td>
                    <div
                      className={`badge ${
                        p.is_active ? "badge-primary" : "badge-ghost"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentProfesi(k)}
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

export default Profesi;
