import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { message } from "antd";

function DailyBill() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;
  console.log(user);
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [treatmentBy, setTreatmentBy] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [hiddingButton, setHiddingButton] = useState(false);
  const [AmountTableData, setAmountTableData] = useState([]);
  const [formData, setFormData] = useState({
    db_damount: "",
    db_dbalancetopay: "",
    db_ddiscount: "",
    db_eegender: "",
    db_iage: "",
    db_paymentmethod: "",
    db_taddress: "",
    db_vclinicid: "",
    db_vdate: "",
    db_vid: "",
    db_vname: "",
    db_vpatient_id: "",
    db_vphone: "",
    db_vreceby: "",
    db_vtreatmetndoneby: "",
    db_vpaymentmethod: "",
  });

  useEffect(() => {
    if (singleData) {
      setFormData({
        db_damount: singleData.db_damount || "",
        db_dbalancetopay: singleData.db_dbalancetopay || "",
        db_ddiscount: singleData.db_ddiscount || "",
        db_eegender: singleData.db_eegender || "",
        db_iage: singleData.db_iage || "",
        db_paymentmethod: singleData.db_paymentmethod || "",
        db_taddress: singleData.db_taddress || "",
        db_vclinicid: singleData.db_vclinicid || "",
        db_vdate: singleData.db_vdate || "",
        db_vid: singleData.db_vid || "",
        db_vname: singleData.db_vname || "",
        db_vpatient_id: singleData.db_vpatient_id || "",
        db_vphone: singleData.db_vphone || "",
        db_vreceby: singleData.db_vreceby || "",
        db_vtreatmetndoneby: singleData.db_vtreatmetndoneby || "",
        db_vpaymentmethod: singleData.db_vpaymentmethod || "",
      });
    }
  }, [singleData]);

  console.log(singleData);
  const calculateFinalAmount = () => {
    const discountAmount = (amount * discount) / 100;
    return amount - discountAmount;
  };

  async function getPatientDetails() {
    try {
      const response = await AxiosInstance.get(`/patient/get-patient/${id}`);
      setPatientData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  }

  const getDailyBill = async () => {
    try {
      const response = await AxiosInstance.post(
        "/dailybill/getdailybillbypatientid",
        {
          db_vpatient_id: id,
        }
      );
      setAmountTableData(response?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = calculateFinalAmount();

    const payload = {
      db_vpatient_id: id,
      db_vdate: new Date().toISOString().split("T")[0],
      db_vclinicid: clinic_id,
      db_vname: patientData.p_vName,
      db_vphone: patientData.p_vPhone,
      db_iage: patientData.p_iAge,
      db_eegender: patientData.p_egender,
      db_taddress: patientData.p_tAddress,
      db_damount: amount,
      db_ddiscount: discount,
      db_vtreatmetndoneby: treatmentBy,
      db_dbalancetopay: finalAmount,
      db_vpaymentmethod: paymentMethod,
    };

    try {
      const response = await AxiosInstance.post(
        "/dailybill/add-dailybill",
        payload
      );
      if (response.data.status == 201) {
        message.success(response.data.message);
        getDailyBill();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Something went wrong, please try again later.");
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
    getDailyBill();
  }, []);

  const handleEdit = (rowData) => {
    console.log(rowData);
    setSingleData(rowData);
  };

  const handleUpdate = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/dailybill/edit-dailybill`,
        formData
      );
      message.success("Daily Bill Updated Successfully");
      setHiddingButton(false);
    } catch (error) {
      console.log(error);
      message.error("Something went wrong, please try again later.");
    }
    getDailyBill();
  };

  return (
    <div className="flex flex-col gap-5 min-h-screen bg-gray-100 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 w-fit bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Back
      </button>
      <h1 className="text-3xl font-semibold mb-4">Daily Bill</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full flex flex-row flex-wrap gap-5 max-md:justify-center"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount:
          </label>
          <input
            type="number"
            placeholder="Amount"
            value={amount === 0 ? "" : amount}
            onChange={(e) =>
              setAmount(e.target.value ? parseFloat(e.target.value) : 0)
            }
            className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Discount (%):
          </label>
          <input
            type="number"
            placeholder="Discount"
            max={100}
            value={discount === 0 ? "" : discount}
            onChange={(e) =>
              setDiscount(e.target.value ? parseFloat(e.target.value) : 0)
            }
            className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Treatment Done By:
          </label>
          <input
            type="text"
            placeholder="Treatment done by"
            value={treatmentBy}
            onChange={(e) => setTreatmentBy(e.target.value)}
            className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Treatment Done By:
          </label>
          <select
            value={treatmentBy}
            onChange={(e) => setTreatmentBy(e.target.value)}
            className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a doctor
            </option>
            <option value="Dr. Ramesh Babu">Dr. Ramesh Babu</option>
            <option value="Dr. Abirami">Dr. Abirami</option>
            <option value="Dr. Saranya">Dr. Saranya</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Balance to Pay:
          </label>
          <input
            type="number"
            placeholder="Balance to Pay"
            disabled
            value={calculateFinalAmount()}
            readOnly
            className="max-w-96 px-3 py-2 border rounded bg-gray-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Method:
          </label>
          <select
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        <div className="w-full flex">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>

      {hiddingButton && (
        <div className="w-full flex flex-col gap-5 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-row flex-wrap gap-5">
            <div>
              <label htmlFor="">Amount</label>
              <input
                type="number"
                value={singleData?.db_damount}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 0;
                  const discount = parseFloat(singleData?.db_ddiscount) || 0;
                  const discountAmount = (amount * discount) / 100;
                  const balanceToPay = amount - discountAmount;

                  setSingleData({
                    ...formData,
                    db_damount: e.target.value,
                    db_dbalancetopay: balanceToPay.toFixed(2),
                  });
                }}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="">Discount (%)</label>
              <input
                type="number"
                value={singleData?.db_ddiscount}
                onChange={(e) => {
                  const discountValue = parseFloat(e.target.value) || 0;
                  const amount = parseFloat(singleData?.db_damount) || 0;
                  const discountAmount = (amount * discountValue) / 100;
                  const balanceToPay = amount - discountAmount;

                  setSingleData({
                    ...formData,
                    db_ddiscount: discountValue,
                    db_dbalancetopay: balanceToPay.toFixed(2),
                  });
                }}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="">Treatment Done By</label>
              <input
                type="text"
                value={singleData?.db_vtreatmetndoneby}
                onChange={(e) =>
                  setSingleData({
                    ...formData,
                    db_vtreatmetndoneby: e.target.value,
                  })
                }
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="">Balance to Pay</label>
              <input
                type="number"
                value={singleData?.db_dbalancetopay}
                disabled
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>
          <div className="flex flex-row gap-5">
            <button
              onClick={() => {
                handleUpdate();
              }}
              className="bg-green-500 w-fit hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
            <button
              onClick={() => setHiddingButton(false)}
              className="bg-blue-500 w-fit hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full shadow-md rounded-md text-nowrap">
        <table className="text-center w-full">
          <thead className="">
            <tr className="bg-[--navbar-bg-color] text-white">
              <th className="p-2 rounded-tl-md">S No</th>
              <th className="p-2 ">Amount</th>
              <th className="p-2 ">Discount</th>
              <th className="p-2 ">Treatment Done By</th>
              <th className="p-2 ">Payment Method</th>
              <th className="p-2">Balance to pay</th>
              {user?.u_eRole == "receptionist" ? (
                ""
              ) : (
                <th className="p-2 rounded-tr-md">Action</th>
              )}
              {/* <th className="p-2">Generate Bill</th> */}
            </tr>
          </thead>
          <tbody>
            {AmountTableData?.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  {item.db_damount.toString().split(".")[0]}
                </td>
                <td className="p-2">
                  {item.db_ddiscount.toString().split(".")[0]}%
                </td>
                <td className="p-2">{item.db_vtreatmetndoneby}</td>
                <td className="p-2 uppercase">{item.db_vpaymentmethod}</td>
                <td className="p-2">
                  {item.db_dbalancetopay.toString().split(".")[0]}
                </td>
                {user?.u_eRole == "receptionist" ? (
                  ""
                ) : (
                  <td className="p-2">
                    <button
                      onClick={() => {
                        handleEdit(item);
                        setHiddingButton(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Edit
                    </button>
                  </td>
                )}
                {/* <td className="p-2">
                  <button
                    onClick={() => {
                      handleGenerate(item);
                      setHiddingButton(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Generate
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyBill;
