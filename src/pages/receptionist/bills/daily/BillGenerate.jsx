import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../../../utilities/AxiosInstance";
import { IoMdArrowRoundBack } from "react-icons/io";
import { message } from "antd";

export const BillGenerate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dailyBill, setDailyBill] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function getDailyBill() {
    try {
      const response = await AxiosInstance.get(
        `/dailybill/getdailybillbybillid/${id}`
      );
      setDailyBill(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(date);
  const generateBill = async () => {
    const payload = {
      db_vid: dailyBill?.db_vid,
      db_vdate: new Date().toISOString().split("T")[0],
      db_vpaymentmethod: paymentMethod,
      db_vreceby: user.u_vName,
      db_vpatient_id: dailyBill?.db_vpatient_id,
      db_vclinicid: user.u_vClinicId,
      db_vname: dailyBill?.db_vname,
      db_vphone: dailyBill?.db_vphone,
      db_iage: dailyBill?.db_iage,
      db_eegender: dailyBill?.db_eegender,
      db_taddress: dailyBill?.db_taddress,
      db_vtreatmetndoneby: dailyBill?.db_vtreatmetndoneby,
      db_damount: dailyBill?.db_damount,
      db_ddiscount: dailyBill?.db_ddiscount,
      db_dbalancetopay: dailyBill?.db_dbalancetopay,
    };
    console.log(payload);
    try {
      const response = await AxiosInstance.patch(
        `/dailybill/edit-dailybill`,
        payload
      );
      if (response.data.status === 200) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDailyBill();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="bg-[--navbar-bg-color] gap-3 flex-nowrap flex items-center justify-center px-4 hover:shadow-md p-2 hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 text-white rounded-md"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>
      <h1 className="text-2xl font-semibold underline underline-offset-2">
        Personal Information
      </h1>
      <div className="flex flex-col gap-4 text-lg py-4">
        <div className="flex justify-between flex-wrap">
          <div className="flex gap-2">
            <h1>Patient Name:</h1>
            <p className="capitalize">{dailyBill.db_vname}</p>
          </div>
          <div className="flex gap-2">
            <h1>Age:</h1>
            <p className="capitalize">{dailyBill.db_iage}</p>
          </div>
          <div className="flex gap-2">
            <h1>Gender:</h1>
            <p className="capitalize">{dailyBill.db_eegender}</p>
          </div>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="flex gap-2">
            <h1>Phone:</h1>
            <p className="capitalize">{dailyBill.db_vphone}</p>
          </div>
          <div className="flex gap-2">
            <h1>Address:</h1>
            <p className="capitalize">{dailyBill.db_taddress}</p>
          </div>
        </div>
      </div>
      <hr className="border border-gray-500 my-4" />

      {/* Payment Details */}
      <h1 className="text-2xl font-semibold underline underline-offset-2">
        Payment Details
      </h1>

      <div className="flex flex-col gap-4 text-lg py-4">
        <div className="flex justify-between flex-wrap">
          <div className="flex gap-2">
            <h1>Amount:</h1>
            <p className="capitalize">₹{dailyBill.db_damount}</p>
          </div>
          <div className="flex gap-2">
            <h1>Discount(%):</h1>
            <p className="capitalize">{Math.floor(dailyBill.db_ddiscount)}%</p>
          </div>
          <div className="flex gap-2">
            <h1>Balance To Pay:</h1>
            <p className="capitalize">₹{dailyBill.db_dbalancetopay}</p>
          </div>
        </div>
        <div className="flex justify-between flex-wrap">
          <div className="flex flex-nowrap gap-2">
            <h1 className="m-0 flex items-center justify-center">Date:</h1>
            <input
              className="w-full px-4 py-0 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              type="date"
              name="date"
              value={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />{" "}
          </div>
          <div className="flex flex-nowrap gap-2">
            <h1 className="m-0 flex items-center justify-center">
              Payment Method:
            </h1>
            <select
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-0 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              <option value="">Select</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <h1>Treatment Done by:</h1>
            <p className="capitalize">{dailyBill.db_vtreatmetndoneby}</p>
          </div>
          <div className="flex gap-2">
            <h1>Received by:</h1>
            <p>{user.u_vName}</p>
          </div>
        </div>

        <div>
          <button
            onClick={generateBill}
            className="bg-green-500 px-4 py-1 rounded-lg text-white hover:bg-green-600 duration-300"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};
