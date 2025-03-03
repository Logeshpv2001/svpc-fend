import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams } from "react-router-dom";
import { Modal } from "antd";
import svpc from "../../assets/logo.jpg";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
const DailyBillView = ({ personalData }) => {
  console.log(personalData);
  const { id } = useParams();
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const clinicId = userInfo.u_vClinicId;

  const [dailyBillData, setDailyBillData] = useState([]);

  const [dailyClinicBillData, setDailyClinicBillData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [clinicData, setClinicData] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  const getDailyBill = async () => {
    try {
      const response = await AxiosInstance.post(
        "/dailybill/getdailybillbypatientid",
        {
          db_vpatient_id: id,
        }
      );
      setDailyBillData(response.data.response);
      setFilteredData(response.data.response?.reverse());
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
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };
  const getDailyBillsByClinic = async () => {
    try {
      const response = await AxiosInstance.post(
        "/dailybill/getdailybillbyclinicid",
        {
          db_vclinicid: clinicData?.c_clinicid,
        }
      );
      setDailyClinicBillData(response.data.response);
      setFilteredData(response.data.response?.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClinicData();
    getDailyBill();
    getDailyBillsByClinic();
  }, []);

  // Function to handle opening the modal
  const showModal = (data) => {
    console.log(data);
    setModalData(data);
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setModalData(null);
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

  function formattedDate(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  }

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterDate(value);

    if (!value) {
      setFilteredData(dailyBillData);
      return;
    }

    const filtered = dailyBillData.filter((item) => {
      const changedDate = item.fb_vbilldate.replaceAll("/", "-");

      const searchDate = new Date(value);

      return changedDate === formattedDate(searchDate);
    });

    setFilteredData(filtered);
  };

  const downloadPDF = () => {
    const content = document.getElementById("bill-content");
    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 190; // Adjust as needed
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`Daily_${modalData?.db_vid || "Bill"}.pdf`);
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

  return (
    <div className="p-4">
      <div className="overflow-x-auto text-nowrap text-center rounded-md">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-[--navbar-bg-color] text-white">
              <th className="border border-[--navbar-bg-color] bg-[--navbar-bg-color] text-white px-4 py-2 ">
                S.No
              </th>
              <th className="border border-[--navbar-bg-color] bg-[--navbar-bg-color] text-white px-4 py-2 text-center">
                Bill ID
              </th>
              <th className="border border-[--navbar-bg-color] bg-[--navbar-bg-color] text-white px-4 py-2 text-center">
                Bill Date
              </th>
              <th className="border border-[--navbar-bg-color] bg-[--navbar-bg-color] text-white px-4 py-2 text-center">
                View / Download
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr key={index} className="bg-white hover:bg-gray-100">
                  <td className=" px-4 py-2 text-center">{index + 1}</td>
                  <td className=" px-4 py-2 text-center">{data.db_vid}</td>
                  <td className=" px-4 py-2 text-center">
                    {formattedDate(data.db_vdate)}
                  </td>
                  <td className=" px-4 py-2 text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => showModal(data)}
                    >
                      View / Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className=" px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Ant Design Modal */}
      <Modal
        title="Bill Details"
        open={isModalVisible}
        width={800}
        onCancel={handleCancel}
        footer={null}
      >
        {modalData && (
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
                  <p className="font-bold">{modalData.db_vid || "-/-"}</p>
                </div>
                <div className="flex gap-2">
                  <h1 className="font-semibold">Date:</h1>
                  <p className="font-bold">
                    {formattedDate(modalData.db_vdate) || "-/-"}
                  </p>
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
                          Amount
                        </th>{" "}
                        <th className="px-2 py-2 border border-gray-300">
                          Discount (%)
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Payment Type
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Paid Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      <tr>
                        {/* <td className="px-2 py-2 border border-gray-300"></td> */}
                        <td className="px-2 py-2 border border-gray-300">
                          ₹{modalData?.db_damount}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {Math.floor(modalData?.db_ddiscount) || "-/-"}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 uppercase">
                          {modalData?.db_vpaymentmethod}
                        </td>
                        {/* <td className="px-2 py-2 border border-gray-300"></td> */}
                        <td className="px-2 py-2 border border-gray-300">
                          ₹{modalData?.db_dbalancetopay}
                        </td>
                      </tr>
                    </tbody>{" "}
                  </table>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <div className=" w-full p-4  border border-gray-300 my-4 rounded">
                  <h1 className="text-lg font-bold text-blue-500">
                    Amount in Words:
                  </h1>
                  <h1 className="text-lg text-red-500 italic font-bold">
                    {convertToWords(modalData.db_dbalancetopay)}
                  </h1>
                </div>
                <div className="w-full p-4  border border-gray-300 my-4 rounded">
                  <h1 className="text-lg font-semibold">Total Paid Amount:</h1>
                  <h1 className="text-center text-xl font-bold">
                    ₹{modalData.db_dbalancetopay}/-
                  </h1>
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

export default DailyBillView;
