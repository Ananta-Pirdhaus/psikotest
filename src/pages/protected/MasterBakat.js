import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterBakat from "../../features/master/MasterBakat";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Bakat" }));
  }, []);

  return <MasterBakat />;
}

export default InternalPage;
