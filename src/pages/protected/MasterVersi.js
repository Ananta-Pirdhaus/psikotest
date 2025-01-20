import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterVersi from "../../features/master/MasterVersi";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Versi" }));
  }, []);

  return <MasterVersi />;
}

export default InternalPage;
