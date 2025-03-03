import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { message } from "antd";
function PackageBill() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("user", user);
  const [patientData, setPatientData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [packageBillData, setPackageBillData] = useState();
  const [formData, setFormData] = useState({
    pb_vpatient_id: patientData?.p_vid,
    pb_vclinicid: user.u_vClinicId,
    pb_vname: patientData?.p_vName,
    pb_vphone: patientData?.p_vPhone,
    pb_iage: patientData?.p_iAge,
    pb_eegender: patientData?.p_egender,
    pb_taddress: patientData?.p_tAddress,
    pb_vdate: new Date().toISOString().split("T")[0],
    pb_damt: 0,
    pb_vwhobuyed: user.u_vName,
    pb_epaymethod: "",
    pb_ddis: 0,
    pb_inoofsit: 0,
    pb_dtodaypay: 0,
    pb_drefereceamt: 0,
    pb_dbaltopay: 0,
  });

  const [editFormData, setEditFormData] = useState({});

  async function getPackageBillPatient() {
    try {
      const response = await AxiosInstance.post(
        `/packagebill/get-packagebillbypatientid`,
        {
          pb_vpatient_id: id,
        }
      );
      const data = response?.data?.response;
      setPackageBillData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  }

  async function getPatientDetails() {
    try {
      const response = await AxiosInstance.get(`/patient/get-patient/${id}`);
      const data = response?.data?.response;
      setPatientData(response.data.response);
      setFormData((prev) => ({
        ...prev,
        pb_vpatient_id: data?.p_vid,
        pb_vname: data?.p_vName,
        pb_vphone: data?.p_vPhone,
        pb_iage: data?.p_iAge,
        pb_eegender: data?.p_egender,
        pb_taddress: data?.p_tAddress,
      }));
    } catch (error) {
      console.log(error);
    }
  }
  const handlePost = async () => {
    console.log("formData", formData);
    try {
      const response = await AxiosInstance.post(
        `/packagebill/add-packagebill`,
        formData
      );
      message.success("Package Bill Added Successfully");
      getPackageBillPatient();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/packagebill/edit-packagebill`,
        editFormData
      );
      message.success("Package Bill Updated Successfully");
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientDetails();
    getPackageBillPatient();
  }, []);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateFinalAmount = () => {
    const packageAmountElement = document.getElementById("packageAmount");
    const amount = parseFloat(packageAmountElement?.value) || 0;
    const discountElement = document.getElementById("discount");
    const discount = parseFloat(discountElement?.value) || 0;
    const todayPaymentElement = document.getElementById("todayPayment");
    const todayPayment = parseFloat(todayPaymentElement?.value) || 0;

    const discountAmount = (amount * discount) / 100;
    const discountBalance = amount - discountAmount;
    const finalAmount = amount - discountAmount - todayPayment;

    setFormData((prev) => ({
      ...prev,
      pb_drefereceamt: discountBalance,
    }));

    const balanceToPayElement = document.getElementById("balanceToPay");
    if (balanceToPayElement) {
      balanceToPayElement.value = finalAmount;
    }

    return finalAmount;
  };
  console.log("packageBillData", packageBillData);

  const handleEditButton = (row) => {
    setIsEdit(true);
    setSelectedRow(row);
    setEditFormData(row);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 w-fit bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Back
      </button>
      <h1 className="text-3xl font-semibold mb-4">Package Bill</h1>
      <div className="bg-white p-8 rounded-lg shadow-md mb-3 w-full flex flex-row flex-wrap gap-5 max-md:justify-center">
        <div className="mb-4 flex flex-row flex-wrap gap-5 max-md:justify-center">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Package Amount:
            </label>
            <input
              id="packageAmount"
              type="number"
              placeholder="Amount"
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const amount = parseFloat(e.target.value) || 0;
                setFormData({
                  ...formData,
                  pb_damt: amount,
                });
                const finalAmount = calculateFinalAmount();
                setFormData((prev) => ({
                  ...prev,
                  pb_dbaltopay: finalAmount,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date:
            </label>
            <input
              type="date"
              value={formData.pb_vdate}
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const date = new Date(e.target.value)
                  .toISOString()
                  .split("T")[0];
                setFormData({
                  ...formData,
                  pb_vdate: date,
                });
              }}
            />{" "}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              No of Sittings:
            </label>
            <input
              id="noOfSittings"
              type="number"
              placeholder="No of Sittings"
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const noOfSittings = parseFloat(e.target.value) || 0;
                setFormData({
                  ...formData,
                  pb_inoofsit: noOfSittings,
                });
                const finalAmount = calculateFinalAmount();
                setFormData((prev) => ({
                  ...prev,
                  pb_dbaltopay: finalAmount,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Today Payment:
            </label>
            <input
              type="number"
              id="todayPayment"
              placeholder="TodayPayment"
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const todayPayment = parseFloat(e.target.value) || 0;
                setFormData({
                  ...formData,
                  pb_dtodaypay: todayPayment,
                });
                const finalAmount = calculateFinalAmount();
                setFormData((prev) => ({
                  ...prev,
                  pb_dbaltopay: finalAmount,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Discount (%):
            </label>
            <input
              id="discount"
              type="number"
              placeholder="Discount"
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const discount = parseFloat(e.target.value) || 0;
                setFormData({
                  ...formData,
                  pb_ddis: discount,
                });
                const finalAmount = calculateFinalAmount();
                setFormData((prev) => ({
                  ...prev,
                  pb_dbaltopay: finalAmount,
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payment Method:
            </label>
            <select
              onChange={(e) => {
                setFormData({
                  ...formData,
                  pb_epaymethod: e.target.value,
                });
              }}
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Received By:
            </label>
            <input
              type="text"
              placeholder="Received By"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  pb_rby: e.target.value,
                });
              }}
              className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Discount Amount:
            </label>
            <input
              value={formData.pb_drefereceamt}
              readOnly
              disabled
              className="max-w-96 px-3 py-2 border rounded bg-gray-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Balance to Pay:
            </label>
            <input
              id="balanceToPay"
              type="number"
              placeholder="Balance to Pay"
              readOnly
              className="max-w-96 px-3 py-2 border rounded bg-gray-50"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handlePost}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </div>

      <div className={`${!isEdit ? "hidden" : "flex"}`}>
        <div className="p-4 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Package Bill Edit
          </h1>
          <div className="mb-4 flex flex-row flex-wrap gap-5 max-md:justify-center">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Package Amount:
              </label>
              <input
                id="packageAmount"
                type="number"
                placeholder="Amount"
                value={editFormData?.pb_damt}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 0;
                  const todayPayment = editFormData.pb_dtodaypay || 0;
                  const discount = editFormData.pb_ddis || 0;
                  const discountAmount = (amount * discount) / 100;
                  const discountBalance = amount - discountAmount;
                  const balanceToPay = amount - discountAmount - todayPayment;

                  setEditFormData({
                    ...editFormData,
                    pb_damt: amount,
                    pb_dbaltopay: balanceToPay,
                    pb_drefereceamt: discountBalance,
                  });
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input
                type="date"
                value={editFormData.pb_vdate}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const date = e.target.value;
                  setEditFormData({
                    ...editFormData,
                    pb_vdate: date,
                  });
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                No of Sittings:
              </label>
              <input
                id="noOfSittings"
                type="number"
                placeholder="No of Sittings"
                value={editFormData.pb_inoofsit}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const noOfSittings = parseFloat(e.target.value) || 0;
                  setEditFormData({
                    ...editFormData,
                    pb_inoofsit: noOfSittings,
                  });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Today Payment:
              </label>
              <input
                type="number"
                id="todayPayment"
                placeholder="TodayPayment"
                value={editFormData.pb_dtodaypay}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const todayPayment = parseFloat(e.target.value) || 0;
                  const amount = editFormData.pb_damt || 0;
                  const discount = editFormData.pb_ddis || 0;
                  const discountAmount = (amount * discount) / 100;
                  const balanceToPay = amount - discountAmount - todayPayment;

                  setEditFormData({
                    ...editFormData,
                    pb_dtodaypay: todayPayment,
                    pb_dbaltopay: balanceToPay,
                  });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Discount (%):
              </label>
              <input
                id="discount"
                type="number"
                placeholder="Discount"
                value={editFormData.pb_ddis}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0;
                  const amount = editFormData.pb_damt || 0;
                  const todayPayment = editFormData.pb_dtodaypay || 0;
                  const discountAmount = (amount * discount) / 100;
                  const discountBalance = amount - discountAmount;
                  const balanceToPay = amount - discountAmount - todayPayment;

                  setEditFormData({
                    ...editFormData,
                    pb_ddis: discount,
                    pb_dbaltopay: balanceToPay,
                    pb_drefereceamt: discountBalance,
                  });
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Discount Amount:
              </label>
              <input
                type="number"
                value={editFormData.pb_drefereceamt || 0}
                readOnly
                className="max-w-96 px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Method:
              </label>
              <select
                value={
                  editFormData.pb_epaymethod === "CARD"
                    ? "card"
                    : editFormData.pb_epaymethod === "CASH"
                    ? "Cash"
                    : "upi"
                }
                onChange={(e) => {
                  setEditFormData({
                    ...editFormData,
                    pb_epaymethod: e.target.value,
                  });
                }}
                className="max-w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Balance to Pay:
              </label>
              <input
                id="balanceToPay"
                type="number"
                placeholder="Balance to Pay"
                value={editFormData.pb_dbaltopay}
                readOnly
                className="max-w-96 px-3 py-2 border rounded bg-gray-50"
              />
            </div>
          </div>{" "}
          <div className="flex justify-end">
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              onClick={() => setIsEdit(false)}
            >
              Cancel
            </button>
          </div>
        </div>{" "}
      </div>

      <div className="mt-3 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Package Bill History
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg text-center text-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b border-r text-sm font-semibold text-gray-700">
                  S.No
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  No of Sittings
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Today Payment
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Discount
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Discount Amount
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Payment Method
                </th>
                {/* <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Received By
                </th> */}
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Balance to Pay
                </th>
                <th className="py-3 px-4 border-b  text-sm font-semibold text-gray-700">
                  Date
                </th>
                {user.u_eRole == "receptionist" ? (
                  ""
                ) : (
                  <th className="py-3 px-4 border-b border-l  text-sm font-semibold text-gray-700">
                    Action
                  </th>
                )}
                <th className="py-3 px-4 border-b border-l  text-sm font-semibold text-gray-700">
                  Sittings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packageBillData?.reverse().map((item, index) => {
                console.log("item", item);
                const perSittingCost =
                  parseFloat(item.pb_drefereceamt) / item.pb_inoofsit; // Per sitting cost
                const expectedPaidAmount =
                  item.pb_iattendedsittings * perSittingCost; // Payment for attended sittings
                const actualPaidAmount =
                  parseFloat(item.pb_drefereceamt) -
                  parseFloat(item.pb_dbaltopay); // Actual amount paid

                // Determine if the payment matches expectations
                const isPaymentCorrect = actualPaidAmount >= expectedPaidAmount;
                const isOverpaid = actualPaidAmount > expectedPaidAmount; // Check if overpaid
                // Row styling based on payment correctness

                const rowClass =
                  parseFloat(item.pb_dbaltopay) === 0.0
                    ? "" // No color if balance to pay is zero
                    : isOverpaid
                    ? "bg-yellow-500" // Overpaid
                    : isPaymentCorrect
                    ? "bg-green-500" // Payment correct
                    : "bg-red-500 blink"; // Payment incorrect
                // const rowClass =
                // parseFloat(item.pb_dbaltopay) === 0.00
                //   ? "" // No color if balance to pay is zero
                //   : isPaymentCorrect
                //   ? "bg-green-500" // Payment correct
                //   : "bg-red-500 blink"; // Payment incorrect

                // const rowClass = isPaymentCorrect
                //   ? "bg-green-500" // Payment correct
                //   : "bg-red-500 blink"; // Payment incorrect
                return (
                  <tr
                    key={index}
                    className={`${rowClass} hover:bg-gray-50 transition-colors duration-200`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-700 border-r bg-slate-50">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.pb_inoofsit}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      ₹{item.pb_damt}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      ₹{item.pb_dtodaypay}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.pb_ddis}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.pb_drefereceamt}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.pb_epaymethod}
                    </td>
                    {/* <td className="py-3 px-4 text-sm text-gray-700">
                      {item.pb_vwhobuyed}
                    </td> */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      ₹{item.pb_dbaltopay}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formattedDate(item.pb_vdate)}
                    </td>
                    {user.u_eRole == "receptionist" ? (
                      ""
                    ) : (
                      <td className="py-3 px-4 space-x-2 border-l ">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditButton(item)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    )}
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/receptionist/sittings/${id}/${item.pb_vid}`
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 "
                      >
                        Sittings
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>{" "}
          </table>
        </div>
      </div>
    </div>
  );
}

export default PackageBill;
