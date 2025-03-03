import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import AppointmentForm from "../forms/AppointmentForm";
import { useLocation } from "react-router-dom";
import AxiosInstance from "../../utilities/AxiosInstance";
import { FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addAppointment } from "../../redux/slices/appointmentSlice";

const BookedAppointmentTable = () => {
  const dispatch = useDispatch();
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [AppointmentData, setAppointmentData] = useState([]);
  const [appionmentDate, setAppointmentDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  console.log(AppointmentData, "appointmentData");

  const [editData, setEditData] = useState(null); // New state for edit data
  const location = useLocation();

  const getAppointment = async () => {
    try {
      const response = await AxiosInstance.get(
        `/appointment/get-appointmentsby-clinicid/${userInfo.u_vClinicId}`
      );
      const appointmentData = response.data.response || [];
      setAppointmentData(appointmentData);
      dispatch(addAppointment(appointmentData));
    } catch (error) {
      console.log(error);
    }
  };

  // Filter data based on search query and selected date
  const filteredData = AppointmentData?.filter((record) => {
    const recordDate = new Date(record.ap_vdate);
    const selectedDate = appionmentDate ? new Date(appionmentDate) : null;

    // Check if the record matches the selected date
    const isDateMatch =
      !selectedDate ||
      recordDate.toDateString() === selectedDate.toDateString();

    // Check if the record matches the search query
    const isSearchMatch =
      record.ap_vname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ap_vphone.includes(searchQuery);

    return isDateMatch && isSearchMatch;
  });

  const handleClear = () => {
    setSearchQuery("");
    setAppointmentDate("");
  };
  console.log(filteredData, "filteredData");
  useEffect(() => {
    getAppointment();
  }, []);

  const formattedDate = (dateString) => {
    const [date] = dateString.split("T");
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleAction = (action, rowData) => {
    if (action === "edit") {
      setEditData(rowData);
      setIsModalVisible(true);
    } else if (action === "delete") {
      console.log("Delete functionality here");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null); // Reset edit data on cancel
  };

  return (
    <div>
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
          value={appionmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
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
      <div className="flex justify-end">
        {location.pathname !== "/physio/booked-appointment" && (
          <button
            className="text-white bg-blue-500 rounded-md px-2 py-1"
            onClick={() => setIsModalVisible(true)}
          >
            Book a New Appointment
          </button>
        )}
      </div>
      <div>
        <table className="min-w-full border-collapse table-auto mt-4">
          <thead>
            <tr>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                S.No
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Patient Name
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Address
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Mobile
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Date
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Time
              </th>

              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Complaint
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                For
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Scheduled By
              </th>
              <th className="bg-[--navbar-bg-color] text-white border p-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((appointment, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{appointment.ap_vname}</td>
                  <td className="border p-2">{appointment.ap_taddress}</td>
                  <td className="border p-2">{appointment.ap_vphone}</td>
                  <td className="border p-2">
                    {formattedDate(appointment.ap_vdate)}
                  </td>
                  <td className="border p-2">{appointment.ap_viaptime}</td>
                  <td className="border p-2">{appointment.ap_tcomplaints}</td>
                  <td className="border p-2">{appointment.ap_japfor}</td>
                  <td className="border p-2">{appointment.ap_vscheduled}</td>
                  <td className="border p-2 ">
                    <button
                      className="text-blue-500"
                      onClick={() => handleAction("edit", appointment)}
                    >
                      <FaEdit size={20} />
                    </button>
                    {/* <button
                    className="text-red-500"
                    onClick={() => handleAction("delete", appointment)}
                  >
                    <MdDelete size={20} />
                  </button> */}
                  </td>
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

      <Modal
        title={editData ? "Edit Appointment" : "Book a New Appointment"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AppointmentForm
          getAppointment={getAppointment}
          setIsModalVisible={setIsModalVisible}
          handleCancel={handleCancel}
          editData={editData}
          key={editData?.ap_vid || Date.now()}
        />
      </Modal>
    </div>
  );
};

export default BookedAppointmentTable;
