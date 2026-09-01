import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaWarehouse,
  FaUsers,
  FaBullhorn,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

export const NAV_ITEMS = [
  {
    to: "/",
    label: "Dashboard",
    icon: FaTachometerAlt,
    module: "dashboard",
    end: true,
  },
  {
    to: "/products",
    label: "Products",
    icon: FaBoxOpen,
    module: "products",
  },
  {
    to: "/orders",
    label: "Orders",
    icon: FaClipboardList,
    module: "orders",
  },
  {
    to: "/inventory",
    label: "Inventory",
    icon: FaWarehouse,
    module: "inventory",
  },
  {
    to: "/customers",
    label: "Customers",
    icon: FaUsers,
    module: "customers",
  },
  {
    to: "/marketing",
    label: "Marketing",
    icon: FaBullhorn,
    module: "marketing",
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: FaChartLine,
    module: "analytics",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: FaCog,
    module: "settings",
  },
];
