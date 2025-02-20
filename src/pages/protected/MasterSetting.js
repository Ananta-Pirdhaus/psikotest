import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterSettings from "../../features/master/MasterSettings";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Settings" }));
  }, []);

  return <MasterSettings />;
}

export default InternalPage;
