import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../utilities/AxiosInstance";

const AttendanceTable = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getAttendanceData = async () => {
      const response = await AxiosInstance.post("/attendance/get-attendance", {
        ea_vClinic_id: userInfo.u_vClinicId,
        a_date: today,
      });
      setAttendanceData(response.data.response || []);
    };

    getAttendanceData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter Logic
  const filteredData = (attendanceData || []).filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.ea_vEmp_id.toLowerCase().includes(query) ||
      item.ea_vName.toLowerCase().includes(query) ||
      item.a_date?.includes(query) ||
      item.login_time?.includes(query) ||
      item.logout_time?.includes(query)
    );
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil((filteredData.length || 0) / rowsPerPage);

  const navigate = useNavigate();

  function nextreviewDate(dateString) {
    if (!dateString) return "N/A";
    const datePart = dateString.split(",")[0];
    const [day, month, year] = datePart.split("/");
    return `${day}-${month}-${year}`;
  }

  function convertTo12HourFormat(time24) {
    if (!time24) return "N/A";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  }

  return (
    <div>
      {/* Filter Section */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#075985] text-white font-medium flex flex-row items-center gap-2 px-4 py-2 rounded-md hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 ease-out hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 text-nowrap text-center">
          <thead className="text-base text-white bg-[--navbar-bg-color]">
            <tr>
              <th scope="col" className="py-3 px-6 border">
                S.No
              </th>
              <th scope="col" className="py-3 px-6 border">
                Employee ID
              </th>
              <th scope="col" className="py-3 px-6 border">
                Employee Name
              </th>
              <th scope="col" className="py-3 px-6 border">
                Date
              </th>
              <th scope="col" className="py-3 px-6 border">
                Check In
              </th>
              <th scope="col" className="py-3 px-6 border">
                Check Out
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td
                    scope="row"
                    className="py-4 px-6 border font-semibold text-lg"
                  >
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="py-4 px-6 border">{item.ea_vEmp_id}</td>
                  <td className="py-4 px-6 border">{item.ea_vName}</td>
                  <td className="py-4 px-6 border">
                    {nextreviewDate(item.a_date)}
                  </td>
                  <td className="py-4 px-6 border text-green-500 font-semibold text-base">
                    {convertTo12HourFormat(item.login_time)}
                  </td>
                  <td className="py-4 px-6 border text-red-500 font-semibold text-base">
                    {convertTo12HourFormat(item.logout_time)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-4 px-6 border text-center text-gray-500"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 border rounded-md ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
