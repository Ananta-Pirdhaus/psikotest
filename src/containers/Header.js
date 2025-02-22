import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { NavLink, Routes, Link, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi
  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  //   useEffect(() => {
  //     themeChange(false);
  //     if (currentTheme === null) {
  //       if (
  //         window.matchMedia &&
  //         window.matchMedia("(prefers-color-scheme: dark)").matches
  //       ) {
  //         setCurrentTheme("dark");
  //       } else {
  //         setCurrentTheme("light");
  //       }
  //     }
  //     // 👆 false parameter is required for react project
  //   }, []);

  // Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  function logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

  function goToProfile() {
    navigate("/app/settings-profile"); // Arahkan ke halaman profile
  }

  return (
    // navbar fixed  flex-none justify-between bg-base-300  z-10 shadow-md

    <>
      <div className="navbar sticky top-0   z-10 shadow-md bg-white">
        {/* Menu toogle for mobile view or small screen */}
        <div className="flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
          <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
        </div>

        <div className="flex-none ">
          {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}

          {/* <select className="select select-sm mr-4" data-choose-theme>
                    <option disabled selected>Theme</option>
                    <option value="light">Default</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="retro">Retro</option>
                </select> */}

          {/* Notification icon */}
          {/* <button
            className="btn btn-ghost ml-4  btn-circle"
            onClick={() => openNotification()}
          >
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
              {noOfNotifications > 0 ? (
                <span className="indicator-item badge badge-secondary badge-sm">
                  {noOfNotifications}
                </span>
              ) : null}
            </div>
          </button> */}

          {/* Profile icon, opening menu on click */}
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 h-10 rounded-full">
                <UserCircleIcon className="w-full h-full text-primary" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={goToProfile}>
                  <UserIcon className="w-5 h-5" /> Profile
                </a>
              </li>
              <li>
                <a onClick={logoutUser}>
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
