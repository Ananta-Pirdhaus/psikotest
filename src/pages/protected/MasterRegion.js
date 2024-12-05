import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterRegion from "../../features/master/MasteRegion";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Region" }));
  }, []);

  return <MasterRegion />;
}

export default InternalPage;
