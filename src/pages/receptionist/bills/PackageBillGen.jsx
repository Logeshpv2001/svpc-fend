import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Empty } from "antd";
import { PiWheelchairBold } from "react-icons/pi";
import "../../../App.css";

function PackageBillGen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packagebillData, setPackagebillData] = useState([]);

  // Fetch data by patient ID
  const getData = async () => {
    try {
      const response = await AxiosInstance.post(
        "/packagebill/get-packagebillbypatientid",
        {
          pb_vpatient_id: id,
        }
      );
      setPackagebillData(response.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Sittings</h1>
      <button
        className="bg-[--navbar-bg-color] mb-4 gap-3 flex-nowrap flex items-center justify-center px-4 hover:shadow-md p-2 hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-200 text-white rounded-md"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack /> Back
      </button>
      <div className="overflow-x-auto shadow-md">
        {packagebillData.length > 0 ? (
          <table className="min-w-full bg-gray-100 rounded-lg text-center text-nowrap text-sm">
            <thead className="bg-blue-500 text-white">
              <tr className="font-semibold">
                <th className="py-3 px-4 border-b rounded-tl-md overflow-hidden">
                  S.No
                </th>
                <th className="py-3 px-2 border-b">Name</th>
                <th className="py-3 px-2 border-b">Package ID</th>
                <th className="py-3 px-2 border-b">No. of Sittings</th>
                <th className="py-3 px-2 border-b">Reference Amount</th>
                <th className="py-3 px-2 border-b">Today Payment</th>
                <th className="py-3 px-2 border-b">Payment Method</th>
                <th className="py-3 px-2 border-b">Balance to Pay</th>
                <th className="py-3 px-2 border-b rounded-tr-md overflow-hidden">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packagebillData.reverse().map((item, index) => {
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
                    className={`${rowClass} hover:bg-blue-50 transition-colors duration-200 font-semibold`}
                  >
                    <td className="py-3 px-4 border-r bg-gray-50">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{item.pb_vname}</td>
                    <td className="py-3 px-4 text-gray-700">{item.pb_vid}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.pb_inoofsit}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.pb_drefereceamt}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.pb_dtodaypay}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.pb_epaymethod}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {parseFloat(item.pb_dbaltopay) === 0
                        ? "NILL"
                        : item.pb_dbaltopay}
                    </td>
                    <td className="border-l bg-gray-50">
                      <div className="flex justify-center items-center w-full h-full">
                        <button
                          onClick={() => {
                            navigate(
                              `/receptionist/sittings/${id}/${item.pb_vid}`
                            );
                          }}
                          className="flex items-center justify-center gap-2 flex-nowrap h-8 px-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white duration-200 rounded-md"
                        >
                          Sittings <PiWheelchairBold />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
}

export default PackageBillGen;
