import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utilities/AxiosInstance";
import { Modal } from "antd";
import svpc from "../../assets/logo.jpg";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PackageBillView = ({ personalData }) => {
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinicId = user.u_vClinicId;
  const [packageBill, setPackageBill] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [clinicData, setClinicData] = useState([]);
  const [sittingDetails, setSittingDetails] = useState([]);

  function dateFormat(date) {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${day}-${month}-${year}`;
  }

  const getPackageBill = async () => {
    try {
      const response = await AxiosInstance.post(
        "/packagebill/get-packagebillbypatientid",
        {
          pb_vpatient_id: id,
        }
      );
      setPackageBill(response.data.response?.reverse() || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getClinicData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/clinic/get-clinicId/${clinicId}`
      );
      setClinicData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const getSittingDetails = async () => {
    try {
      const response = await AxiosInstance.get(
        `/sittingtable/get-sittingtable-bypatient/${id}`
      );
      setSittingDetails(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = () => {
    const content = document.getElementById("bill-content");
    if (content) {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const margin = 10; // Margin in mm
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgWidth = pageWidth - 2 * margin; // Apply margins
        let imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        // Scale to fit within A4 page while maintaining aspect ratio
        if (imgHeight > pageHeight - 2 * margin) {
          imgHeight = pageHeight - 2 * margin;
        }

        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
        pdf.save(`Package_${selectedBill?.pb_vid || "Bill"}.pdf`);
      });
    } else {
      console.error("Element with id 'bill-content' not found");
    }
  };

  const convertToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n) => {
      if (parseInt(n, 10) === 0) return "Zero";
      if (parseInt(n, 10) < 20) return a[parseInt(n, 10)];
      if (parseInt(n, 10) < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
      if (parseInt(n, 10) < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred " +
          (n % 100 === 0 ? "" : inWords(n % 100))
        );
      if (parseInt(n, 10) < 100000)
        return (
          inWords(Math.floor(n / 1000)) +
          " Thousand " +
          (n % 1000 === 0 ? "" : inWords(n % 1000))
        );
      if (parseInt(n, 10) <= 5000000)
        return (
          inWords(Math.floor(n / 100000)) +
          " Lakh " +
          (n % 100000 === 0 ? "" : inWords(n % 100000))
        );
      return "Amount too large to convert!";
    };

    return inWords(Math.floor(num)) + " Rupees Only";
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  function formatAddress(address) {
    // Split the address into parts using commas and newlines
    const parts = address?.split(",").map((part) => part.trim());

    // Join the parts into a formatted structure
    const formattedAddress = parts
      ?.map((line, index) => (index === parts?.length - 1 ? line : `${line},`))
      .join("\n");

    return formattedAddress;
  }

  const showModal = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
  };

  useEffect(() => {
    getPackageBill();
    getClinicData();
    getSittingDetails();
  }, []);

  function bgColorGenerator(data) {
    const formattedNumber = Math.floor(data.pb_dbaltopay);
    return formattedNumber === 3000 ? "bg-green-100 animate-pulse	" : "";
  }

  const totalPaidAmount = (amount) => {
    // Check if sittingDetails is defined and not null, otherwise default to 0
    const sittingTotal = sittingDetails
      ? sittingDetails.reduce(
          (total, sitting) => total + (parseFloat(sitting.st_dsittingamt) || 0),
          0
        )
      : 0;
    return Math.floor(sittingTotal + parseInt(amount || 0, 10));
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full text-nowrap text-center rounded-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[--navbar-bg-color] text-white">
              <th className="px-4 py-2">S No</th>
              <th className="px-4 py-2">Bill Id</th>
              <th className="px-4 py-2">Bill Date</th>
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {packageBill.length > 0 ? (
              packageBill.map((data, index) => (
                <tr
                  key={index}
                  className={`bg-white hover:bg-gray-100 ${bgColorGenerator(
                    data
                  )}`}
                >
                  <td className="px-4 text-center py-2">{index + 1}</td>
                  <td className="px-4 text-center py-2">{data.pb_vid}</td>
                  <td className="px-4 text-center py-2">
                    {dateFormat(data.pb_vdate)}
                  </td>
                  <td
                    className="px-4 py-2 underline text-blue-500 cursor-pointer text-center"
                    onClick={() => showModal(data)}
                  >
                    View / Download
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">
                  No bills found
                </td>
              </tr>
            )}
          </tbody>{" "}
        </table>
      </div>
      <Modal
        title="Bill Details"
        open={isModalOpen}
        width={800}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedBill && (
          <div>
            {/* Download Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={downloadPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Download PDF
              </button>
            </div>

            {/* Header Section */}
            <div id="bill-content">
              <div className="flex justify-evenly items-center">
                <div>
                  <img src={svpc} alt="clinic logo" className="w-32 md:w-52" />
                </div>
                {/* Address Section */}
                <div className="mt-4 mb-6 text-center text-gray-700 capitalize whitespace-pre-line text-base font-semibold">
                  <h1 className="text-lg md:text-2xl font-bold">
                    Sri Venkateswara Physiotherapy Centre
                  </h1>
                  {formatAddress(clinicData.c_tAddress) || "-/-"}
                  <p>{clinicData.c_vPhone || "-/-"}</p>
                </div>
              </div>
              <div className="flex items-center justify-center text-[--navbar-bg-color] font-bold text-2xl">
                <h1 className="capitalize">Receipt</h1>
              </div>
              <div className="my-4">
                <hr className="border border-[--navbar-bg-color]" />
                <hr className="border border-[--navbar-bg-color]" />
              </div>

              <div className="flex flex-col gap-2 text-lg">
                <div className="flex gap-2">
                  <h1 className="font-semibold">Bill ID:</h1>
                  <p className="font-bold">{selectedBill.pb_vid || "-/-"}</p>
                </div>
                <div className="flex gap-2">
                  <h1 className="font-semibold">Date:</h1>
                  <p className="font-bold">
                    {formattedDate(selectedBill.pb_vdate) || "-/-"}
                  </p>{" "}
                </div>
              </div>

              {/*Patient Table Section */}
              <div className="overflow-x-auto my-4">
                <table className="table-auto border-collapse w-full text-left border border-gray-300">
                  <thead className="bg-[--navbar-bg-color] text-white">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-base">
                        Patient Information
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-base">
                        Contact Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-gray-300">
                        <div className="space-y-1">
                          <p className="font-medium text-base">
                            Patient ID: {personalData?.p_vid || "-/-"}
                          </p>
                          <p className="font-medium text-base capitalize">
                            Name: {personalData?.p_vName || "-/-"}
                          </p>
                          <p className="font-medium text-base">
                            Age: {personalData?.p_iAge || "-/-"}
                          </p>
                          <p className="font-medium text-base capitalize">
                            Gender: {personalData?.p_egender || "-/-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <div className="space-y-1">
                          <p className="font-medium text-base">
                            Address: {personalData?.p_tAddress || "-/-"}
                          </p>
                          <p className="font-medium text-base">
                            Phone No: {personalData?.p_vPhone || "-/-"}
                          </p>
                          <p className="font-medium text-base">
                            Email: {personalData?.p_vEmail || "-/-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bill Information */}

              <div>
                <div className="text-center text-xl font-bold">
                  <h1>Payment Details</h1>
                </div>
                <div className="overflow-x-auto my-4">
                  <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-[--navbar-bg-color] text-white">
                      <tr>
                        <th className="px-2 py-2 border border-gray-300">
                          Date
                        </th>{" "}
                        <th className="px-2 py-2 border border-gray-300">
                          Package Amount
                        </th>{" "}
                        <th className="px-2 py-2 border border-gray-300">
                          No of Sittings
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Discount
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Paid Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      <tr>
                        <td className="px-2 py-2 border border-gray-300">
                          {formattedDate(selectedBill.pb_created_at)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          ₹{selectedBill?.pb_damt}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {selectedBill?.pb_inoofsit}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {Math.floor(selectedBill?.pb_ddis) + " " + "%" ||
                            "-/-"}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 uppercase">
                          ₹{selectedBill?.pb_dtodaypay}
                        </td>
                      </tr>
                    </tbody>{" "}
                  </table>
                </div>
              </div>
              {/* Sitting Details */}
              <div>
                {sittingDetails?.length > 0 && (
                  <div className="text-center text-xl font-bold">
                    <h1>Sitting Details</h1>
                  </div>
                )}
                {sittingDetails?.length > 0 && (
                  <div className="overflow-x-auto my-4">
                    <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
                      <thead className="bg-[--navbar-bg-color] text-white">
                        <tr>
                          <th className="px-2 py-2 border border-gray-300">
                            S. No
                          </th>{" "}
                          <th className="px-2 py-2 border border-gray-300">
                            Date
                          </th>
                          <th className="px-2 py-2 border border-gray-300">
                            Received By
                          </th>
                          <th className="px-2 py-2 border border-gray-300">
                            Payment Method
                          </th>
                          <th className="px-2 py-2 border border-gray-300">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {sittingDetails.map((item, index) => (
                          <tr key={index}>
                            <td className="px-2 py-2 border border-gray-300">
                              {index + 1}
                            </td>
                            <td className="px-2 py-2 border border-gray-300">
                              {formattedDate(item.st_vdate)}
                            </td>
                            <td className="px-2 py-2 border border-gray-300">
                              {item.st_tamtrecby}
                            </td>
                            <td className="px-2 py-2 border border-gray-300">
                              {item.st_epaymentthrough}
                            </td>

                            <td className="px-2 py-2 border border-gray-300">
                              ₹{item.st_dsittingamt}
                            </td>
                          </tr>
                        ))}
                      </tbody>{" "}
                    </table>
                  </div>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <div className=" w-full p-4  border border-gray-300 my-4 rounded">
                  <h1 className="text-lg font-bold text-blue-500">
                    Amount in Words:
                  </h1>
                  <h1 className="text-lg text-red-500 italic font-bold">
                    {convertToWords(totalPaidAmount(selectedBill.pb_dtodaypay))}
                  </h1>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center p-1  border border-gray-300 my-4 rounded">
                    <h1 className="text-lg font-semibold">
                      Total Paid Amount:
                    </h1>
                    <h1 className="text-xl font-bold">
                      ₹{totalPaidAmount(selectedBill.pb_dtodaypay)} /-
                    </h1>
                  </div>

                  <div className="flex justify-between items-center p-1  border border-gray-300 my-4 rounded">
                    <h1 className="text-lg">Balance To Pay:</h1>
                    <h1 className="text-base">
                      ₹
                      {Math.floor(selectedBill.pb_dbaltopay) + " " + "/-" ||
                        "-/-"}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="text-center my-4 p-6">
                <h1 className="text-red-500 font-semibold">
                  This report is electronically generated and does not require a
                  signature
                </h1>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PackageBillView;
