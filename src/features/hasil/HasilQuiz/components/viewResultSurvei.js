import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResultSurvei } from "../hasilQuizSlice";

function ViewResultSurvei({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [surveiDetail, setSurveiDetail] = useState([]);
  const { resultSurvei } = useSelector((state) => state.hasilQuiz);

  console.log("Current resultSurvei state:", resultSurvei);

  useEffect(() => {
    if (
      resultSurvei?.status === "success" &&
      Array.isArray(resultSurvei.data)
    ) {
      console.log("Data resultSurvei:", resultSurvei.data);
      setSurveiDetail(resultSurvei.data);
    }
  }, [resultSurvei]);

  useEffect(() => {
    if (extraObject) {
      dispatch(fetchResultSurvei(extraObject));
    }
  }, [dispatch, extraObject]);

  return (
    <>
      {surveiDetail.length > 0 ? (
        surveiDetail.map((item) => (
          <div key={item.id} className="mt-4">
            <label className="font-semibold text-black">{item.question}</label>
            {item.type === "Text" ? (
              <textarea
                defaultValue={item.answers}
                className="mt-2 text-black font-semibold w-full p-2 border border-gray-300 rounded-lg bg-white"
                disabled
              />
            ) : (
              <div className="input input-bordered w-full bg-white text-black py-2 min-h-[40px] h-auto mt-2">
                {item.answers}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500">No data available</div>
      )}
    </>
  );
}

export default ViewResultSurvei;
