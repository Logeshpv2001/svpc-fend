import React, { useEffect, useState } from "react";
import { message, TimePicker } from "antd";
import moment from "moment";
import AxiosInstance from "../../utilities/AxiosInstance";
import { Icon } from "@iconify/react";

const doctors = ["Dr. Ramesh Babu", "Dr. Abirami", "Dr. Saranya"];

const AppointmentForm = ({ handleCancel, getAppointment, editData }) => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [iconChanger, setIconChanger] = useState(false);
  const initialFormData = {
    ap_vname: "",
    ap_taddress: "",
    ap_vphone: "",
    ap_viaptime: "",
    ap_tcomplaints: "",
    ap_japfor: "",
    ap_vscheduled: userInfo?.u_vName || "",
    ap_vdate: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Populate form data if editData exists
  useEffect(() => {
    if (editData) {
      setFormData((prev) => ({
        ...prev,
        ...editData,
        ap_viaptime: editData.ap_viaptime,
        ap_vdate: formattedDate(editData.ap_vdate),
      }));
    }
  }, [editData]);

  // Handle input, textarea, and select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    let newValue = value;
  
    if (name === "ap_vphone") {
      // Ensure +91 is always present
      if (!newValue.startsWith("+91")) {
        newValue = "+91" + newValue.replace(/^\+91/, ""); // Avoid duplicate +91
      }
    }
  
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  

  // Handle time picker changes
  const handleTimeChange = (time, timeString) => {
    setFormData({
      ...formData,
      ap_viaptime: timeString,
    });
  };

  // Handle date input changes
  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      ap_vdate: e.target.value, // Date input provides value in YYYY-MM-DD
    });
  };

  // Date Formatting functions
  function formattedDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ap_vclinicid: userInfo?.u_vClinicId,
      ap_vid: formData?.ap_vid,
      ap_vname: formData?.ap_vname,
      ap_vphone: formData?.ap_vphone,
      ap_taddress: formData?.ap_taddress,
      ap_viaptime: formData?.ap_viaptime,
      ap_japfor: formData?.ap_japfor,
      ap_tcomplaints: formData?.ap_tcomplaints,
      ap_vscheduled: formData?.ap_vscheduled,
      ap_vdate: formattedDate(formData?.ap_vdate),
    };

    try {
      const url = editData
        ? `/appointment/edit-appointment/${editData.ap_vid}`
        : "/appointment/add-appointment";

      const method = editData ? "patch" : "post";

      const response = await AxiosInstance[method](
        url,
        method === "patch"
          ? payload
          : {
              ap_vclinicid: userInfo?.u_vClinicId,
              ...formData,
            }
      );

      if (
        response.data.status === 201 ||
        response.data.status === 200 ||
        response.data.message === "Appointment updated successfully"
      ) {
        message.success(response.data.message || "Operation successful");
        getAppointment();
        handleCancel();
      } else {
        message.error(response.data.message || "Please try again later.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const handleCheckMobileNumber = async (e) => {
    console.log(e.target.value);

    try {
      const response = await AxiosInstance.get(
        `patient/get-patient-by-phone/${formData?.ap_vphone}`
      );
      if (response.data.status === 404) {
        setIconChanger(true);
        message.error(response.data.message);
      } else {
        setIconChanger(false);
        setFormData({
          ...formData,
          ap_vclinicid: response.data.response.p_vclinicid,
          ap_vname: response.data.response.p_vName,
          ap_vphone: response.data.response.p_vPhone,
          ap_taddress: response.data.response.p_tAddress,
          ap_vdate: formData?.ap_vdate || formattedDate(new Date().toISOString().split("T")[0]),
        });
        message.success(response.data.message);
      }

      console.log(response, "mob response");
    } catch (error) {
      console.log(error);
      setIconChanger(true);
    }
  };

  const handleCancelClick = () => {
    setFormData(initialFormData);
    setIconChanger(false);
    handleCancel();
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700">
              Patient Name:
            </label>
            <input
              type="text"
              name="ap_vname"
              value={formData.ap_vname}
              onChange={handleChange}
              className="w-full px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700">
              Mobile Number:
            </label>
            <div className="flex flex-row items-center justify-center gap-2">
              <input
                type="text"
                name="ap_vphone"
                value={formData.ap_vphone}
                onChange={handleChange}
                className="w-full px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button className="h-8 w-8 flex items-center justify-center">
                {!iconChanger ? (
                  <Icon
                    className="items-center justify-center text-center"
                    onClick={handleCheckMobileNumber}
                    icon="tabler:circle-dashed-check"
                    width="26"
                    height="26"
                  />
                ) : (
                  <Icon
                    onClick={() => {
                      setFormData({ ...formData, ap_vphone: "" });
                      setIconChanger(false);
                    }}
                    icon="tabler:refresh"
                    width="24"
                    height="24"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Address:
          </label>
          <textarea
            name="ap_taddress"
            value={formData.ap_taddress}
            onChange={handleChange}
            className="w-full resize-none px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700">
              Appointment Time:
            </label>
            <TimePicker
              value={
                formData.ap_viaptime
                  ? moment(formData.ap_viaptime, "hh:mm A")
                  : null
              }
              onChange={handleTimeChange}
              format="hh:mm A"
              className="w-full"
              required
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700">
              Appointment Date:
            </label>
            <input
              name="ap_vdate"
              type="date"
              value={
                formData.ap_vdate || new Date().toISOString().split("T")[0]
              }
              onChange={handleDateChange}
              className="w-full px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className=" text-sm font-semibold text-gray-700">
            Appointment For:
          </label>
          <select
            name="ap_japfor"
            value={formData.ap_japfor}
            onChange={handleChange}
            className="w-full px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Chief Complaints:
          </label>
          <input
            type="text"
            name="ap_tcomplaints"
            value={formData.ap_tcomplaints}
            onChange={handleChange}
            className="w-full px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Scheduled By:
          </label>
          <input
            type="text"
            name="ap_vscheduled"
            value={formData.ap_vscheduled}
            disabled
            className="w-full cursor-not-allowed px-2 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            {editData ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;