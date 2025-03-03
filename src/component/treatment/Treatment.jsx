import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Treatment = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userName = user.u_vName;
  const clinicId = user.u_vClinicId;

  const [patientData, setPatientData] = useState({
    p_vName: "",
  });
  const [formData, setFormData] = useState({
    reassessment: userName,
    patientName: "",
    vasScale: 0,
    complaint: "",
    protocol: "",
    date: "",
  });

  useEffect(() => {
    const getPatientById = async () => {
      const response = await AxiosInstance.get(
        `/patient/get-patient/${patient_id}`
      );
      setPatientData(response.data.response || { p_vName: "" });
      setFormData((prev) => ({
        ...prev,
        patientName: response.data.response?.p_vName || "",
      }));
    };

    getPatientById();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post(
        "/treatment/add-treatment-plan",
        {
          tp_vclinicid: clinicId,
          tp_vpid: patient_id,
          tp_vname: patientData.p_vName,
          tp_vdate: formData.date,
          tp_vreassdoneby: formData.reassessment,
          tp_iscale: formData.vasScale,
          tp_vpcomp: formData.complaint,
          tp_vtproto: formData.protocol,
        }
      );
      if (response.data.status == 201) {
        message.success(response.data.message);
        navigate(-1);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error submitting form");
      console.log(error);
    }
  };

  return (
    <div className="p-6 flex-col bg-gray-100  flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Program Card</h1>
      <form
        className="bg-white shadow-md rounded-lg p-8 w-fit flex flex-col gap-4 items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-5 items-center justify-center">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Reassessment done by
            </label>
            <input
              type="text"
              name="reassessment"
              value={formData.reassessment}
              onChange={handleChange}
              placeholder="Reassessment done by"
              className="w-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Patient Name
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Patient name"
              className="w-96  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Vas Scale</label>
            <input
              type="range"
              name="vasScale"
              min={0}
              max={10}
              value={formData.vasScale}
              onChange={handleChange}
              className="w-96"
            />
            <span className="ml-2">{formData.vasScale}</span>
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Present Complaint
            </label>
            <input
              type="text"
              name="complaint"
              value={formData.complaint}
              onChange={handleChange}
              placeholder="Present complaint"
              className="w-96  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Treatment Protocol
            </label>
            <input
              type="text"
              name="protocol"
              value={formData.protocol}
              onChange={handleChange}
              placeholder="Treatment protocol"
              className="w-96  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-96  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="py-2 px-4 w-40 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Treatment;
