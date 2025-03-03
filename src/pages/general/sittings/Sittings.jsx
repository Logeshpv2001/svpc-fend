import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { message, Tabs } from "antd";
import {
  FaBarcode,
  FaBirthdayCake,
  FaCalendarAlt,
  FaCreditCard,
  FaIdCard,
  FaListOl,
  FaMoneyBillWave,
  FaPercent,
  FaPhone,
  FaRupeeSign,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";

const AddSittingHistory = () => {
  const { packageid, patientid } = useParams();
  console.log(packageid);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userName = user.u_vName;
  const clinic_id = user.u_vClinicId;
  const [singleData, setSingleData] = useState([]);
  const [sitting, setSitting] = useState([]);
  const [sittingForm, setSittingForm] = useState({
    st_epaymentthrough: "",
    st_dsittingamt: "",
    st_tamtrecby: userName,
    st_vdate: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSittingForm({
      ...sittingForm,
      [name]: value,
    });
  };

  const formattedDate = (dateString) => {
    const st_vdate = new Date(dateString);
    const day = st_vdate.getDate();
    const month = st_vdate.getMonth() + 1;
    const year = st_vdate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const packagebillData = async () => {
    try {
      const response = await AxiosInstance.post(
        "/packagebill/get-packagebillbyid",
        {
          pb_vid: packageid,
        }
      );
      console.log(response);
      setSingleData(response.data.response[0] || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getSittings = async () => {
    try {
      const response = await AxiosInstance.get(
        `/sittingtable/get-sittingtable-by-packagebill/${packageid}`
      );
      setSitting(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...sittingForm,
      st_vpid: packageid,
      st_vclinicid: clinic_id,
      st_vpatient_id: singleData.pb_vpatient_id,
      st_vdate: sittingForm.st_vdate
        ? sittingForm.st_vdate
        : new Date().toISOString().split("T")[0],
    };
    try {
      const response = await AxiosInstance.post(
        "/sittingtable/add-sitting-table",
        payload
      );
      if (response.data.status === 201) {
        message.success("Sitting Added Successfully");
        getSittings();
        setSittingForm({
          st_epaymentthrough: "",
          st_dsittingamt: "",
          st_tamtrecby: userName,
          st_vdate: "",
        });
      } else {
        message.error("Sitting date does not match check-in date");
      }
    } catch (error) {
      message.error(error.response.message);
      console.log(error);
    }
  };

  useEffect(() => {
    packagebillData();
    getSittings();
  }, []);

  function formatDate(currentDate) {
    if (!currentDate) return "-/-";
    if (isNaN(Date.parse(currentDate))) return "-/-";

    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="w-full mx-auto p-5 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex relative justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#075985] absolute left-0 text-white font-medium flex flex-row items-center gap-2 px-4 py-2 rounded-md hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 ease-out hover:shadow-md"
          >
            <IoMdArrowRoundBack /> Back
          </button>
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            Sitting
          </h2>
        </div>
        <div>
          <div className="flex flex-row justify-between items-center">
            <div className="w-full flex flex-row justify-center max-lg:flex-wrap gap-5">
              <div className="flex flex-col w-full">
                <h3 className="text-lg font-bold text-gray-700">
                  Personal Details
                </h3>
                <div className="bg-white border p-4 rounded-lg shadow-md divide-y-2 divide-gray-200 flex flex-col justify-between">
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 m-0 flex items-center gap-2">
                      <span className="text-blue-500 w-6 h-6">
                        <FaUser />
                      </span>
                      Name
                    </p>
                    <p className="text-lg font-normal text-gray-600 capitalize m-0">
                      {singleData.pb_vname}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaIdCard />
                      </span>
                      Patient ID
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_vpatient_id}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 m-0 flex items-center gap-2">
                      <span className="text-blue-500 w-6 h-6">
                        <FaBirthdayCake />
                      </span>
                      Age
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_iage}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between m-0 py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaVenusMars />
                      </span>
                      Gender
                    </p>
                    <p className="text-lg font-normal text-gray-600 capitalize m-0">
                      {singleData.pb_eegender}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center m-0 gap-2">
                      <span className="text-blue-500 w-6 h-6">
                        <FaCalendarAlt />
                      </span>
                      Date
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {formattedDate(singleData.pb_vdate)}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaPhone />
                      </span>
                      Phone No
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_vphone}
                    </p>
                  </div>
                </div>{" "}
              </div>
              <div className="flex flex-col w-full">
                <h3 className="text-lg font-bold text-gray-700">
                  Payment Details
                </h3>
                <div className="bg-white border p-4 rounded-lg shadow-md divide-y-2 divide-gray-200 flex flex-col justify-between">
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaBarcode />
                      </span>
                      Package ID
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_vid}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaListOl />
                      </span>
                      No of Sittings
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_inoofsit}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaCreditCard />
                      </span>
                      Payment Method
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_epaymethod}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaUser />
                      </span>
                      Received By
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_vwhobuyed}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaRupeeSign />
                      </span>
                      Amount
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      ₹{singleData.pb_damt}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaPercent />
                      </span>
                      Discount %
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      {singleData.pb_ddis}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <p className="text-lg font-semibold text-gray-700 flex items-center gap-2 m-0">
                      <span className="text-blue-500 w-6 h-6">
                        <FaMoneyBillWave />
                      </span>
                      Balance to Pay
                    </p>
                    <p className="text-lg font-normal text-gray-600 m-0">
                      ₹{singleData.pb_dbaltopay}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto p-5 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex flex-row items-center justify-between">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Add Sitting
            </h1>
            <div className="flex flex-row flex-wrap gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="st_vdate"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Date:
                </label>
                <input
                  type="date"
                  id="st_vdate"
                  name="st_vdate"
                  value={
                    sittingForm.st_vdate ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="st_epaymentthrough"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method:
                </label>
                <select
                  name="st_epaymentthrough"
                  id="st_epaymentthrough"
                  value={sittingForm.st_epaymentthrough}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">select</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="receivedBy"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Received By:
                </label>
                <input
                  type="text"
                  id="receivedBy"
                  name="receivedBy"
                  value={userName}
                  disabled
                  placeholder="received by"
                  className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="st_dsittingamt"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Amount:
                </label>
                <input
                  type="text"
                  id="st_dsittingamt"
                  name="st_dsittingamt"
                  placeholder="Amount"
                  value={sittingForm.st_dsittingamt}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="self-end px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="w-full">Sitting History</h1>
          <div className="overflow-auto w-full shadow-md rounded-lg">
            <table className="w-full bg-white shadow-md rounded-lg text-nowrap">
              <thead className="bg-[--navbar-bg-color] text-white shadow-md">
                <tr>
                  <th className="px-6 py-3  text-sm font-semibold  uppercase tracking-wider border-b rounded-tl-md">
                    S No
                  </th>
                  <th className="px-6 py-3  text-sm font-semibold  uppercase tracking-wider border-b">
                    Date
                  </th>
                  <th className="px-6 py-3  text-sm font-semibold  uppercase tracking-wider border-b">
                    Sitting Amount
                  </th>
                  <th className="px-6 py-3  text-sm font-semibold  uppercase tracking-wider border-b">
                    Payment Method
                  </th>
                  <th className="px-6 py-3  text-sm font-semibold  uppercase tracking-wider border-b rounded-tr-md">
                    Received By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sitting.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {formatDate(item.st_vdate) || "No date"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.st_dsittingamt || "No amount"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.st_epaymentthrough || "No payment method"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.st_tamtrecby || "Not specified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{" "}
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default AddSittingHistory;
