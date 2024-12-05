import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterProfesi from "../../features/master/MasterProfesi";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Profesi" }));
  }, []);

  return <MasterProfesi />;
}

export default InternalPage;
