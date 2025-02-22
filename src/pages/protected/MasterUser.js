import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterUser from "../../features/master/MasterUsers";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master User" }));
  }, []);

  return <MasterUser />;
}

export default InternalPage;
