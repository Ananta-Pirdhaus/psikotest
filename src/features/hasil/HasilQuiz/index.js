import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "@heroicons/react/24/outline";

function HasilQuiz() {
  const { quizResults } = useSelector((state) => state.hasilQuiz);
  const dispatch = useDispatch();

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

  const viewResultQuiz = (id) => {
    dispatch(
      openModal({
        title: "Result Quiz",
        bodyType: MODAL_BODY_TYPES.RESULT_QUIZ,
        extraObject: id,
      })
    );
  };

  const viewResultSurvei = (id) => {
    dispatch(
      openModal({
        title: "Result Survei",
        bodyType: MODAL_BODY_TYPES.RESULT_SURVEI,
        extraObject: id,
      })
    );
  };

  return (
    <>
      <TitleCard title="Hasil Quiz" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th>Nama Peserta</th>
                <th>Kelas</th>
                <th>Sekolah</th>
                <th>Versi</th>
                <th>Status</th>
                <th>Tanggal Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quizResults && quizResults.length > 0 ? (
                quizResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.participant.name}</td>
                    <td>{result.participant.class}</td>
                    <td>{result.participant.school}</td>
                    <td>{result.version.name}</td>
                    <td>{result.status}</td>
                    <td>
                      {moment(result.created_at).format("DD-MM-YYYY HH:mm")}
                    </td>
                    <td className="flex gap-2">
                      {/* Ikon Lihat Survei */}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => viewResultSurvei(result.id)}
                        title="Lihat Survei"
                      >
                        <ClipboardDocumentListIcon className="w-5 text-blue-500" />
                      </button>

                      {/* Ikon Lihat Hasil Quiz */}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => viewResultQuiz(result.id)}
                        title="Lihat Hasil Quiz"
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
                  <td colSpan="7" className="text-center">
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
