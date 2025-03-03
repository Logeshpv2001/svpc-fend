import React, { useEffect, useState } from "react";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import { TbUserEdit } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";
import { useSelector } from "react-redux";
import AxiosInstance from "../../utilities/AxiosInstance";
import { Link } from "react-router-dom";

const TodayPatientCard = () => {
  const isOpen = useSelector((state) => state.toggle.isOpen);
  const [todayPatient, setTodayPatient] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const getTodayPatient = async () => {
      try {
        const response = await AxiosInstance.get(
          `/patient/get-today-patients/${user.u_vClinicId}`
        );
        setTodayPatient(response.data.response || []);
      } catch (error) {
        console.log(error);
      }
    };
    getTodayPatient();
  }, []);

  return (
    <div
      className={`flex flex-wrap gap-5 items-center ${
        isOpen ? "justify-evenly" : "justify-center"
      }`}
    >
      {todayPatient.length > 0 ? (
        todayPatient.map((item, index) => (
          <div
            key={index}
            className="flex flex-col min-w-80 overflow-hidden relative gap-5 p-5 bg-gradient-to-tr to-white from-[#c1d5e0] rounded-lg border border-[#c1d5e0] border-l-0 border-b-0"
          >
            <div
              className={`absolute w-40 h-40 rounded-full translate-x-16 -translate-y-16 bg-gradient-to-tr ${
                item.p_egender === "male" ? "from-blue-200" : "from-pink-200"
              } to-white z-10 top-0 right-0`}
            ></div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <p className="capitalize text-gray-700 relative overflow-hidden animation">
                  {item.p_epatient_type}
                </p>
                <h1 className="text-xl font-semibold capitalize">
                  {item.p_vName}
                </h1>
                <p className="text-gray-700 font-medium">
                  {item.p_egender}
                  {" - "}
                  {item.p_iAge}
                </p>
              </div>
              <div>
                <p>
                  {item.p_egender === "male" ? (
                    <FaMale className="text-blue-500 text-3xl top-6 right-5 z-50 absolute" />
                  ) : (
                    <FaFemale className="text-pink-500 text-3xl top-6 right-5 z-50 absolute" />
                  )}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col font-medium">
                <p className="text-gray-700 flex flex-row justify-between">
                  <span className="text-black">Contact: {item.p_vPhone}</span>
                  <span
                    className={`${
                      item.p_estatus === "completed"
                        ? "bg-green-600"
                        : item.status === "partial"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    } px-2 h-fit rounded-md text-white text-sm`}
                  >
                    {item.p_estatus}
                  </span>
                </p>
                <p className="text-gray-700">
                  ID: <span className="text-black">{item.p_vid}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-5">
              <Link
                to={`/physio/assessment/${item.p_vid}`}
                className="flex flex-row items-center justify-center gap-2 border-2 min-w-28 py-1 rounded-md bg-white border-green-500 hover:bg-green-50 transition-colors"
              >
                <span>Add/Edit</span>
                <TbUserEdit className="text-green-500" />
              </Link>
              <Link
                to={`/patient-details/${item.p_vid}`}
                className="flex flex-row items-center justify-center gap-2 border-2 min-w-28 py-1 rounded-md bg-white border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span>View</span>
                <CiViewList className="text-blue-500" />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="flex mt-16 text-red-500 font-semibold text-xl">
          <p>No patients for today</p>
        </div>
      )}
    </div>
  );
};

export default TodayPatientCard;
