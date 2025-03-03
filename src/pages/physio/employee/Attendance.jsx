import React from "react";
import AttendanceTable from "../../../component/tables/AttendanceTable";
import NavTabs from "../../../component/tabs/NavTabs";

const Attendance = () => {
  const currentPage = "employees";
  const currentTab = "attendance";

  return (
    <div>
      <NavTabs currentPage={currentPage} currentTab={currentTab} />
      <div>
        <AttendanceTable />
      </div>
    </div>
  );
};

export default Attendance;
