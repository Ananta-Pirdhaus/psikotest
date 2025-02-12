import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getSesiContent } from "./hasilQuizSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import {
  TrashIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"; // Import ikon tambahan

function HasilQuiz() {
  const { quizResults } = useSelector((state) => state.hasilQuiz);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    dispatch(getSesiContent());
    console.log("HasilQuiz -> quizResults", quizResults);
  }, [dispatch]);

  const deleteCurrentResult = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this result?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SESI_DELETE,
          id,
        },
      })
    );
  };

  // Fungsi navigasi berdasarkan jenis status
  const goToSurvey = (id) => {
    window.open(`http://localhost:5173/survey/${id}`, "_blank");
  };

  const goToResult = (id) => {
    window.open(`http://localhost:5173/hasil-quiz/${id}`, "_blank");
  };

  return (
    <>
      <TitleCard title="Hasil Quiz" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Peserta</th>
                <th>Kelas</th>
                <th>Versi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quizResults && quizResults.length > 0 ? (
                quizResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.participant.name}</td>
                    <td>{result.participant.class}</td>
                    <td>{result.version.name}</td>
                    <td>{result.status}</td>
                    <td className="flex gap-2">
                      {/* Ikon Survei */}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => goToSurvey(result.id)}
                        title="Lihat Survei"
                      >
                        <ClipboardDocumentListIcon className="w-5 text-blue-500" />
                      </button>

                      {/* Ikon Hasil */}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => goToResult(result.id)}
                        title="Lihat Hasil"
                      >
                        <EyeIcon className="w-5 text-green-500" />
                      </button>

                      {/* Ikon Hapus */}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentResult(result.id)}
                        title="Hapus Hasil"
                      >
                        <TrashIcon className="w-5 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No results available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default HasilQuiz;
