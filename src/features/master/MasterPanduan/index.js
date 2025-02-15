import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { fetchPanduan } from "./panduanSlice";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";
import parse from "html-react-parser";
import DOMPurify from "dompurify"; // Opsional: untuk keamanan XSS

const MasterPanduan = () => {
  const dispatch = useDispatch();
  const { panduan, error, status, message } = useSelector(
    (state) => state.panduan
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPanduan(currentPage));
  }, [currentPage, dispatch]);

  const handleUpdatePanduan = (description) => {
    if (!description) {
      console.warn("Description tidak tersedia untuk diperbarui");
      return;
    }

    console.log("Description yang dikirim:", description);
    dispatch(
      openModal({
        title: "Update Panduan",
        bodyType: MODAL_BODY_TYPES.PANDUAN_UPDATE,
        extraObject: description, // Hanya mengirim description
      })
    );
  };

  const renderDescription = (description) => {
    if (!description) return "No description available";

    // Ubah semua <ul> menjadi <ol> agar semuanya bernomor
    let formattedDescription = description
      .replaceAll(/<ul>/g, "<ol>")
      .replaceAll(/<\/ul>/g, "</ol>");

    // Gabungkan <ol> berurutan agar nomornya tidak reset
    formattedDescription = formattedDescription.replace(/<\/ol>\s*<ol>/g, "");

    // Opsional: Bersihkan HTML dari potensi XSS
    const safeHTML = DOMPurify.sanitize(formattedDescription);

    return parse(safeHTML);
  };

  return (
    <TitleCard title="Master Guide" topMargin="mt-2">
      {status && message && (
        <div
          className={`text-${
            status === "failed" ? "red-500" : "green-500"
          } mb-4`}
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
            <tr>
              <td className="px-4 py-2">
                {/* Menambahkan class DaisyUI untuk list bernomor */}
                <div className="list-decimal list-outside pl-5">
                  {renderDescription(panduan?.description)}
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleUpdatePanduan(panduan?.description)}
                  disabled={!panduan?.description}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default MasterPanduan;
