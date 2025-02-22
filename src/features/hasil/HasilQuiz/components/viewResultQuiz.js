import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResultAnswer } from "../hasilQuizSlice";

function ViewQuizResult({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [resultDetail, setResultDetail] = useState([]);
  const { resultAnswer } = useSelector((state) => state.hasilQuiz);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (
      resultAnswer?.status === "success" &&
      Array.isArray(resultAnswer.data)
    ) {
      setResultDetail([...resultAnswer.data]);
    }
  }, [resultAnswer]);

  useEffect(() => {
    if (extraObject) {
      dispatch(fetchResultAnswer(extraObject));
    }
  }, [dispatch, extraObject]);

  // Hitung total halaman
  const totalPages = Math.ceil(resultDetail.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = resultDetail.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  return (
    <>
      {currentData.length > 0 ? (
        currentData.map((item, index) => (
          <div key={item.id || index} className="mt-4">
            <label className="font-semibold text-black">{item.question}</label>
            {item.type === "Text" ? (
              <textarea
                defaultValue={item.options?.[0]?.option || ""}
                className="mt-2 text-black font-semibold w-full p-2 border border-gray-300 rounded-lg bg-white"
                disabled
              />
            ) : (
              <div className="input input-bordered w-full bg-white text-black py-2 min-h-[40px] h-auto mt-2">
                {Array.isArray(item.options)
                  ? item.options.map((opt) => opt.option).join(", ")
                  : typeof item.options === "object" && item.options !== null
                  ? Object.values(item.options)
                      .map((opt) => opt.option)
                      .join(", ")
                  : "No answer"}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500">No data available</div>
      )}

      {/* Pagination Controls */}
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
    </>
  );
}

export default ViewQuizResult;
