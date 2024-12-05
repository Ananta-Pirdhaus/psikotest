import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterPendidikan from "../../features/master/MasterPendidikan";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Pendidikan" }));
  }, []);

  return <MasterPendidikan />;
}

export default InternalPage;
