import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleSidebar } from "../../redux/slices/toggleSlice";
import { message } from "antd";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.jpg";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    navigate("/login");
    sessionStorage.clear();
    message.success("logout successfully!");
  };

  // handle session storage
  const currUser = location.pathname === "/master-admin";

  const userInfo = JSON?.parse(
    sessionStorage.getItem(currUser ? "master" : "user")
  );

  return (
    <div
      className={`flex h-[10vh] w-screen justify-between bg-[--navbar-bg-color] shadow-md px-7 max-sm:px-4 ${
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/master-login"
          ? "hidden"
          : "flex"
      }`}
    >
      <div className="flex items-center gap-8">
        <MenuOutlined
          onClick={handleToggle}
          className="text-2xl max-sm:text-base text-white cursor-pointer"
        />
        <img src={logo} alt="logo" className="h-[8vh] shadow-md rounded-md" />
      </div>
      <div className="flex items-center space-x-4 flex-row">
        <div className="capitalize text-white font-semibold text-lg max-sm:text-sm flex items-center">
          <h1>
            {(userInfo?.u_eRole === "physio" && "Senior Physio") ||
              (userInfo?.u_eRole === "receptionist" && "Receptionist") ||
              "master"}
          </h1>
        </div>
        <LogoutOutlined
          title="logout"
          onClick={handleLogout}
          className="text-2xl max-sm:text-base text-white cursor-pointer"
        />
      </div>
    </div>
  );
}

export default Navbar;
