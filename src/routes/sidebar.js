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
import BuildingIcon from "@heroicons/react/24/outline/BuildingLibraryIcon"; // Tambahkan import
import MapIcon from "@heroicons/react/24/outline/MapIcon"; // Tambahkan import
import NumberedListIcon from "@heroicons/react/24/outline/NumberedListIcon"; // Tambahkan import
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/app/user",
    icon: <UsersIcon className={iconClasses} />,
    name: "User",
  },
  {
    path: "/app/master-soal", // Master Soal sebagai item utama
    icon: <BookOpenIcon className={iconClasses} />,
    name: "Master Soal",
  },
  {
    path: "", // No URL needed as this has submenu
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
    path: "", // Path utama kosong karena memiliki submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />,
    name: "Master",
    submenu: [
      {
        path: "/app/master-pendidikan",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Master Pendidikan",
      },
      {
        path: "/app/master-kelas",
        icon: <AcademicCapIcon className={submenuIconClasses} />,
        name: "Master Kelas",
      },
      {
        path: "/app/master-bakat",
        icon: <BoltIcon className={submenuIconClasses} />,
        name: "Master Bakat",
      },
      {
        path: "/app/master-kampus",
        icon: <BuildingIcon className={submenuIconClasses} />,
        name: "Master Kampus",
      },
      {
        path: "/app/master-jurusan",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Master Jurusan",
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
        path: "/app/master-versi",
        icon: <NumberedListIcon className={submenuIconClasses} />,
        name: "Master Versi",
      },
      {
        path: "/app/master-panduan",
        icon: <NumberedListIcon className={submenuIconClasses} />,
        name: "Master Panduan",
      },
      {
        path: "/app/master-admin",
        icon: <KeyIcon className={submenuIconClasses} />,
        name: "Master Admin",
      },
    ],
  },

  {
    path: "", // No URL needed as this has submenu
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />,
    name: "Pages",
    submenu: [
      {
        path: "/login",
        icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
        name: "Login",
      },
      {
        path: "/register",
        icon: <UserIcon className={submenuIconClasses} />,
        name: "Register",
      },
      {
        path: "/forgot-password",
        icon: <KeyIcon className={submenuIconClasses} />,
        name: "Forgot Password",
      },
      {
        path: "/app/blank",
        icon: <DocumentIcon className={submenuIconClasses} />,
        name: "Blank Page",
      },
      {
        path: "/app/404",
        icon: <ExclamationTriangleIcon className={submenuIconClasses} />,
        name: "404",
      },
    ],
  },
  {
    path: "", // No URL needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />,
    name: "Settings",
    submenu: [
      {
        path: "/app/settings-profile",
        icon: <UserIcon className={submenuIconClasses} />,
        name: "Profile",
      },
      {
        path: "/app/settings-billing",
        icon: <WalletIcon className={submenuIconClasses} />,
        name: "Billing",
      },
      {
        path: "/app/settings-team",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Team Members",
      },
    ],
  },
  {
    path: "", // No URL needed as this has submenu
    icon: <DocumentTextIcon className={`${iconClasses} inline`} />,
    name: "Documentation",
    submenu: [
      {
        path: "/app/getting-started",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Getting Started",
      },
      {
        path: "/app/features",
        icon: <TableCellsIcon className={submenuIconClasses} />,
        name: "Features",
      },
      {
        path: "/app/components",
        icon: <CodeBracketSquareIcon className={submenuIconClasses} />,
        name: "Components",
      },
    ],
  },
];

export default routes;
