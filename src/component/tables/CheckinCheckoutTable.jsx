import React, { useEffect, useState } from "react";
import { Button, Input, message, Modal, TimePicker } from "antd";
import "antd/dist/reset.css";
import AxiosInstance from "../../utilities/AxiosInstance";
import moment from "moment";
import { MdOutlineDoneOutline } from "react-icons/md";

const CheckinCheckoutTable = () => {
  const [patientData, setPatientData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState({});
  const [checkinTimes, setCheckinTimes] = useState({});
  const [checkoutVisible, setCheckoutVisible] = useState(false); // Modal visibility
  const [checkoutTime, setCheckoutTime] = useState(null); // TimePicker value
  const [selectedPatient, setSelectedPatient] = useState(null); // Store selected patient for checkout
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;
  const userName = user.u_vName;

  const getPatientDetails = async () => {
    try {
      const res = await AxiosInstance.post("/patient/get-patientByClinicId", {
        id: clinic_id,
      });
      setPatientData(res.data.response);
      console.log(patientData);

      // Initialize dates with today's date for each patient
      const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const initialDates = res.data.response.reduce((acc, record) => {
        acc[record.p_vid] = todayDate; // Set today's date for each patient
        return acc;
      }, {});
      setDates(initialDates); // Set the dates state with today's date for all patients
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter the data based on search text
  const filteredData = patientData?.filter(
    (record) =>
      record.p_vid?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.p_vName?.toLowerCase().includes(searchText.toLowerCase()) ||
      record.p_vPhone?.toLowerCase().includes(searchText.toLowerCase())
  );
  console.log(filteredData, "filteredData");
  const handleCheckin = async (record) => {
    console.log(record, "rec");

    try {
      const checkinTime = new Date();
      const formattedTime = checkinTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setCheckinTimes((prevTimes) => ({
        ...prevTimes,
        [record.p_vid]: formattedTime,
      }));

      const payload = {
        cs_vpatient_id: record.p_vid,
        cs_vclinicid: clinic_id,
        cs_vname: record.p_vName,
        cs_vphone: record.p_vPhone,
        cs_vcensusdate: dates[record.p_vid],
        cs_vcheckintime: formattedTime,
        cs_vgender: record.p_egender,
        cs_jservicefor: record.p_jservice,
        cs_vptchkinname: userName,
        cs_vpattype: record.p_vpattype,

        // cs_voldnew: handleOldNew(),
      };

      console.log(payload, "payload");

      try {
        const response = await AxiosInstance.post(
          "/census/add-census",
          payload
        );
        if (response.data.status === 201) {
          message.success("Patient checked in successfully");
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Error during check-in");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (e, patientId) => {
    setDates((prevDates) => ({
      ...prevDates,
      [patientId]: e.target.value,
    }));
  };

  const handleCheckoutClick = (record) => {
    setSelectedPatient(record);
    setCheckoutVisible(true);
  };

  const handleCheckoutTimeChange = (time) => {
    setCheckoutTime(time);
  };

  const handleCheckoutConfirm = async (record) => {
    console.log(record, "rec");

    // const formattedCheckoutTime = checkoutTime.format("hh:mm A");
    console.log(dates[selectedPatient?.p_vid], "test");

    const payload = {
      cs_vpatient_id: record.p_vid,
      cs_vclinicid: clinic_id,
      cs_vcensusdate:
        dates[selectedPatient?.p_vid] || new Date().toISOString().split("T")[0],
      cs_checkouttime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      cs_vptchkoutname: userName,
    };

    try {
      const response = await AxiosInstance.patch(
        "/census/edit-census",
        payload
      );

      if (response.data.message === "Census record updated successfully") {
        message.success("Patient checked out successfully");
        setCheckoutVisible(false);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error checking out patient");
      console.log(error);
    }
  };

  const handleCheckoutCancel = () => {
    setCheckoutVisible(false);
  };

  // const handleOldNew = () => {
  //   return 0;
  // };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search by ID, Name, or Phone"
          value={searchText}
          onChange={handleSearch}
          className="w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto text-nowrap">
        <table className="w-full overflow-scroll border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap">
                S. No
              </th>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap">
                Patient ID
              </th>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap">
                Phone
              </th>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap hidden sm:table-cell">
                Check In
              </th>
              <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left whitespace-nowrap hidden sm:table-cell">
                Check Out
              </th>

              {/* <th className="px-4 py-2 bg-[--navbar-bg-color] text-white text-left ">
                Old / New
              </th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((record, index) => (
              <tr key={record.p_vid} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap">{record.p_vid}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {record.p_vName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {record.p_vPhone}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="date"
                    name="date"
                    value={
                      dates[record.p_vid] ||
                      new Date().toISOString().split("T")[0]
                    } // Default to today's date if not set
                    onChange={(e) => handleDateChange(e, record.p_vid)} // Change date only for the current patient
                    className="px-2 py-1 w-full border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 hidden sm:table-cell">
                  <Button
                    className="w-full bg-green-500 text-white hover:bg-green-400"
                    onClick={() => handleCheckin(record)}
                  >
                    Check In
                  </Button>
                </td>
                <td className="px-4 py-2 hidden sm:table-cell">
                  <Button
                    className="w-full bg-red-500 text-white hover:bg-red-400"
                    onClick={() => handleCheckoutConfirm(record)} // Open checkout modal
                  >
                    Check Out
                  </Button>
                </td>

                {/* <td className="flex justify-center cursor-pointer">
                  <button onClick={handleOldNew}>
                    <MdOutlineDoneOutline
                      size={30}
                      className="mt-2 bg-gray-500 text-gray-100 p-1 rounded"
                    />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Checkout Modal */}
      <Modal
        title="Select Checkout Time"
        open={checkoutVisible}
        onCancel={handleCheckoutCancel}
        onOk={handleCheckoutConfirm}
      >
        <TimePicker
          format="hh:mm A"
          use12Hours
          value={checkoutTime}
          onChange={handleCheckoutTimeChange}
          className="w-full"
        />
      </Modal>
    </div>
  );
};

export default CheckinCheckoutTable;
