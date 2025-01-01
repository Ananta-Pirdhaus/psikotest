import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterSoal from "../../features/master/MasterSoal";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Soal" }));
  }, []);

  return <MasterSoal />;
}

export default InternalPage;
