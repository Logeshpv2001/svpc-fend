import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import BodyPointerShower from "../bodyPointer/BodyPointerShower";
import { useParams } from "react-router-dom";

const AssessmentFormView = () => {
  const [patientFormData, setPatientFormData] = useState([]);
  const { patient_id } = useParams();
  const formData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/assessmentform/get-assessmentform/${patient_id}`
      );
      setPatientFormData(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    formData();
  }, []);

  const formatedData = (date) => {
    if (!date) return "N/A";
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) return "N/A";
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex flex-col p-5 bg-gray-100 min-h-screen border-t-4 rounded-lg border-gray-400 shadow-md">
      <div>
        <h1 className="flex justify-center text-center font-bold text-2xl text-gray-800">
          Assessment Form View
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6 max-lg:grid-cols-1">
        {/* Left Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full space-y-4">
          {/* Basic Information */}
          <div className="flex flex-col space-y-2 justify-between">
            <p className="text-gray-700 flex justify-between">
              <strong>Assessment Date:</strong>{" "}
              {formatedData(patientFormData.a_assessmentdate)}
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>Complaints:</strong> {patientFormData.a_tcomplaints}
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>PMH/Injury/Surgery:</strong> {patientFormData.a_tpmh}
            </p>
          </div>
          <hr className="border border-gray-300" />

          {/* Pain Section */}
          <div className="flex flex-col space-y-4">
            <h1 className="font-bold text-lg text-gray-800">Pain</h1>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-700 flex justify-between">
                <strong>Onset:</strong> {patientFormData.a_jonset?.join(", ")}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Nature:</strong> {patientFormData.a_jnature?.join(", ")}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Type:</strong> {patientFormData.a_jtype?.join(", ")}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Aggravating Factors:</strong>{" "}
                {patientFormData.a_jaggravating_factor?.join(", ")}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Sleep Disturbance:</strong>{" "}
                {patientFormData.a_jsleep_disturbance?.join(", ")}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Special Questions:</strong>{" "}
                {patientFormData.a_jspl_ques?.join(", ")}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Implants:</strong> {patientFormData.a_timplants}
              </p>
              <p className="text-gray-700 flex justify-between">
                <strong>Red Flags:</strong> {patientFormData.a_tred_flags}
              </p>
            </div>
          </div>
          <hr className="border border-gray-300" />

          {/* Investigation Section */}
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700 flex justify-between">
              <strong>Investigation:</strong> {patientFormData.a_tinvestigation}
            </p>
            {patientFormData.a_tfilepath && (
              <div>
                <strong className="text-gray-700 flex">Attached File:</strong>

                {patientFormData.a_tfilepath.toLowerCase().endsWith('.pdf') ? (
                  <embed
                    src={patientFormData.a_tfilepath}
                    type="application/pdf"
                    className="w-full h-96 mt-2 rounded-md shadow cursor-pointer"
                    onClick={() => window.open(patientFormData.a_tfilepath, '_blank')}
                  />
                ) : (
                  <img
                    src={patientFormData.a_tfilepath}
                    alt="Assessment"
                    className="max-w-xs mt-2 rounded-md shadow cursor-pointer"
                    onClick={() => window.open(patientFormData.a_tfilepath, '_blank')}
                  />
                )}
              </div>
            )}
            <p className="text-gray-700 flex justify-between">
              <strong>Diagnosis:</strong> {patientFormData.a_tdiagnosis}
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>Treatment Advised:</strong>{" "}
              {patientFormData.a_ttreatment_advised}
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>Home Advice:</strong> {patientFormData.a_thome_advice}
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>Payment Proposal:</strong>{" "}
              {patientFormData.a_epayment_proposal}
            </p>
          </div>
          <hr className="border border-gray-300" />

          {/* VAS Scale */}
          <div className="flex flex-col">
            <strong className="text-gray-700">VAS Scale:</strong>{" "}
            <p className="text-gray-800">{patientFormData.a_iscale}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <BodyPointerShower patientFormData={patientFormData} />
        </div>
      </div>
    </div>
  );
};
export default AssessmentFormView;
