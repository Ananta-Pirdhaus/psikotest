import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MasterJurusan from "../../features/master/MasterJurusan";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Master Jurusan" }));
  }, []);

  return <MasterJurusan />;
}

export default InternalPage;
