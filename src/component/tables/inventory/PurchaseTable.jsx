import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../../utilities/AxiosInstance";

const PurchaseTable = () => {
  const navigate = useNavigate();
  const [purchaseData, setPurchaseData] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;

  const getPurchaseData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/inventories/get-all/${clinic_id}`
      );
      setPurchaseData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };
  useEffect(() => {
    getPurchaseData();
  }, []);
  return (
    <div>
      <div className="w-fit mb-4">
        <Link
          to="/receptionist/purchase/create"
          className="flex items-center gap-2 bg-[--navbar-bg-color] text-white hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] rounded duration-200 px-3 py-1"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Purchase
        </Link>
      </div>
      <div className="overflow-auto  rounded-md shadow-md">
        {purchaseData?.length > 0 ? (
          <table className="overflow-auto text-nowrap text-center w-full">
            <thead>
              <tr className="bg-[--navbar-bg-color] text-white font-bold">
                <th className="px-4 py-2 sticky left-0 bg-[--navbar-bg-color] border-r border-white">
                  S.no
                </th>
                <th className="px-4 py-2">Company Name</th>
                <th className="px-4 py-2">Bill No</th>
                <th className="px-4 py-2">Supplier Name</th>
                <th className="px-4 py-2">Purchase Date</th>
                <th className="px-4 py-2">Material Count</th>
                <th className="px-4 py-2">Total Amount</th>
                <th className="px-4 py-2">Discount Amount</th>
                <th className="px-4 py-2">GST Amount</th>
                <th className="px-4 py-2">Total Payable Amount</th>
                <th className="px-4 py-2">Total Paid Amount</th>
                <th className="px-4 py-2 sticky right-0 bg-[--navbar-bg-color] border-l border-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="overflow-auto divide-y divide-gray-200">
              {purchaseData?.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 sticky left-0 bg-slate-100 border-r">
                    {index + 1}
                  </td>
                  <td className="py-2">{item.in_vCompany_Name}</td>
                  <td className="py-2">{item.in_vBill_No}</td>
                  <td className="py-2">{item.in_vSupplier_Name}</td>
                  <td className="py-2">{formatDate(item.in_dPurchase_Date)}</td>
                  <td className="py-2">{item.in_iMaterial_Count}</td>
                  <td className="py-2">₹{item.in_iTotal_Amount}</td>
                  <td className="py-2">₹{item.in_iDiscount_Amount}</td>
                  <td className="py-2">₹{item.in_iGST_Amount}</td>
                  <td className="py-2">₹{item.in_iTotal_Payable_Amount}</td>
                  <td className="py-2">₹{item.in_iTotal_Paid_Amount}</td>
                  <td className="py-2 sticky right-0 bg-slate-100 border-l">
                    <div className="w-full">
                      <button
                        onClick={() => {
                          navigate(
                            `/receptionist/purchase/material/${item.in_vID}`
                          );
                        }}
                        className="bg-[--navbar-bg-color] text-white hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] rounded duration-200 px-3 py-1 mx-2"
                      >
                        Material
                      </button>{" "}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="animate-bounce mt-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-600 animate-pulse">
              No Purchase Found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseTable;
