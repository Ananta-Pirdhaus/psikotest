import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterKampus from "../../features/master/MasterKampus";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Kampus" }));
  }, []);

  return <MasterKampus />;
}

export default InternalPage;
