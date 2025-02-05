import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import HasilQuiz from "../../features/hasil/HasilQuiz";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Hasil Quiz" }));
  }, []);

  return <HasilQuiz />;
}

export default InternalPage;
