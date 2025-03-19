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
  LinkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openResetQuiz = () => {
    dispatch(
      openModal({
        title: "Reset Quiz",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to reset this quiz?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.RESET_QUIZ,
        },
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2">
      <div className="inline-block float-right space-x-2 text-white">
        <button
          className="btn btn-sm normal-case bg-red-500 flex items-center gap-2"
          onClick={openResetQuiz}
        >
          <XCircleIcon className="w-5 h-5 text-white" />
          <p className="text-white">Reset Quiz</p>
        </button>
      </div>
    </div>
  );
};

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
        title: "Hasil Test Peserta",
        bodyType: MODAL_BODY_TYPES.RESULT_QUIZ,
        extraObject: id,
      })
    );
  };

  const viewResultSurvei = (id) => {
    dispatch(
      openModal({
        title: "Hasil Survei Peserta",
        bodyType: MODAL_BODY_TYPES.RESULT_SURVEI,
        extraObject: id,
      })
    );
  };

  return (
    <>
      <TitleCard
        title="Hasil Quiz"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
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
                        title="Lihat Test Quiz"
                      >
                        <EyeIcon className="w-5 text-green-500" />
                      </button>

                      {/* Ikon Lihat Report */}
                      <a
                        href={`https://careertheexplorer.com/hasil-quiz/${result.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-square btn-ghost"
                        title="Lihat Report"
                      >
                        <LinkIcon className="w-5 text-purple-500" />
                      </a>

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
