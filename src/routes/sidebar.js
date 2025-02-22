import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon"; // Perbaikan dari BuildingIcon
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import ArchiveBoxIcon from "@heroicons/react/24/outline/ArchiveBoxIcon"; // Ikon untuk "Master"
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon"; // Ikon untuk "Settings"
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon"; // Ikon untuk "Setting Quiz"

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/app/peserta",
    icon: <UsersIcon className={iconClasses} />,
    name: "Peserta",
  },
  {
    path: "",
    icon: <ArchiveBoxIcon className={`${iconClasses} inline`} />,
    name: "Master",
    submenu: [
      {
        path: "/app/master-bakat",
        icon: <BoltIcon className={submenuIconClasses} />,
        name: "Master Bakat",
      },
      {
        path: "/app/master-jurusan",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Master Jurusan",
      },
      {
        path: "/app/master-kelas",
        icon: <AcademicCapIcon className={submenuIconClasses} />,
        name: "Master Kelas",
      },
      {
        path: "/app/master-kampus",
        icon: <BuildingLibraryIcon className={submenuIconClasses} />,
        name: "Master Perguruan Tinggi",
      },
      {
        path: "/app/master-pendidikan",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Master Pendidikan",
      },
      {
        path: "/app/master-profesi",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Master Profesi",
      },
      {
        path: "/app/master-region",
        icon: <MapIcon className={submenuIconClasses} />,
        name: "Master Region",
      },
      {
        path: "/app/master-settings",
        icon: <Cog6ToothIcon className={submenuIconClasses} />,
        name: "Master Settings",
      },
      {
        path: "/app/master-user",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Master User",
      },
    ],
  },
  {
    path: "",
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />,
    name: "Hasil",
    submenu: [
      {
        path: "/app/hasil-quiz",
        icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
        name: "Result Quiz",
      },
    ],
  },
  {
    path: "",
    icon: <AdjustmentsHorizontalIcon className={`${iconClasses} inline`} />,
    name: "Setting Quiz",
    submenu: [
      {
        path: "/app/master-versi",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Master Versi",
      },
      {
        path: "/app/master-panduan",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Master Panduan",
      },
      {
        path: "/app/master-soal",
        icon: <BookOpenIcon className={iconClasses} />,
        name: "Master Soal",
      },
    ],
  },

  // {
  //   path: "",
  //   icon: <WrenchScrewdriverIcon className={`${iconClasses} inline`} />,
  //   name: "Settings",
  //   submenu: [
  //     {
  //       path: "/app/settings-profile",
  //       icon: <UserIcon className={submenuIconClasses} />,
  //       name: "Profile",
  //     },
  //   ],
  // },
  // {
  //   path: "",
  //   icon: <DocumentTextIcon className={`${iconClasses} inline`} />,
  //   name: "Documentation",
  //   submenu: [
  //     {
  //       path: "/app/getting-started",
  //       icon: <DocumentTextIcon className={submenuIconClasses} />,
  //       name: "Getting Started",
  //     },
  //     {
  //       path: "/app/features",
  //       icon: <TableCellsIcon className={submenuIconClasses} />,
  //       name: "Features",
  //     },
  //     {
  //       path: "/app/components",
  //       icon: <CodeBracketSquareIcon className={submenuIconClasses} />,
  //       name: "Components",
  //     },
  //   ],
  // },
  // {
  //   path: "",
  //   icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />,
  //   name: "Pages",
  //   submenu: [
  //     {
  //       path: "/login",
  //       icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
  //       name: "Login",
  //     },
  //     {
  //       path: "/register",
  //       icon: <UserIcon className={submenuIconClasses} />,
  //       name: "Register",
  //     },
  //     {
  //       path: "/forgot-password",
  //       icon: <KeyIcon className={submenuIconClasses} />,
  //       name: "Forgot Password",
  //     },
  //     {
  //       path: "/app/blank",
  //       icon: <DocumentIcon className={submenuIconClasses} />,
  //       name: "Blank Page",
  //     },
  //     {
  //       path: "/app/404",
  //       icon: <ExclamationTriangleIcon className={submenuIconClasses} />,
  //       name: "404",
  //     },
  //   ],
  // },
];

export default routes;
