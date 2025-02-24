import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "./userSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewUserModal = () => {
    dispatch(
      openModal({
        title: "Tambahkan User Baru",
        bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right space-x-2 text-white">
      <button
        className="btn btn-sm normal-case btn-primary flex items-center gap-2"
        onClick={openAddNewUserModal}
      >
        <PlusCircleIcon className="w-5 h-5 text-white" />
        <p className="text-white">Tambah User</p>
      </button>
    </div>
  );
};

const MasterUser = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const deleteCurrentUser = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Apakah anda ingin menghapus user ini?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.USER_DELETE,
          id,
        },
      })
    );
  };

  const updateUser = (id, userDetails) => {
    dispatch(
      openModal({
        title: "Ubah User",
        bodyType: MODAL_BODY_TYPES.USER_UPDATE,
        extraObject: { id, userDetails },
      })
    );
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => u.name) // Hindari error jika `name` undefined
      .filter((u) =>
        String(u.name).toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [users, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <>
      <TitleCard
        title="Master User"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <div className="overflow-x-auto w-full mt-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Nama User</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => updateUser(user.id, user)}
                      title="Update User"
                    >
                      <PencilIcon className="w-5 text-blue-500" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => deleteCurrentUser(user.id)}
                      title="Hapus User"
                    >
                      <TrashIcon className="w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* DaisyUI Pagination */}
        <div className="flex justify-center mt-4">
          <div className="btn-group space-x-2">
            <button
              className="btn btn-sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="btn btn-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        </div>
      </TitleCard>
    </>
  );
};

export default MasterUser;
