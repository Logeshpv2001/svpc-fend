import React, { useEffect, useState } from "react";
import NavTabs from "../../../component/tabs/NavTabs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";
import {
  IoFemale,
  IoMale,
  IoMaleFemale,
  IoTodayOutline,
} from "react-icons/io5";
import { BiBookReader } from "react-icons/bi";
import { MdOutlineAddChart } from "react-icons/md";
import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import PatientInformation from "../../../component/general/PatientInformation";
import AxiosInstance from "../../../utilities/AxiosInstance";
import AssessmentSheetView from "../../../component/general/AssessmentSheetView";
import AssessmentFormView from "../../../component/general/AssessmentFormView";
import { IoMdArrowRoundBack } from "react-icons/io";
import PaymentDetailsView from "../../../component/general/PaymentDetailsView";
import TreatmentPlanView from "../../../component/general/TreatmentPlanView";

const PatientDetails = () => {
  const [patientInfo, setPatientInfo] = useState([]);
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const currentPage = "patient";
  const currentTab = "patient details";

  const getPatientDetails = async () => {
    try {
      const response = await AxiosInstance.get(
        `/patient/get-patient/${patient_id}`
      );
      setPatientInfo(response?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
  }, [patient_id]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div>
      <div className="flex justify-between items-center max-md:items-start max-md:mb-2 max-md:flex-col">
        <NavTabs currentPage={currentPage} currentTab={currentTab} />
        <div className="flex flex-row gap-4 max-md:flex-col max-md:items-start">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#075985] text-white font-medium flex flex-row items-center gap-2 px-4 py-2 rounded-md hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 ease-out hover:shadow-md"
          >
            <IoMdArrowRoundBack /> Back
          </button>

          {userInfo.u_eRole === "physio" ? (
            <button
              onClick={() => navigate(`/physio/assessment/${patient_id}`)}
              className="bg-[#075985] text-white font-medium flex flex-row items-center gap-2 px-4 py-2 rounded-md hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 ease-out hover:shadow-md"
            >
              <MdOutlineAddChart /> Add Assessment
            </button>
          ) : null}
        </div>
      </div>
      <div className="border-t-2 border-b-2 text-center max-md:flex max-md:flex-col max-xl:grid max-xl:grid-cols-2 border-gray-300 py-5 w-full flex flex-row justify-evenly">
        <div className="flex flex-col max-sm:m-2 justify-between items-center border-r max-xl:mb-5 max-md:border-b max-md:border-r-0 border-gray-300 w-full">
          <label className="text-gray-500 font-medium flex flex-col gap-2 items-center">
            <span className="bg-[--light-navbar-bg-color] shadow-md p-2 rounded-full text-[--navbar-bg-color]">
              <BiBookReader />
            </span>
            Patient ID
          </label>
          <p className="text-gray-900 text-lg font-semibold">
            {patientInfo?.p_vid}
          </p>
        </div>
        <div className="flex flex-col max-sm:m-2 justify-between items-center max-xl:border-r-0 max-xl:mb-5 border-r border-l max-md:border-b max-md:border-0 border-gray-300 w-full">
          <label className="text-gray-500 font-medium flex flex-col gap-2 items-center">
            <span className="bg-[--light-navbar-bg-color] shadow-md p-2 rounded-full text-[--navbar-bg-color]">
              <FaRegUser />
            </span>
            Patient Name
          </label>
          <p className="text-gray-900 text-lg font-semibold capitalize">
            {patientInfo?.p_vName}
          </p>
        </div>
        <div className="flex flex-col max-sm:m-2 justify-between items-center max-xl:border-l-0 max-xl:mt-5 border-r border-l border-gray-300 w-full max-md:border-b max-md:border-0">
          <label className="text-gray-500 font-medium flex flex-col gap-2 items-center">
            <span className="bg-[--light-navbar-bg-color] shadow-md p-2 rounded-full text-[--navbar-bg-color]">
              {patientInfo?.p_egender === "male" ? (
                <IoMale />
              ) : patientInfo?.p_egender === "female" ? (
                <IoFemale />
              ) : (
                <IoMaleFemale />
              )}
            </span>
            Gender
          </label>

          <p className="text-gray-900 text-lg font-semibold capitalize">
            {patientInfo?.p_egender}
          </p>
        </div>
        <div className="flex flex-col max-sm:m-2 justify-between items-center border-l max-xl:mt-5 border-gray-300 w-full max-md:border-0">
          <label className="text-gray-500 font-medium flex flex-col gap-2 items-center">
            <span className="bg-[--light-navbar-bg-color] shadow-md p-2 rounded-full text-[--navbar-bg-color]">
              <IoTodayOutline />
            </span>
            Assessment Date
          </label>
          <p className="text-gray-900 text-lg font-semibold">
            {formatDate(patientInfo?.p_date)}
          </p>
        </div>
      </div>
      <div className="mt-4 w-full">
        <Tabs
          defaultActiveKey="1"
          animated={{ inkBar: true, tabPane: true }}
          tabBarStyle={{ fontWeight: "bold" }}
          className=""
        >
          <TabPane tab="Patient Information" key="1">

            <PatientInformation patientInfo={patientInfo} />
            {userInfo.u_eRole !== "receptionist" && (
              <>
            <AssessmentFormView patientInfo={patientInfo} />
            <AssessmentSheetView patientInfo={patientInfo} />
            <TreatmentPlanView /> 
              </>
            ) }
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDetails;
