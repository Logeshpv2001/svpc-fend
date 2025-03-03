import React from "react";
import NavTabs from "../../../component/tabs/NavTabs";
import BookedAppoinmentTable from "../../../component/tables/BookedAppoinmentTable";
import './patient.css'

const BookAppointment = () => {
  const currentPage = "patient";
  const currentTab = "appointments";
  return (
    <div>
      {/* Headers */}
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] m-0 animationtext">
          Appointments
        </h1>
      </div>
      <hr className="my-2 bg-[--navbar-bg-color]"/>
      <NavTabs currentPage={currentPage} currentTab={currentTab} />

      <div>
        <div >
          <BookedAppoinmentTable />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
