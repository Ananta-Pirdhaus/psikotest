import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { deletePeserta, getPesertaContent } from "./leadSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { showNotification } from "../common/headerSlice";

function Leads() {
  const { peserta } = useSelector((state) => state.peserta);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPesertaContent());
  }, []);

  const deleteCurrentLead = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this lead?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          id, // Kirim ID peserta
        },
      })
    );
  };

  return (
    <>
      <TitleCard title="Master Peserta" topMargin="mt-2">
        {/* Leads List in table format loaded from slice after api call */}
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nama</th>
                <th>Sekolah</th>
                <th>Class</th>
                <th>Universitas Impian</th>
                <th>Jurusan Impian</th>
                <th>Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {peserta.map((l) => (
                <tr key={l.id}>
                  <td>{l.email}</td>
                  <td>{l.name}</td>
                  <td>{l.school}</td>
                  <td>{l.class}</td>
                  <td>{l.dream_university}</td>
                  <td>{l.dream_major}</td>
                  <td>
                    {moment(new Date())
                      .add(-5 * (peserta.indexOf(l) + 2), "days")
                      .format("DD MMM YY")}
                  </td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentLead(l.id)} // Kirim ID di sini
                    >
                      <TrashIcon className="w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Leads;
