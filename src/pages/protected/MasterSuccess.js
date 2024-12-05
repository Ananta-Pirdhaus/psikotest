import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterSuccess from "../../features/master/MasterSuccess";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Orang Sukses" }));
  }, []);

  return <MasterSuccess />;
}

export default InternalPage;
