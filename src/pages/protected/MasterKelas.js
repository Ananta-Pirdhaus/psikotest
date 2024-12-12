import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterKelas from "../../features/master/MasterKelas";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Kelas" }));
  }, []);

  return <MasterKelas />;
}

export default InternalPage;
