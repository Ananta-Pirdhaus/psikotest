import routes from "../routes/sidebar";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useEffect, useState } from "react";

function LeftSidebar() {
  const location = useLocation();
  const close = () => {
    document.getElementById("left-sidebar-drawer").click();
  };

  // State untuk menyimpan ikon dari API
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    // Ambil data dari API
    const API_URL = `${process.env.REACT_APP_BASE_URL}setting`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.data?.icon) {
          setIcon(data.data.icon);
        }
      })
      .catch((error) => console.error("Error fetching icon:", error));
  }, []);

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-80 min-h-full text-base-content bg-white">
        <button
          className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={close}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>
        <li className="mb-2 font-semibold text-xl">
          <Link to={"/app/dashboard"}>
            {icon ? (
              <img
                className="mask mask-squircle w-full h-12"
                src={icon}
                alt="Dashboard Logo"
              />
            ) : (
              <span>Loading...</span> // Placeholder jika ikon belum tersedia
            )}
          </Link>
        </li>

        {routes.map((route, k) => {
          return (
            <li key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${isActive ? "font-semibold bg-base-100" : "font-normal"}`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
