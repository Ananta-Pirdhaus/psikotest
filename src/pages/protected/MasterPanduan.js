import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterPanduan from "../../features/master/MasterPanduan";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Panduan" }));
  }, []);

  return <MasterPanduan />;
}

export default InternalPage;
