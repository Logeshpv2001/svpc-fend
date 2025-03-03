import React, { useState, useEffect } from "react";
import { Calendar, Table } from "antd";
import DashboardCard from "../cards/DashboardCard";
import {
  FaUsers,
  FaMale,
  FaFemale,
  FaRev,
  FaRecycle,
  FaDailymotion,
  FaCalendar,
} from "react-icons/fa";
import { IoToday } from "react-icons/io5";
import { message } from "antd";

const NextReviewTable = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()); // Remove padStart for day
    const month = String(date.getMonth() + 1); // Remove padStart for month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function nextreviewDate(dateString) {
    if (!dateString) return "N/A";

    const datePart = dateString.split(",")[0];
    const [month, day, year] = datePart.split("/");
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      // Directly format the date to match the input format
      const formattedDate = formatDate(date); // No need to call formatDate for the input value

      // Filter the results where the next review date matches the selected date
      const filteredResults = data?.filter((item) => {
        const reviewDate = nextreviewDate(item.a_nextre); // Get next review date
        return reviewDate === formattedDate; // Directly compare the strings
      });

      setFilteredData(filteredResults);
    } else {
      setFilteredData(data);
    }
  };

  const clearFilter = () => {
    setSelectedDate("");
    setFilteredData(data);
    message.success("Filter cleared");
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "p_vid",
      key: "p_vid",
    },
    {
      title: "Name",
      dataIndex: "p_vName",
      key: "p_vName",
    },
    {
      title: "Date of Assessment",
      dataIndex: "p_date",
      key: "p_date",
      render: (text) => formatDate(text),
    },
    {
      title: "Next Review",
      dataIndex: "a_nextre",
      key: "a_nextre",
      render: (text) => nextreviewDate(text),
    },
  ];

  const today = formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = formatDate(tomorrow);

  const todayPatients = data?.filter(
    (item) => nextreviewDate(item.a_nextre) === today
  );

  const tomorrowPatients = data?.filter(
    (item) => nextreviewDate(item.a_nextre) === tomorrowDate
  );

  const dataCards = [
    {
      id: 1,
      title: "Overall Patients",
      count: data?.length || 0,
      icon: <FaUsers size={24} className="text-blue-500" />,
      color: "bg-blue-100 text-blue-700",
      bgf: "from-blue-100",
      bgt: "to-blue-300",
    },
    {
      id: 2,
      title: "Today Patients",
      count: todayPatients?.length || 0,
      icon: <IoToday size={24} className="text-green-500" />,
      color: "bg-green-100 text-green-700",
      bgf: "from-green-100",
      bgt: "to-green-300",
    },
    {
      id: 3,
      title: "Tomorrow Patients",
      count: tomorrowPatients?.length || 0,
      icon: <FaCalendar size={24} className="text-yellow-500" />,
      color: "bg-yellow-100 text-yellow-700",
      bgf: "from-yellow-100",
      bgt: "to-yellow-300",
    },
    {
      id: 4,
      title: "Next Review Count",
      count: filteredData?.length || 0,
      icon: <FaRecycle size={24} className="text-orange-500" />,
      color: "bg-orange-100 text-orange-700",
      bgf: "from-orange-100",
      bgt: "to-orange-300",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="my-4">
        <DashboardCard data={dataCards} />
      </div>

      {/* Date Filter */}
      <div className="flex items-center space-x-4 max-sm:space-x-0 mb-4 max-sm:flex-col max-sm:gap-4 max-sm:w-full">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="max-sm:w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={clearFilter}
          className="max-sm:w-full px-6 py-1 capitalize bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Clear Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-nowrap">
        <Table
          columns={[
            {
              title: "SNo", // Title of the serial number column
              key: "sno", // Unique key for the column
              render: (text, record, index) => {
                // Calculate serial number based on index and current page (if using pagination)
                return index + 1;
              },
              width: 60, // Optional: Adjust width of the SNo column as needed
            },
            ...columns, // Include your existing columns here
          ]}
          dataSource={filteredData}
          rowKey="p_vid"
          rowClassName={() => "bg-white"}
        />
      </div>
    </div>
  );
};

export default NextReviewTable;
