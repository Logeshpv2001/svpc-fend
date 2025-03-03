import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineAppstore, AiOutlineUser } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { MdHealthAndSafety } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import analysis from "../../assets/physio-analysis.png";
import { CgGym } from "react-icons/cg";
const Analyist = () => {
  const navigate = useNavigate(); // For navigation

  const dashboardItems = [
    {
      name: " PatientCount",
      icon: <AiOutlineAppstore className="text-4xl text-green-500 mb-2" />,
      onClick: () => navigate("/Count"), // Add navigation
    },
    // {
    //   name: "Pain Diagnosis",
    //   icon: <MdHealthAndSafety className="text-4xl text-red-500 mb-2" />,
    //   onClick: () => navigate("/Diagnosis"), // Add navigation
    // },
    // {
    //   name: "Booked Appointments",
    //   icon: <GiNotebook className="text-4xl text-gray-500 mb-2" />,
    //   onClick: () => navigate("/BookedAppointments"), // Add navigation
    // },
    // {
    //   name: "Revenue",
    //   icon: <BsGraphUp className="text-4xl text-orange-500 mb-2" />,
    //   onClick: () => navigate("/Revenue"), // Add navigation
    // },

    // {
    //   name: "Referral Doctors",
    //   icon: <AiOutlineUser className="text-4xl text-teal-500 mb-2" />,
    //   onClick: () => navigate("/ReferallPatients"), // Add navigation
    // },
    // {
    //   name: "PhysioEquipment",
    //   icon: <CgGym className="text-4xl text-yellow-500 mb-2" />,
    //   onClick: () => navigate("/PhysioTherapy"), // Add navigation
    // },
  ];

  return (
    <div className="min-h-full bg-gray-100 flex flex-col">
      {/* Header Section */}

      {/* Main Section */}
      <div className="flex-grow flex flex-col">
        {/* Grid Section */}
        <div className="flex-grow container mx-auto">
        <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext">
          Business Analysis Dashboard
        </h1>
      </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
            {/* Dynamic Grid Items */}
            {dashboardItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick} // Add onClick handler
                className="w-full h-[120px] bg-white rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {item.icon}
                <p className="text-gray-700 font-medium text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyist;
