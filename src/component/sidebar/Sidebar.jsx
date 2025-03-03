import React from "react";
import { useSelector } from "react-redux";
import { IoIosPeople } from "react-icons/io";
import {
  FaCalendarAlt,
  FaFileInvoice,
  FaRegAddressBook,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { DiGoogleAnalytics } from "react-icons/di";
import { MdDateRange, MdOutlineInventory2 } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { FaSitemap } from "react-icons/fa";
import { RiBillFill } from "react-icons/ri";
import logo from "../../assets/qsis logo  Gradiant.svg";
const SidebarItem = ({ text, route }) => {
  const isOpen = useSelector((state) => state.toggle.isOpen);
  const location = useLocation();
  const isSelected = location.pathname === route;

  return (
    <div
      className={`flex flex-row items-center cursor-pointer ${
        !isOpen
          ? "justify-center max-sm:px-5 bg-transparent px-0 "
          : "hover:bg-white group ml-2 max-sm:ml-1"
      } ${
        isSelected && isOpen ? "bg-[--navbar-bg-color]" : "bg-transparent"
      }  px-3 max-sm:px-4 gap-5 w-[95%] h-fit py-3 duration-200 rounded-full ${
        isSelected ? "text-[--navbar-bg-color]" : "text-white"
      }`}
    >
      {/* Receptionist */}
      <div>
        {text === "Patient Information" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <IoIosPeople
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Enquiry Registration" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaRegAddressBook
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Census" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaUsers
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Bill And Payment Details" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaUsers
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "View Bills" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaFileInvoice
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Review" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <MdDateRange
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "business analytics tools" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            {/* <TbDeviceDesktopAnalytics
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            /> */}
          </div>
        ) : null}

        {/* Physio */}
        {text === "Today Patients" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <IoIosPeople
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "View Patients" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaUser
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Appointments" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaCalendarAlt
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Employees" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaUsers
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Agency Inventory" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <MdOutlineInventory2
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Bills and Payments" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <RiBillFill
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : null}

        {/* Master */}
        {text === "Clinic List" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <FaSitemap
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              } p-3`}
            />
          </div>
        ) : text === "Business Analytics Tools" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <TbDeviceDesktopAnalytics
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : text === "Daily Report" ? (
          <div
            className={`flex flex-row items-center gap-3 rounded-full ${
              isOpen
                ? "group-hover:bg-[--navbar-bg-color]"
                : "hover:bg-[--navbar-bg-color]"
            } ${
              isSelected && !isOpen ? "bg-[--navbar-bg-color]" : "bg-white "
            } hover:rounded-full`}
          >
            <DiGoogleAnalytics
              className={`text-xl max-sm:text-base ${
                isSelected && !isOpen
                  ? "text-white"
                  : "text-[--navbar-bg-color]"
              } w-10 h-10 p-3 ${
                !isOpen
                  ? "max-sm:hidden w-10 h-10 text-center justify-center items-center hover:text-white duration-200"
                  : "group-hover:bg-[--navbar-bg-color] rounded-full group-hover:text-white duration-200"
              }`}
            />
          </div>
        ) : null}
      </div>

      <p
        className={`m-0 ${
          !isOpen && "hidden"
        } text-xl font-semibold max-sm:text-base ${
          isSelected && isOpen
            ? "text-white group-hover:text-[--navbar-bg-color]"
            : "text-[--navbar-bg-color] "
        } duration-200 `}
      >
        {text}
      </p>
    </div>
  );
};

const Sidebar = () => {
  const isOpen = useSelector((state) => state.toggle.isOpen);

  // get role of user
  const user = sessionStorage.getItem("user");
  const role = sessionStorage.getItem("master");

  // Parse data safely
  let masterRole = null;
  let userData = null;

  try {
    masterRole = role ? JSON.parse(role) : null;
  } catch (error) {
    console.error("Failed to parse 'master' role:", error);
  }

  try {
    userData = user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse 'user' data:", error);
  }

  // Safely access properties
  const masterR = masterRole?.role || null;
  const userRole = userData?.u_eRole || null;

  const hiddenRoutes = ["/", "/login", "/master-login"];

  const location = useLocation();
  const isHidden = hiddenRoutes.includes(location.pathname);
  if (isHidden) return null;

  const receptionistMenuItems = [
    {
      text: "Enquiry Registration",
      route: "/receptionist/enquiry-registration",
    },
    { text: "Census", route: "/census" },
    { text: "Patient Information", route: "/receptionist/patient-info" },
    { text: "Bill And Payment Details", route: "/receptionist/bill" },
    { text: "View Bills", route: "/receptionist/view-bills" },
    { text: "Appointments", route: "/receptionist/booked-appointment" },
    { text: "Review", route: "/receptionist/next-review" },
    { text: "Agency Inventory", route: "/expenditure" },

    // { text: "Business Analytics Tools", route: "/master/analyist" },
  ];

  const physioMenuItems = [
    // { text: "Today Patients", route: "/physio/today-patient" },
    { text: "View Patients", route: "/physio/view-patient" },
    { text: "Review", route: "/physio/next-review" },
    {
      text: "Bills and Payments",
      route: "/physio/employees/bills-and-payments",
    },
    { text: "Appointments", route: "/physio/booked-appointment" },
    { text: "Employees", route: "/physio/employees" },
    { text: "Daily Report", route: "/physio/daily-report" },
  ];

  const masterMenuItems = [
    { text: "Clinic List", route: "/master-admin" },
    // { text: "business analytics tools", route: "/master/analyist" },
  ];

  const menuItems =
    userRole === "receptionist"
      ? receptionistMenuItems
      : masterR === "admin"
      ? masterMenuItems
      : physioMenuItems;

  return (
    <div
      className={`flex flex-col gap-5 py-5 h-[90vh] z-50 bg-[#c1d5e0] shadow-md duration-300 border-r-2 border-[--navbar-bg-color] sidebar ${
        isOpen
          ? "w-[20vw] max-sm:w-[250px] max-md:w-[60vw] max-lg:w-[40vw] max-xl:w-[30vw]"
          : "w-[6vw] max-md:w-[20vw] max-lg:w-[10vw] max-xl:w-[8vw] max-sm:w-0"
      }`}
    >
      {menuItems.map((item, index) => (
        <Link key={index} to={item.route}>
          <SidebarItem text={item.text} route={item.route} />
        </Link>
      ))}
    </div>
  );
};
export default Sidebar;
