import React, { useEffect, useState } from "react";
import NavTabs from "../tabs/NavTabs";
import "../../pages/physio/patient/patient.css";
import AxiosInstance from "../../utilities/AxiosInstance";
import { message } from "antd";
import { FaWhatsapp } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoMdAddCircle,
  IoMdArrowRoundBack,
  IoMdClose,
  IoMdCreate,
} from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { TimePicker } from "antd";
import dayjs from "dayjs";

import moment from "moment";

const EnquiryRegistrationForm = () => {
  const navigate = useNavigate();
  const currentPage = "add patient";
  const currentTab = "enquiry registration";

  // Get clinic id from SessionStorage
  const user = sessionStorage.getItem("user");
  const clinic_id = JSON.parse(user).u_vClinicId;
  const user_name = JSON.parse(user).u_vName;
  const { patient_id } = useParams();
  const [call1, setCall1] = useState("");
  const [call2, setCall2] = useState("");
  const [call3, setCall3] = useState("");
  const [pCall1, setPcall1] = useState([
    {
      date: "",
      time: "",
      notes: "",
    },
  ]);
  const [pCall2, setPcall2] = useState([
    {
      date: "",
      time: "",
      notes: "",
    },
  ]);
  const [pCall3, setPcall3] = useState([
    {
      date: "",
      time: "",
      notes: "",
    },
  ]);

  const todayDate = new Date().toISOString().split("T")[0];

  const [whatsappMsgData, setWhatsappMsgData] = useState({
    prefix: "Mr",
    name: "",
    phoneNumber: "",
  });
  const [entries, setEntries] = useState([]);

  // Handle form input changes
  const handleWhatsappMessage = (e) => {
    const target = e.target || {};
    const { name, value } = target;

    setWhatsappMsgData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [date] = isoDate.split("T");
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    p_vclinicid: "",
    p_vName: "",
    p_iAge: 0,
    p_egender: "",
    p_emStatus: "",
    p_vPhone: "",
    p_vEmail: "",
    // p_epatient_type: "",
    p_jcall1: "",
    p_jcall2: "",
    p_jcall3: "",
    p_tclinicalnotes: "",
    p_vdob: "",
    p_voccupation: "",
    p_tAddress: "",
    p_vctime: "",
    p_vassessmentby: "",
    p_fbmi: 0,
    p_fweight: 0,
    p_fheight: 0,
    p_vht: "",
    p_vdm: "",
    p_referredby: [],
    p_jservice: [],
    p_date: new Date().toISOString().split("T")[0],
    p_vappointmentfor: "",
    p_vcenquiry: "",
    p_vptincharge: "",
    p_txmsg: "",
    p_vrpttxmsg: "",
    p_vdttxmsg: "",
  });
  console.log(formData, "formData");

  const handleTimeChange = (time, timeString) => {
    setFormData({
      ...formData,
      p_vctime: timeString,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      const updatedServiceFor = Array.isArray(prevData.p_jservice)
        ? type === "checkbox"
          ? checked
            ? [...prevData.p_jservice, value]
            : prevData.p_jservice.filter((service) => service !== value)
          : prevData.p_jservice
        : [];
      return {
        ...prevData,
        [name]: type === "checkbox" ? updatedServiceFor : value,
      };
    });
  };

  const updatedFormData = {
    ...formData,
    p_date: formData.p_date || new Date().toISOString().split("T")[0],
    p_referredby: entries,
    p_vclinicid: clinic_id,
    p_vcenquiry: user_name,
    p_jcall1: pCall1,
    p_jcall2: pCall2,
    p_jcall3: pCall3,
  };

  const handleFormPhoneChange = (phone, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: `+${phone}`,
    }));
  };

  const handleWhatsAppPhoneChange = (phone, name) => {
    setWhatsappMsgData((prevData) => ({
      ...prevData,
      [name]: `+${phone}`,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(updatedFormData, "updatedFormData");
    console.log(formData, "formData");
    e.preventDefault();

    if (
      !formData.p_vName ||
      !formData.p_iAge ||
      !formData.p_egender ||
      !formData.p_vPhone
      // !updatedFormData.p_date
    ) {
      message.error("Please fill * fields.");
      return;
    }

    try {
      const response = await AxiosInstance.post(
        "/patient/add-patient",
        updatedFormData
      );
      // Show success message
      if (response.data.status === 201) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      // Show error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
    // navigate(-1);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const combinedReferredBy = Array.isArray(formData.p_referredby)
      ? [...formData.p_referredby, ...entries]
      : [formData.p_referredby, ...entries];

    try {
      const response = await AxiosInstance.patch(
        `/patient/edit-patient/${patient_id}`,
        {
          p_vclinicid: clinic_id,
          p_vid: patient_id,
          p_vName: formData.p_vName,
          p_iAge: formData.p_iAge,
          p_egender: formData.p_egender,
          p_emStatus: formData.p_emStatus,
          p_vPhone: formData.p_vPhone,
          p_vEmail: formData.p_vEmail,
          p_vdob: formData.p_vdob,
          // p_epatient_type: formData.p_epatient_type,
          p_jcall1: pCall1,
          p_jcall2: pCall2,
          p_jcall3: pCall3,
          p_tclinicalnotes: formData.p_tclinicalnotes,
          p_voccupation: formData.p_voccupation,
          p_tAddress: formData.p_tAddress,
          p_vctime: formData.p_vctime,
          p_vassessmentby: formData.p_vassessmentby,
          p_fbmi: formData.p_fbmi || 0,
          p_fweight: formData.p_fweight || 0,
          p_fheight: formData.p_fheight || 0,
          p_vht: formData.p_vht,
          p_vdm: formData.p_vdm,
          p_referredby: combinedReferredBy,
          p_jservice: formData.p_jservice,
          p_date: formatDate(formData.p_date) || new Date().toISOString().slice(0, 10),
          p_vpattype: formData.p_vpattype,
          p_vappointmentfor: formData.p_vappointmentfor,
          p_vcenquiry: formData.p_vcenquiry,
          p_vptincharge: formData.p_vptincharge,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      // Show error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
    // navigate(-1);
  };

  const getPatient = async () => {
    try {
      const response = await AxiosInstance.get(
        `/patient/get-patient/${patient_id}`
      );
      console.log(response,"response");
      
      const data = response.data.response || "";
      setFormData({
        ...data,
        p_date: formatDate(data.p_date) || new Date().toISOString().slice(0, 10),
      });

      // For Call 1
      if (data?.p_jcall1 && data?.p_jcall1.length > 0) {
        setPcall1([
          {
            date: data.p_jcall1[0]?.date || "",
            time: data.p_jcall1[0]?.time || "",
            notes: data.p_jcall1[0]?.notes || "",
          },
        ]);
      }

      // For Call 2
      if (data?.p_jcall2 && data?.p_jcall2.length > 0) {
        setPcall2([
          {
            date: data.p_jcall2[0]?.date || "",
            time: data.p_jcall2[0]?.time || "",
            notes: data.p_jcall2[0]?.notes || "",
          },
        ]);
      }

      // For Call 3
      if (data?.p_jcall3 && data?.p_jcall3.length > 0) {
        setPcall3([
          {
            date: data.p_jcall3[0]?.date || "",
            time: data.p_jcall3[0]?.time || "",
            notes: data.p_jcall3[0]?.notes || "",
          },
        ]);
      }
    } catch (error) {
      message.error("Failed to fetch patient data. Please try again.");
    }
  };

  useEffect(() => {
    getPatient();
  }, []);
  const handleCall1Change = (field, value) => {
    setPcall1([
      {
        ...pCall1[0], // Preserve other fields
        [field]: value,
      },
    ]);
  };

  const handleCall2Change = (field, value) => {
    setPcall2([
      {
        ...pCall2[0], // Preserve other fields
        [field]: value,
      },
    ]);
  };

  const handleCall3Change = (field, value) => {
    setPcall3([
      {
        ...pCall3[0], // Preserve other fields
        [field]: value,
      },
    ]);
  };

  useEffect(() => {
    const { p_fheight, p_fweight } = formData;

    if (p_fheight && p_fweight) {
      const heightInMeters = p_fheight / 100;
      const bmi = (p_fweight / (heightInMeters * heightInMeters)).toFixed(2);
      setFormData((prevState) => ({
        ...prevState,
        p_fbmi: bmi,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        p_fbmi: "0", // Default BMI value when height or weight is not entered
      }));
    }
  }, [formData.p_fheight, formData.p_fweight]);

  const [editIndex, setEditIndex] = useState(null);

  const handleAddEntry = () => {
    const { name, phoneNumber, prefix } = whatsappMsgData;
    // Validate inputs (ensure non-empty and trimmed values)
    if (name.trim() && phoneNumber.trim()) {
      setEntries((prevEntries) => {
        if (editIndex !== null) {
          // Update existing entry
          const updatedEntries = [...prevEntries];
          updatedEntries[editIndex] = { prefix, name, phoneNumber };
          setEditIndex(null); // Reset editIndex
          return updatedEntries;
        } else {
          // Add new entry
          return [...prevEntries, { prefix, name, phoneNumber }];
        }
      });

      // Reset the input fields
      setWhatsappMsgData({ prefix: "Mr", name: "", phoneNumber: "" });
    } else {
      console.log("Please enter valid data."); // Input validation error
    }
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const handleEditEntry = (index) => {
    const entryToEdit = entries[index];
    setWhatsappMsgData(entryToEdit); // Populate input fields
    setEditIndex(index); // Track the index being edited
  };

  const handleUpCall1 = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/patient/edit-call1-patient/${patient_id}`,
        {
          p_vid: patient_id,
          p_jcall1: {
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            notes: call1,
          },
        }
      );
      console.log(response.data, "response 1");
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpCall2 = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/patient/edit-call2-patient/${patient_id}`,
        {
          p_vid: patient_id,
          p_jcall2: {
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            notes: call2,
          },
        }
      );
      console.log(response.data, "response 2");
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpCall3 = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/patient/edit-call3-patient/${patient_id}`,
        {
          p_vid: patient_id,
          p_jcall3: {
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            notes: call3,
          },
        }
      );
      console.log(response.data, "response 3");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] m-0 animationtext">
          Enquiry Registraion Form
        </h1>
      </div>
      <hr className="my-2" />
      <div className="p-6 max-sm:p-0 bg-gray-50 min-h-screen">
        {/* Headers */}
        <div className="flex justify-between items-center">
          <NavTabs currentPage={currentPage} currentTab={currentTab} />
          <button
            className="bg-[--navbar-bg-color] gap-3 flex-nowrap flex items-center justify-center px-4 hover:shadow-md p-2 hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 text-white rounded-md"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowRoundBack /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Side */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name: <span className="text-red-500">*</span>
              </label>
              <input
                name="p_vName"
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                value={formData.p_vName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date of Birth:
              </label>
              <input
                name="p_vdob"
                type="date"
                onChange={handleInputChange}
                value={formatDate(formData.p_vdob)}
                min={0}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Age: <span className="text-red-500">*</span>
              </label>
              <input
                name="p_iAge"
                type="number"
                min={0}
                placeholder="Age"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                value={formData.p_iAge}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Patient Type:
              </label>
              <select
                name="p_vpattype"
                value={formData.p_vpattype}
                onChange={handleInputChange}
                className="w-full px-4 py-1 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              >
                <option>Select Patient Type</option>
                <option value="daily">Daily</option>
                <option value="rehab">Rehab</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Gender: <span className="text-red-500">*</span>{" "}
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="p_egender"
                    value="male"
                    checked={formData.p_egender === "male"}
                    className="form-radio text-blue-500 shadow-md"
                    onChange={handleInputChange}
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="p_egender"
                    value="female"
                    checked={formData.p_egender === "female"}
                    className="form-radio text-blue-500 shadow-md"
                    onChange={handleInputChange}
                  />
                  <span>Female</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="p_egender"
                    value="other"
                    checked={formData.p_egender === "other"}
                    className="form-radio text-blue-500 shadow-md"
                    onChange={handleInputChange}
                  />
                  <span>Other</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Marital Status:
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="p_emStatus"
                    value="single"
                    checked={formData.p_emStatus === "single"}
                    className="form-radio text-blue-500 shadow-md"
                    onChange={(e) => handleInputChange(e)}
                  />
                  <span>Single</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="p_emStatus"
                    value="married"
                    checked={formData.p_emStatus === "married"}
                    className="form-radio text-blue-500 shadow-md"
                    onChange={(e) => handleInputChange(e)}
                  />
                  <span>Married</span>
                </label>
              </div>
            </div>{" "}
            <div>
              <label className="block text-sm font-medium mb-2">Address:</label>
              <textarea
                placeholder="Address"
                name="p_tAddress"
                value={formData.p_tAddress}
                onChange={handleInputChange}
                className="w-full resize-none px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 shadow-md"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tel / Mobile: <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={"in"}
                countryCodeEditable={false}
                value={formData.p_vPhone}
                onChange={(phone) => handleFormPhoneChange(phone, "p_vPhone")}
                placeholder="Enter phone number"
                inputStyle={{
                  width: "100%",
                  height: "3rem",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #dcdcdc",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Convenient Call Time:
              </label>
              <TimePicker
                value={
                  formData.p_vctime
                    ? moment(formData.p_vctime, "hh:mm A")
                    : null
                }
                onChange={handleTimeChange}
                format="hh:mm A"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                name="p_vEmail"
                value={formData.p_vEmail}
                onChange={handleInputChange}
                placeholder="example@example.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Occupation:
              </label>
              <input
                name="p_voccupation"
                value={formData.p_voccupation}
                onChange={handleInputChange}
                type="text"
                placeholder="Occupation"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="flex-1">
                <h1>Referred by</h1>
                <div className="flex flex-wrap gap-4 w-full">
                  {/* Prefix Select */}
                  <select
                    name="prefix"
                    value={whatsappMsgData?.prefix}
                    onChange={handleWhatsappMessage}
                    className="w-fit px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                  </select>

                  {/* Name Input */}
                  <input
                    type="text"
                    placeholder="Enter Name"
                    name="name"
                    value={whatsappMsgData?.name}
                    onChange={handleWhatsappMessage}
                    className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  />

                  {/* Phone Input and WhatsApp Button */}
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <PhoneInput
                      country={"in"}
                      countryCodeEditable={false}
                      value={whatsappMsgData?.phoneNumber}
                      onChange={(phone) =>
                        handleWhatsAppPhoneChange(phone, "phoneNumber")
                      }
                      placeholder="Enter phone number"
                      inputStyle={{
                        width: "100%",
                        height: "3rem",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #dcdcdc",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <button
                      onClick={handleAddEntry}
                      className="flex items-center bg-gray-500 text-white px-2 py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
                    >
                      <IoMdAddCircle size={30} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    {entries?.length > 0 && (
                      <table className="w-full max-w-5xl border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Prefix
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Phone Number
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 border-b text-sm text-gray-700">
                                {entry.prefix}
                              </td>
                              <td className="px-4 py-2 border-b text-sm text-gray-700">
                                {entry.name}
                              </td>
                              <td className="px-4 py-2 border-b text-sm text-gray-700">
                                {entry.phoneNumber}
                              </td>

                              <td className="px-4 py-2 border-b flex items-center gap-4">
                                {/* Edit Button */}
                                <button
                                  onClick={() => handleEditEntry(index)}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Edit Entry"
                                >
                                  <IoMdCreate size={20} />
                                </button>
                                {/* <button onClick={() => handleGreetings(entry)}>
                                  <FaWhatsapp size={20} />
                                </button> */}

                                {/* Remove Button */}
                                <button
                                  onClick={() => handleRemoveEntry(index)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Remove Entry"
                                >
                                  <IoMdClose size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {formData.p_referredby?.length > 0 && (
                      <table className="overflow-scroll w-full max-w-5xl border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Prefix
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium bg-blue-500 text-white border-b">
                              Phone Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.p_referredby?.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 border-b text-sm text-gray-700">
                                {entry?.prefix}
                              </td>
                              <td className="px-4 py-2 border-b text-sm text-gray-700">
                                {entry?.name}
                              </td>
                              <td className="px-4 py-2 border-b text-sm text-gray-700">
                                {entry?.phoneNumber}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Service For:
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 shadow-md"
                    value="Ortho"
                    onChange={(e) => {
                      const value = e.target.value;
                      const checked = e.target.checked;
                      handleInputChange({
                        target: {
                          name: "p_jservice",
                          value: checked
                            ? [...(formData.p_jservice || []), value]
                            : (formData.p_jservice || []).filter(
                                (item) => item !== value
                              ),
                        },
                      });
                    }}
                    name="p_jservice"
                    checked={formData.p_jservice?.includes("Ortho")}
                  />
                  Ortho
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 shadow-md"
                    value="Neuro"
                    onChange={(e) => {
                      const value = e.target.value;
                      const checked = e.target.checked;
                      handleInputChange({
                        target: {
                          name: "p_jservice",
                          value: checked
                            ? [...(formData.p_jservice || []), value]
                            : (formData.p_jservice || []).filter(
                                (item) => item !== value
                              ),
                        },
                      });
                    }}
                    name="p_jservice"
                    checked={formData.p_jservice?.includes("Neuro")}
                  />
                  Neuro
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 shadow-md"
                    value="Women's Health"
                    onChange={(e) => {
                      const value = e.target.value;
                      const checked = e.target.checked;
                      handleInputChange({
                        target: {
                          name: "p_jservice",
                          value: checked
                            ? [...(formData.p_jservice || []), value]
                            : (formData.p_jservice || []).filter(
                                (item) => item !== value
                              ),
                        },
                      });
                    }}
                    name="p_jservice"
                    checked={formData.p_jservice?.includes("Women's Health")}
                  />
                  Women's Health
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 shadow-md"
                    value="Pregnancy Fitness Class / Postnatal"
                    onChange={(e) => {
                      const value = e.target.value;
                      const checked = e.target.checked;
                      handleInputChange({
                        target: {
                          name: "p_jservice",
                          value: checked
                            ? [...(formData.p_jservice || []), value]
                            : (formData.p_jservice || []).filter(
                                (item) => item !== value
                              ),
                        },
                      });
                    }}
                    name="p_jservice"
                    checked={formData.p_jservice?.includes(
                      "Pregnancy Fitness Class / Postnatal"
                    )}
                  />
                  Pregnancy Fitness Class / Postnatal
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 shadow-md"
                    value="Pelvic Floor Dysfunction"
                    onChange={(e) => {
                      const value = e.target.value;
                      const checked = e.target.checked;
                      handleInputChange({
                        target: {
                          name: "p_jservice",
                          value: checked
                            ? [...(formData.p_jservice || []), value]
                            : (formData.p_jservice || []).filter(
                                (item) => item !== value
                              ),
                        },
                      });
                    }}
                    name="p_jservice"
                    checked={formData.p_jservice?.includes(
                      "Pelvic Floor Dysfunction"
                    )}
                  />
                  Pelvic Floor Dysfunction
                </label>
              </div>
            </div>
            <h1 className="text-xl font-bold mb-4 text-gray-800">
              Follow Up Calls
            </h1>
            <div className="flex flex-col gap-5">
              <div className="border p-4 rounded shadow space-y-4">
                <h4 className="text-lg font-semibold">Call 1</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes:
                  </label>
                  <textarea
                    value={formData?.p_jcall1?.notes}
                    onChange={(e) => {
                      handleCall1Change("notes", e.target.value);
                      setCall1(e.target.value);
                    }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                    rows="3"
                  />
                </div>
                <button
                  onClick={() => {
                    handleUpCall1();
                  }}
                  className="bg-[--navbar-bg-color] text-white px-5 py-1 rounded"
                >
                  Add Call 1
                </button>
              </div>
              {/* Call 2 */}
              <div className="border p-4 rounded shadow space-y-4">
                <h4 className="text-lg font-semibold">Call 2</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes:
                  </label>
                  <textarea
                    value={formData?.p_jcall2?.notes}
                    onChange={(e) => {
                      handleCall2Change("notes", e.target.value);
                      setCall2(e.target.value);
                    }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                    rows="3"
                  />
                </div>
                <button
                  onClick={() => {
                    handleUpCall2();
                  }}
                  className="bg-[--navbar-bg-color] text-white px-5 py-1 rounded"
                >
                  Add Call 2
                </button>
              </div>
              {/* Call 3 */}
              <div className="border p-4 rounded shadow space-y-4">
                <h4 className="text-lg font-semibold">Call 3</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes:
                  </label>
                  <textarea
                    value={formData?.p_jcall3?.notes}
                    onChange={(e) => {
                      handleCall3Change("notes", e.target.value);
                      setCall3(e.target.value);
                    }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                    rows="3"
                  />
                </div>
                <button
                  onClick={() => {
                    handleUpCall3();
                  }}
                  className="bg-[--navbar-bg-color] text-white px-5 py-1 rounded"
                >
                  Add Call 3
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="p_date"
                required
                onChange={handleInputChange}
                value={
                  formData.p_date
                    ? formData.p_date
                    : new Date().toISOString().split("T")[0]
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />{" "}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height:</label>
              <input
                name="p_fheight"
                onChange={handleInputChange}
                value={formData.p_fheight}
                type="number"
                placeholder="cms"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight:</label>
              <input
                name="p_fweight"
                onChange={handleInputChange}
                value={formData.p_fweight}
                type="number"
                placeholder="Kgs"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">BMI:</label>
              <input
                name="p_fbmi"
                onChange={handleInputChange}
                value={formData.p_fbmi}
                type="text"
                placeholder="Enter BMI"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">DM:</label>
              <input
                name="p_vdm"
                value={formData.p_vdm}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter DM"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">HT:</label>
              <input
                name="p_vht"
                value={formData.p_vht}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter HT"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Clinical Notes:
              </label>
              <input
                name="p_tclinicalnotes"
                value={formData.p_tclinicalnotes}
                onChange={handleInputChange}
                type="text"
                placeholder="Medical / Surgical History"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">
                For Center Use Only
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Appointment For:
                  </label>
                  <select
                    name="p_vappointmentfor"
                    value={formData.p_vappointmentfor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        p_vappointmentfor: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  >
                    <option value="">Select</option>
                    <option value="Dr. Ramesh Babu">Dr. Ramesh Babu</option>
                    <option value="Dr. Abirami">Dr. Abirami</option>
                    <option value="Dr. Saranya">Dr. Saranya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer enquiry received by:
                  </label>
                  <input
                    name="p_vcenquiry"
                    value={user_name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Assessment done by:
                  </label>
                  <input
                    name="p_vassessmentby"
                    value={formData.p_vassessmentby}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    PT Incharge:
                  </label>
                  <input
                    type="text"
                    name="p_vptincharge"
                    onChange={handleInputChange}
                    value={formData.p_vptincharge}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  />
                </div>

                {!patient_id ? (
                  <button
                    onClick={handleSubmit}
                    className="w-fit bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors shadow-md"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="w-fit bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors shadow-md"
                  >
                    Update
                  </button>
                )}
              </div>

              {/* <div className="mt-4">
                <hr className="border-t border-gray-300" />
              </div>

              <div className="my-4">
                <h1 className="bg-green-100 p-2 rounded-md text-center font-semibold text-green-800 border border-green-500">
                  Whatsapp Message
                </h1>

                <div className="mt-4">
                  <div>
                    <div className="flex justify-between">
                      <h1 className="mt-2 font-medium">Patient Registration</h1>

                      <button className="bg-green-100 border border-green-500 text-green-600 rounded-lg p-2">
                        <FaWhatsapp size={25} />
                      </button>
                    </div>
                    <div className="my-4">
                      <hr className="border-t border-gray-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <h1 className="font-medium">Refered by:</h1>
                    </div>
                    <div className="my-4">
                      <hr className="border-t border-gray-300" />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryRegistrationForm;
