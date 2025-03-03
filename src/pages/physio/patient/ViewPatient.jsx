import React, { useEffect, useState } from "react";
import NavTabs from "../../../component/tabs/NavTabs";
import DashboardCard from "../../../component/cards/DashboardCard";
import "./patient.css";

// Icons
import {
  FaUsers,
  FaHospitalUser,
  FaMale,
  FaFemale,
  FaCalendarDay,
  FaBookMedical,
} from "react-icons/fa";
import { IoToday } from "react-icons/io5";
import { GiBodyHeight } from "react-icons/gi";
import ViewPatientTable from "../../../component/tables/ViewPatientTable";
import AxiosInstance from "../../../utilities/AxiosInstance";

const ViewPatient = () => {
  const currentPage = "patient";
  const currentTab = "view patient";

  return (
    <div>
      {/* Headers */}
      <div className="flex justify-between items-center border-l-4 border-[--navbar-bg-color] w-full bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl m-0 text-[--navbar-bg-color] animationtext">
          View Patient
        </h1>
      </div>
      <hr className="my-2" />
      <NavTabs currentPage={currentPage} currentTab={currentTab} />

      <div>
        <ViewPatientTable />
      </div>
    </div>
  );
};

export default ViewPatient;
