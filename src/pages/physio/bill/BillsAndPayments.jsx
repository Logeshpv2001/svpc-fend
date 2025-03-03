import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { Link } from "react-router-dom";
function BillsAndPayments() {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [patientsData, setPatientsData] = useState([]);
  const [filteredPatientsData, setFilteredPatientsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const getAllPatients = async () => {
      try {
        const response = await AxiosInstance.post(
          "/patient/get-patientByClinicId",
          {
            id: userInfo.u_vClinicId,
          }
        );

        const data = response.data.response || [];
        setPatientsData(data);
        setFilteredPatientsData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllPatients();
  }, []);
  return (
    <div className="text-nowrap w-full">
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext m-0">
          Bill and Payments
        </h1>
      </div>
      <div className="my-4 relative">
        <input
          type="text"
          placeholder="Search patients..."
          className="max-w-96 p-2 pl-10 border border-gray-300 rounded-lg"
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm === "") {
              setFilteredPatientsData(patientsData);
            } else {
              const filteredData = patientsData.filter(
                (patient) =>
                  patient.p_vName.toLowerCase().includes(searchTerm) ||
                  patient.p_vid.toLowerCase().includes(searchTerm) ||
                  patient.p_vPhone.includes(searchTerm)
              );
              setFilteredPatientsData(filteredData);
            }
          }}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>{" "}
      <div className="overflow-x-auto">
        <table className="table w-full mt-4 text-center bg-white shadow-md rounded-lg">
          <thead className="">
            <tr className="bg-[--navbar-bg-color] text-white ">
              <th className="p-4 border-b-2 border-gray-200 rounded-tl-md">
                S.no
              </th>
              <th className="p-4 border-b-2 border-gray-200">Patient ID</th>
              <th className="p-4 border-b-2 border-gray-200">Name</th>
              <th className="p-4 border-b-2 border-gray-200">Phone Number</th>
              <th className="p-4 border-b-2 border-gray-200">Gender</th>
              <th className="p-4 border-b-2 border-gray-200 rounded-tr-md">
                Bills
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredPatientsData
              .slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
              )
              .map((patient, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 align-middle">
                    {index + 1 + currentPage * itemsPerPage}
                  </td>
                  <td className="p-3 align-middle">{patient.p_vid}</td>
                  <td className="p-3 align-middle capitalize">
                    {patient.p_vName}
                  </td>
                  <td className="p-3 align-middle">{patient.p_vPhone}</td>
                  <td className="p-3 align-middle capitalize">
                    {patient.p_egender}
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex gap-2 items-center justify-center">
                      <Link to={`/physio/daily-bill/${patient.p_vid}`}>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Daily
                        </button>
                      </Link>
                      <Link to={`/physio/package-bill/${patient.p_vid}`}>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Package
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          {"<"}
        </button>
        <span className="px-4 py-2">
          Page {currentPage + 1} of{" "}
          {Math.ceil(filteredPatientsData?.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                Math.ceil(filteredPatientsData?.length / itemsPerPage) - 1,
                prev + 1
              )
            )
          }
          disabled={
            currentPage >=
            Math.ceil(filteredPatientsData?.length / itemsPerPage) - 1
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default BillsAndPayments;
