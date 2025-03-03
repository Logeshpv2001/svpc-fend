import React, { useEffect, useState } from "react";
import NavTabs from "../../../component/tabs/NavTabs";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../../utilities/AxiosInstance";
import {
  FaBirthdayCake,
  FaRegUser,
  FaSortNumericDownAlt,
} from "react-icons/fa";
import { IoFemale, IoMale, IoMaleFemale } from "react-icons/io5";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { MdOutlineLocationOn } from "react-icons/md";
import { message } from "antd";

const PatientGreet = () => {
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;
  const [patientDetails, setPatientDetails] = useState([]);
  const [assessmentDate, setAssessmentDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  function formattedDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const getPatientDetails = async () => {
    try {
      const response = await AxiosInstance.get(`/patient/get-patient/${id}`);
      setPatientDetails(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiagnosis = async () => {
    try {
      const response = await AxiosInstance.get(
        `/assessmentform/get-diagnosis/${id}`
      );
      setDiagnosis(response.data.response?.a_tdiagnosis || "");
    } catch (error) {
      console.log(error);
    }
  };

  const getAssessmentDate = async () => {
    try {
      const response = await AxiosInstance.post(
        "/assessmentform/get-assessmentdate",
        {
          a_vpatient_id: id,
          a_vclinic_id: clinic_id,
        }
      );

      setAssessmentDate(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
    getDiagnosis();
    getAssessmentDate();
  }, []);

  // Greeting function
  async function handleGreetings(row) {
    try {
      const endpoint =
        row.prefix === "Dr."
          ? "/whatsapp/send-reminder-doctor"
          : "/whatsapp/send-reminder-patient";

      const payload =
        row.prefix === "Dr."
          ? {
              doctorName: row.name,
              referredPatient: patientDetails.p_vName,
              phoneNumber: row.phoneNumber,
            }
          : {
              patientName: row.name,
              phoneNumber: row.phoneNumber,
            };
      const response = await AxiosInstance.post(endpoint, payload);
      message.success(response.data.message);
    } catch (error) {
      // Handle errors
      message.error("Something went wrong. Please try again later.");
      console.error("Patient Reminder Error:", error);
    }
  }

  // Patient registration greetings
  const handleSendGreetPatient = async (e) => {
    e.preventDefault();

    try {
      const response = await AxiosInstance.post(
        "/whatsapp/send-patient-registration",
        {
          patientId: patientDetails.p_vid,
          patientName: patientDetails.p_vName,
          phoneNumber: patientDetails.p_vPhone,
        }
      );
      message.success(response.data.message);
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
    }
  };

  // Treatment completion greetings
  const handleCompletionGreet = async (row) => {
    try {
      const endpoint =
        row.prefix === "Dr."
          ? "/whatsapp/send-doctor-completion-greet"
          : "/whatsapp/send-patient-completion-greet";

      const payload =
        row.prefix === "Dr."
          ? {
              docname: "Dr." + " " + row.name,
              phoneNumber: row.phoneNumber,
              name: patientDetails.p_vName,
              date: assessmentDate.a_assessmentdate,
              issue: diagnosis,
            }
          : {
              refname: patientDetails.p_vName,
              phoneNumber: row.phoneNumber,
              name: row.name,
              date: assessmentDate.a_assessmentdate,
              issue: diagnosis,
            };
      const response = await AxiosInstance.post(endpoint, payload);
      message.success(response.data.message);
    } catch (error) {
      // Handle errors
      message.error("Something went wrong. Please try again later.");
      console.error("Patient Reminder Error:", error);
    }
  };

  return (
    <div>
      <NavTabs currentPage="patient" currentTab="greetings" />
      {/* header */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 capitalize">
            <FaRegUser className="text-xl text-blue-600" />
            <span>
              <strong className="text-gray-700">Name:</strong>{" "}
              {patientDetails.p_vName || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 capitalize">
            {patientDetails.p_egender === "male" ? (
              <IoMale className="text-xl text-blue-600" />
            ) : patientDetails.p_egender === "female" ? (
              <IoFemale className="text-xl text-pink-600" />
            ) : (
              <IoMaleFemale className="text-xl text-purple-600" />
            )}
            <span>
              <strong className="text-gray-700">Gender:</strong>{" "}
              {patientDetails.p_egender || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <PhoneOutlined className="text-xl text-green-600" />
            <span>
              <strong className="text-gray-700">Phone:</strong>{" "}
              {patientDetails.p_vPhone || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaSortNumericDownAlt className="text-xl text-red-600" />
            <span>
              <strong className="text-gray-700">Date of Birth:</strong>{" "}
              {formattedDate(patientDetails.p_vdob) || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaBirthdayCake className="text-xl text-orange-600" />
            <span>
              <strong className="text-gray-700">Age:</strong>{" "}
              {patientDetails.p_iAge || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 capitalize">
            <MdOutlineLocationOn className="text-xl text-red-600" />
            <span>
              <strong className="text-gray-700">Address:</strong>{" "}
              {patientDetails.p_tAddress || "N/A"}
            </span>
          </div>
        </div>

        {/* Greetings */}
        <div className="my-8">
          <button
            onClick={handleSendGreetPatient}
            className="flex flex-row items-center justify-center bg-green-100 rounded-md shadow-sm hover:bg-green-200 border border-green-500"
          >
            <h1 className="font-semibold text-green-800 m-0 p-2 gap-3 flex flex-row">
              Patient Registration Greet
              <WhatsAppOutlined className="font-semibold text-green-800" />
            </h1>
          </button>
        </div>
      </div>

      {/* Greetings */}
      <div className="my-8">
        <div className="text-2xl font-semibold text-gray-700">
          <h1>Referred By: </h1>
        </div>
        {patientDetails?.p_referredby?.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200 rounded-lg shadow-sm bg-white">
            <thead>
              <tr className="bg-[--navbar-bg-color]">
                <th className="py-3 px-4 font-medium text-white text-left">
                  S. No
                </th>
                <th className="py-3 px-4 font-medium text-white text-left">
                  Name
                </th>
                <th className="py-3 px-4 font-medium text-white text-left">
                  Phone
                </th>
                <th className="py-3 px-4 font-medium text-white text-left">
                  Greetings
                </th>
                <th className="py-3 px-4 font-medium text-white text-left">
                  Treatment Completion Greet
                </th>
              </tr>
            </thead>
            <tbody>
              {patientDetails.p_referredby.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-600 capitalize">
                    {item.prefix} {item.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.phoneNumber}
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    <button
                      onClick={() => handleGreetings(item)}
                      className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg shadow-sm hover:bg-green-200"
                    >
                      <WhatsAppOutlined className="text-2xl text-green-600" />
                      <h1 className="font-semibold">Send</h1>
                    </button>
                  </td>

                  {diagnosis && (
                    <td className="py-3 px-4 text-gray-600">
                      <button
                        onClick={() => handleCompletionGreet(item)}
                        className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg shadow-sm hover:bg-green-200"
                      >
                        <WhatsAppOutlined className="text-2xl text-green-600" />
                        <h1 className="font-semibold">Send</h1>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm">
            <p className="text-gray-500 text-lg font-medium">
              No referral information available
            </p>
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default PatientGreet;
