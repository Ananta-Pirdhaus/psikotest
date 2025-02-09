import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getSesiContent } from "./hasilQuizSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

function HasilQuiz() {
  const { quizResults } = useSelector((state) => state.hasilQuiz);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSesiContent());
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
                <th></th>
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
                    <td>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteCurrentResult(result.id)}
                      >
                        <TrashIcon className="w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No results available.</td>
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
