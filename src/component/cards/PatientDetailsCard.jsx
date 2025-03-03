import React from "react";
import { BiMaleFemale } from "react-icons/bi";
import { FaBabyCarriage, FaHospitalUser } from "react-icons/fa";
import { MdPhoneCallback } from "react-icons/md";

export default function PatientDetailsCard({ patientDetails }) {
  return (
    <div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-500 shadow-lg p-4 rounded-xl flex flex-col items-center">
          <FaHospitalUser size={25} className="text-2xl text-blue-600 mb-2" />
          <h1 className="font-medium text-base text-gray-700">Name</h1>
          <p className="text-base text-gray-600 font-bold capitalize">
            {patientDetails.p_vName}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-500 shadow-lg p-4 rounded-xl flex flex-col items-center">
          <FaBabyCarriage size={25} className="text-2xl text-blue-600 mb-2" />
          <h1 className="font-medium text-base text-gray-700">Age</h1>
          <p className="text-base text-gray-600 font-bold">
            {patientDetails.p_iAge}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-500 shadow-lg p-4 rounded-xl flex flex-col items-center">
          <BiMaleFemale size={25} className="text-2xl text-blue-600 mb-2" />
          <h1 className="font-medium text-base text-gray-700">Gender</h1>
          <p className="text-base text-gray-600 font-bold capitalize">
            {patientDetails.p_egender}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-500 shadow-lg p-4 rounded-xl flex flex-col items-center">
          <MdPhoneCallback size={25} className="text-2xl text-blue-600 mb-2" />
          <h1 className="font-medium text-base text-gray-700">Phone</h1>
          <p className="text-base text-gray-600 font-bold">
            {patientDetails.p_vPhone}
          </p>
        </div>
      </div>
    </div>
  );
}
