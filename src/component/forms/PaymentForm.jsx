import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utilities/AxiosInstance";
import PatientDetailsCard from "../cards/PatientDetailsCard";
import { message } from "antd";

export default function PaymentForm() {
  const { patient_id } = useParams();
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [patientDetails, setPatientDetails] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [formData, setFormData] = useState({
    pb_dbilldate: "",
    pb_initialamt: "",
    pb_ddiscount: "",
    pb_ddisamt: "",
  });
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  function formatDate(currentDate) {
    const date = new Date(currentDate);
    const year = date.getFullYear(); // Get the local year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Local month
    const day = String(date.getDate()).padStart(2, "0"); // Local day

    return `${year}-${month}-${day}`;
  }

  const getPatientDetails = async () => {
    try {
      const response = await AxiosInstance.get(
        `/patient/get-patient/${patient_id}`
      );
      setPatientDetails(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiagnosis = async () => {
    try {
      const response = await AxiosInstance.get(
        `/assessmentform/get-diagnosis/${patient_id}`
      );
      setDiagnosis(response.data.response?.a_tdiagnosis || "");
    } catch (error) {
      console.log(error);
    }
  };

  const getPaymentDetails = async () => {
    try {
      const response = await AxiosInstance.get(
        `/physio-bill/get-physiobill-by-patient/${patient_id}`
      );
      setFormData(response.data.response);
      setBalanceAmount(response.data.response?.pb_damttopay || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
    getPaymentDetails();
    getDiagnosis();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pb_initialamt" || name === "pb_ddiscount") {
      const pb_initialamt =
        parseFloat(name === "pb_initialamt" ? value : formData.pb_initialamt) ||
        0;
      const discountPercentage =
        parseFloat(name === "pb_ddiscount" ? value : formData.pb_ddiscount) ||
        0;

      // Calculate the pb_ddiscount as a percentage of the total amount
      const discountValue = (pb_initialamt * discountPercentage) / 100;
      setFormData((prevData) => ({
        ...prevData,
        pb_ddisamt: discountValue,
      }));
      // Calculate the balance amount
      const balanceAmount = pb_initialamt - discountValue;

      // Update state or display the result as needed
      setBalanceAmount(balanceAmount);
    }
  };

  const payload = {
    pb_vclinicid: userInfo.u_vClinicId,
    pb_vpatient_id: patient_id,
    pb_vname: patientDetails.p_vName,
    pb_iage: patientDetails.p_iAge,
    pb_eegender: patientDetails.p_egender,
    pb_vphone: patientDetails.p_vPhone,
    pb_taddress: patientDetails.p_tAddress,
    pb_vdiagonis: diagnosis,
    pb_damttopay: balanceAmount,

    ...formData,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post(
        "/physio-bill/add-physiobill",
        payload
      );
      if (response.data.status === 201) {
        message.success(response.data.message);
        getPaymentDetails();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Please try again later!");
      console.log(error);
    }
  };

  return (
    <div>
      <PatientDetailsCard patientDetails={patientDetails} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={diagnosis}
              disabled
              onChange={handleInputChange}
              placeholder="Diagnosis"
              className="w-full border-2 cursor-not-allowed capitalize border-gray-300 rounded-md p-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="pb_dbilldate"
              value={formatDate(formData?.pb_dbilldate)}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <input
              type="number"
              name="pb_initialamt"
              value={formData?.pb_initialamt}
              onChange={handleInputChange}
              placeholder="Total Amount"
              className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              name="pb_ddiscount"
              value={formData?.pb_ddiscount}
              onChange={handleInputChange}
              placeholder="Discount"
              className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Amount
            </label>
            <input
              type="text"
              value={formData?.pb_ddisamt}
              readOnly
              className="w-full border-2 border-gray-300 rounded-md p-2 outline-none bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance to Pay
          </label>
          <input
            type="text"
            value={balanceAmount}
            readOnly
            className="w-full border-2 border-gray-300 rounded-md p-2 outline-none bg-gray-100"
          />
        </div>

        {!formData?.pb_vbid && (
          <div
            className={`bg-blue-500 w-fit px-2 py-1 text-white rounded-md mt-4 hover:bg-blue-600 duration-300`}
          >
            <button type="submit">Submit</button>
          </div>
        )}
      </form>
    </div>
  );
}
