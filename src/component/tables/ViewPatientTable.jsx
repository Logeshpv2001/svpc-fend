import React, { useEffect, useState } from "react";
import { IoSearchOutline, IoToday } from "react-icons/io5";
import { Link } from "react-router-dom";
import DashboardCard from "../cards/DashboardCard";
import { FaBookMedical, FaCalendarDay, FaUsers } from "react-icons/fa";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useSelector } from "react-redux";

const ViewPatientTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [overallCount, setoverallCount] = useState(0);
  const [todayCount, settodayCount] = useState(0);
  const [tomorrowCount, setTomorrowCount] = useState(0);
  const [patientsData, setPatientsData] = useState([]);
  const appointmentCount = useSelector((state) => state.appointments.count);

  const [filterData, setFilterData] = useState({});

  // const appointment = useSelector((state) => state.appointments);
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
        const overallCount = data.length;
        const todayCount = data.filter(
          (patient) => formatDate(patient.p_date) === todayDate
        ).length;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = formatDate(tomorrow);
        const tomorrowCount = data.filter(
          (patient) => formatDate(patient.p_date) === tomorrowDate
        ).length;

        //overall male and female
        const overAllMale = data.filter((item) => item.p_egender === "male");
        const overAllFemale = data.filter(
          (item) => item.p_egender === "female"
        );

        //today male and female
        const todayMale = data.filter(
          (patient) =>
            formatDate(patient.p_date) === todayDate &&
            patient.p_egender === "male"
        );
        const todayFemale = data.filter(
          (patient) =>
            formatDate(patient.p_date) === todayDate &&
            patient.p_egender === "female"
        );
        //tomorrow male and female
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowMale = data.filter(
          (patient) =>
            formatDate(patient.p_date) === tomorrowDate &&
            patient.p_egender === "male"
        );
        const tomorrowFemale = data.filter(
          (patient) =>
            formatDate(patient.p_date) === tomorrowDate &&
            patient.p_egender === "female"
        );

        setFilterData({
          overallMale: overAllMale.length,
          overallFemale: overAllFemale.length,
          todayMale: todayMale.length,
          todayFemale: todayFemale.length,
          tomorrowMale: tomorrowMale.length,
          tomorrowFemale: tomorrowFemale.length,
        });
        setoverallCount(overallCount);
        settodayCount(todayCount);
        setTomorrowCount(tomorrowCount);
      } catch (error) {
        console.log(error);
      }
    };

    getAllPatients();
  }, []);

  // Filter and search logic
  const filteredData = patientsData?.filter((patient) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const patientDate = new Date(patient.p_date);

    const isSameDate = (date1, date2) =>
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();

    const isToday = isSameDate(patientDate, today);
    const isTomorrow = isSameDate(patientDate, tomorrow);

    // Match the active tab for filtering by date
    const matchesDate =
      activeTab === "all" ||
      (activeTab === "today" && isToday) ||
      (activeTab === "tomorrow" && isTomorrow);

    // Search across multiple fields
    const matchesSearch = searchTerm
      ? ["p_vName", "p_vPhone", "p_vid", "p_egender", "p_epatient_type"].some(
          (field) =>
            patient[field]
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : true;

    // Match gender filter
    const matchesGender = !filterGender || patient.p_egender === filterGender;

    return matchesSearch && matchesGender && matchesDate;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData?.length / pageSize);

  // Paginate the data
  const currentPageData = filteredData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Date function
  const todayDate = new Date().toISOString().split("T")[0];
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const data = [
    {
      id: 1,
      title: "Overall Patients",
      icon: <FaUsers size={24} className="text-blue-500" />,
      color: "bg-blue-100 text-blue-700",
      count: overallCount,
      male: filterData.overallMale,
      female: filterData.overallFemale,
      bgf: "from-blue-300",
      bgt: "to-blue-100",
    },
    {
      id: 2,
      title: "Today Patients",
      icon: <IoToday size={24} className="text-green-500" />,
      color: "bg-green-100 text-green-700",
      count: todayCount,
      male: filterData.todayMale,
      female: filterData.todayFemale,
      bgf: "from-green-300",
      bgt: "to-green-100",
    },
    {
      id: 3,
      title: "Tomorrow Patients",
      icon: <FaCalendarDay size={24} className="text-orange-500" />,
      color: "bg-orange-100 text-orange-700",
      count: tomorrowCount,
      male: filterData.tomorrowMale,
      female: filterData.tomorrowFemale,
      bgf: "from-orange-300",
      bgt: "to-orange-100",
    },
    {
      id: 4,
      title: "Appointments",
      icon: <FaBookMedical size={24} className="text-yellow-500" />,
      color: "bg-yellow-100 text-yellow-700",
      count: appointmentCount,
      bgf: "from-yellow-300",
      bgt: "to-yellow-100",
    },
  ];

  return (
    <>
      <DashboardCard data={data} allData={patientsData} />
      <div className="overflow-x-auto">
        {/* Filters */}
        <div className="flex justify-between max-lg:flex-col max-lg:gap-4 items-center mt-4 pb-5">
          <div className="flex max-md:flex-col max-lg:flex-row max-lg:w-full md:flex-wrap max-md:w-fit items-center gap-4">
            <div className="flex items-center gap-2 bg-white pr-0 relative rounded-lg">
              <input
                type="text"
                className="w-44 max-sm:w-full px-4 py-2 outline-none rounded-lg shadow-md"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearchOutline className="absolute right-2" />
            </div>
            <select
              className="px-4 py-2 max-sm:w-full min-w-44 border rounded-lg shadow-md"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="">Filter by Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              className="px-4 py-2 max-sm:w-full min-w-44 border rounded-lg shadow-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">All Patients</option>
              <option value="today">Today's Patients</option>
              <option value="tomorrow">Tomorrow's Patients</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full p-1">
          <table className="min-w-full text-nowrap text-center border-collapse table-auto border border-gray-300 rounded-md overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr className="border-b bg-[--navbar-bg-color] text-white text-lg">
                <th className="py-3 px-4 font-medium">S.No</th>
                <th className="py-3 px-4 font-medium">Patient ID</th>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Phone Number</th>
                <th className="py-3 px-4 font-medium">Gender</th>
                <th className="py-3 px-4 font-medium">View Assessment</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData?.map((patient, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 border-b font-semibold text-lg capitalize"
                >
                  <td className="py-3 px-4 ">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-3 px-4  text-gray-700">{patient.p_vid}</td>
                  <td className="py-3 px-4  text-gray-700">
                    {patient.p_vName}
                  </td>
                  <td className="py-3 px-4  text-gray-700">
                    {patient.p_vPhone}
                  </td>
                  <td className="py-3 px-4  text-gray-700">
                    {patient.p_egender}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Link
                      to={`/patient-details/${patient.p_vid}`}
                      title="View this patient's medical assessment records"
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition duration-200 ease-in-out text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPatientTable;
