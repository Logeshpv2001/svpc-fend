import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";

export default function PaymentDetailsView() {
  const { patient_id } = useParams();
  const [paymentData, setPaymentData] = useState([]);

  const getPaymentDetails = async () => {
    const response = await AxiosInstance.get(
      `/physio-bill/get-physiobill-by-patient/${patient_id}`
    );
    setPaymentData(response.data.response || []);
  };

  useEffect(() => {
    getPaymentDetails();
  }, []);

  function formatDate(currentDate) {
    if (isNaN(currentDate)) return "-/-";
    const date = new Date(currentDate);
    const year = date.getFullYear(); // Get the local year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Local month
    const day = String(date.getDate()).padStart(2, "0"); // Local day

    return `${day}-${month}-${year}`;
  }

  const paymentDetails = [
    {
      label: "Bill Date",
      value: formatDate(paymentData.pb_dbilldate),
    },
    {
      label: "Package Amount",
      value: paymentData.pb_initialamt || "-/-",
    },
    {
      label: "Discount",
      value: paymentData.pb_ddiscount || "-/-",
    },
    {
      label: "Balance To Pay",
      value: paymentData.pb_damttopay || "-/-",
    },
  ];

  const bgColors = ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-red-50"];

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg shadow-md border-t-4 border-gray-400">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentDetails.map((item, index) => (
          <div
            key={index}
            className={`${bgColors[index]} p-4 rounded-lg shadow text-center`}
          >
            <p className="text-gray-600 font-semibold mb-2">{item.label}</p>
            <p className="text-gray-800 text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
