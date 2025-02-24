import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { fetchSettings } from "./settingSlice";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";

const MasterSettings = () => {
  const dispatch = useDispatch();
  const { settings, error, status, message } = useSelector(
    (state) => state.settings
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSettings(currentPage));
  }, [currentPage, dispatch]);

  const handleUpdateSettings = (settingsData) => {
    dispatch(
      openModal({
        title: "Update Master Settings",
        bodyType: MODAL_BODY_TYPES.SETTINGS_UPDATE,
        extraObject: settingsData, // Kirim seluruh data settings
      })
    );
  };

  const renderDescription = (description) => {
    if (!description) return "No description available";

    let formattedDescription = description
      .replaceAll(/<ul>/g, "<ol>")
      .replaceAll(/<\/ul>/g, "</ol>");

    formattedDescription = formattedDescription.replace(/<\/ol>\s*<ol>/g, "");

    return formattedDescription;
  };

  return (
    <TitleCard title="Master Settings" topMargin="mt-2">
      {status && message && (
        <div
          className={`text-${
            status === "failed" ? "red-500" : "green-500"
          } mb-4`}
        >
          {message}
        </div>
      )}
      <div className="overflow-x-auto w-full mt-4">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Keywords</th>
              <th className="px-4 py-2 text-left">Author</th>
              <th className="px-4 py-2 text-left">Favicon</th>
              <th className="px-4 py-2 text-left">Icon</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">SEO</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">{settings?.title}</td>
              <td className="px-4 py-2">
                <div className="list-decimal list-outside pl-5">
                  {renderDescription(settings?.description)}
                </div>
              </td>
              <td className="px-4 py-2">{settings?.keywords}</td>
              <td className="px-4 py-2">{settings?.author}</td>
              <td className="px-4 py-2">
                <img src={settings?.favicon} alt="Icon" className="h-6 w-6" />
              </td>
              <td className="px-4 py-2">
                <img src={settings?.icon} alt="Icon" className="h-6 w-6" />
              </td>
              <td className="px-4 py-2">
                <div>
                  <p>
                    <strong>Email:</strong> {settings?.contact?.email || "-"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {settings?.contact?.phone || "-"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {settings?.contact?.address || "-"}
                  </p>
                </div>
              </td>
              <td className="px-4 py-2">
                <div>
                  <p>
                    <strong>google_analytics:</strong>{" "}
                    {settings?.seo?.google_analytics || "-"}
                  </p>
                  <p>
                    <strong>bing_webmaster:</strong>{" "}
                    {settings?.seo?.bing_webmaster || "-"}
                  </p>
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleUpdateSettings(settings)}
                  disabled={!settings?.description}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default MasterSettings;
