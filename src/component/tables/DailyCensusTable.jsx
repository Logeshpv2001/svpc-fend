import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";

const DailyCensusTable = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [censusData, setCensusData] = useState([]); // Census data from API
  const [searchQuery, setSearchQuery] = useState(""); // Global search query
  const [censusDate, setCensusDate] = useState(""); // Selected date filter
  const clinic_id = user?.u_vClinicId; // Safely retrieve clinic ID

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch census data from the API
  const getCensusData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/census/get-census-for-daily`
      );
      setCensusData(response.data.response || []);
    } catch (error) {
      setCensusData([]); // Reset data on error
      console.error("Failed to fetch census data:", error);
    }
  };

  // Filter data based on search query and selected date
  const filteredData = censusData.filter((record) => {
    const recordDate = new Date(record.cs_vcensusdate);
    const selectedDate = censusDate ? new Date(censusDate) : null;

    // Check if the record matches the selected date
    const isDateMatch =
      !selectedDate ||
      recordDate.toDateString() === selectedDate.toDateString();

    // Check if the record matches the search query
    const isSearchMatch =
      record.cs_vname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.cs_vphone.includes(searchQuery);

    return isDateMatch && isSearchMatch;
  });

  // Load census data on component mount
  useEffect(() => {
    getCensusData();
  }, []);

  // Clear search query and date filter
  const handleClear = () => {
    setSearchQuery("");
    setCensusDate("");
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap mb-4">
        {/* Global search input */}
        <input
          type="text"
          placeholder="Search by Name or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-2/12 p-1 border border-gray-300 rounded mr-2 mb-2 focus:outline-none"
        />
        {/* Date filter input */}
        <input
          type="date"
          value={censusDate}
          onChange={(e) => setCensusDate(e.target.value)}
          className="w-full md:w-2/12 p-1 border border-gray-300 rounded mr-2 mb-2 focus:outline-none"
        />
        {/* Clear Filters Button */}
        <button
          onClick={handleClear}
          className="flex items-center mb-2 bg-red-500 text-white border border-gray-600 font-semibold rounded-lg px-4 py-1 hover:bg-red-600"
        >
          Clear
        </button>
      </div>

      {/* Table for census data */}
      <div className="overflow-x-auto text-nowrap">
        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-[--navbar-bg-color] text-white">
            <tr>
              <th className="p-2 text-left font-semibold">S. No</th>
              <th className="p-2 text-left font-semibold">Patient Name</th>
              <th className="p-2 text-left font-semibold">Phone</th>
              <th className="p-2 text-left font-semibold">Census Date</th>
              <th className="p-2 text-left font-semibold">Check-in</th>
              <th className="p-2 text-left font-semibold">Check-in (PT)</th>
              <th className="p-2 text-left font-semibold">Check-out</th>
              <th className="p-2 text-left font-semibold">Check-out (PT)</th>
              {/* <th className="p-2 text-left font-semibold">Old / New</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <tr key={record.id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{record.cs_vname}</td>
                  <td className="p-2">{record.cs_vphone}</td>
                  <td className="p-2">{formatDate(record.cs_vcensusdate)}</td>
                  <td className="p-2">{record.cs_vcheckintime}</td>
                  <td className="p-2">{record.cs_vptchkinname}</td>
                  <td className="p-2">{record.cs_checkouttime || "N/A"}</td>
                  <td className="p-2">{record.cs_vptchkoutname || "N/A"}</td>
                  {/* <td className="p-2 text-center font-semibold">
                    {record.cs_voldnew}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyCensusTable;
