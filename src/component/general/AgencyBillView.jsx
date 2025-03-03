import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import svpc from "../../assets/logo.jpg";
import { IoMdDownload } from "react-icons/io";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// function numberToWords(num) {
//   if (num === null || num === undefined) return '';

//   num = Math.abs(Math.floor(num));

//   const belowTwenty = [
//     'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
//     'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
//     'Seventeen', 'Eighteen', 'Nineteen'
//   ];

//   const tens = [
//     '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
//   ];

//   function convertGroup(n) {
//     if (n === 0) return '';
//     else if (n < 20) return belowTwenty[n] + ' ';
//     else if (n < 100) {
//       return tens[Math.floor(n / 10)] + ' ' + (n % 10 !== 0 ? belowTwenty[n % 10] + ' ' : '');
//     } else {
//       return belowTwenty[Math.floor(n / 100)] + ' Hundred ' + convertGroup(n % 100);
//     }
//   }

//   if (num === 0) return 'Zero';

//   let result = '';

//   // Handle Crores
//   if (num >= 10000000) {
//     result += convertGroup(Math.floor(num / 10000000)) + 'Crore ';
//     num %= 10000000;
//   }

//   // Handle Lakhs
//   if (num >= 100000) {
//     result += convertGroup(Math.floor(num / 100000)) + 'Lakh ';
//     num %= 100000;
//   }

//   // Handle Thousands
//   if (num >= 1000) {
//     result += convertGroup(Math.floor(num / 1000)) + 'Thousand ';
//     num %= 1000;
//   }

//   // Handle remaining
//   result += convertGroup(num);

//   return result.trim();
// }

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

const AgencyBillView = ({ personalData }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const clinicId = userInfo.u_vClinicId;
  const { id } = useParams();
  const [agencyBillData, setAgencyBillData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterDate, setFilterDate] = useState("");
  const [clinicData, setClinicData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [agencyActBillData, setAgencyActBillData] = useState([]);
  const [billId, setBillId] = useState([]);
  console.log(billId, "billId");

  const [materialData, setMaterialData] = useState([]);
  console.log(materialData, "materialData");

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

  const getAgencyBill = async () => {
    try {
      const response = await AxiosInstance.get(
        `/inventorybill/get-billbypatientid/${id}`
      );
      setAgencyActBillData(response.data.response || []);
      getMaterialActData();
    } catch (error) {
      console.log(error);
    }
  };
  const getMaterialActData = async () => {
    if (!billId) {
      console.log("Bill ID is undefined");
      return;
    }

    try {
      const response = await AxiosInstance.get(
        `/billmaterial/get-billmaterials/${billId}`
      );
      setMaterialData(response?.data?.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClinicData();
    getAgencyBill();
  }, [billId]);

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterDate(value);

    if (!value) {
      setFilteredData(agencyBillData);
      return;
    }

    const filtered = agencyBillData.filter((item) => {
      const billDate = new Date(item.ag_dbilldate);
      const searchDate = new Date(value);
      return billDate.toDateString() === searchDate.toDateString();
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showModal = (data) => {
    setModalData(data);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalData(null);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math?.ceil(filteredData?.length / itemsPerPage);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };

  const totalAmount = () => {
    return modalData?.ag_jmaterial?.reduce(
      (acc, curr) =>
        acc + parseFloat(curr.price) * parseFloat(curr.n_iquantity),
      0
    );
  };

  function formatAddress(address) {
    // Split the address into parts using commas and newlines
    const parts = address.split(",").map((part) => part.trim());

    // Join the parts into a formatted structure
    const formattedAddress = parts
      .map((line, index) => (index === parts.length - 1 ? line : `${line},`))
      .join("\n");

    return formattedAddress;
  }

  const downloadPDF = () => {
    const content = document.getElementById("bill-content");
    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 190; // Adjust as needed
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`FinalBill_${modalData?.ag_vbid || "Bill"}.pdf`);
      });
    } else {
      console.error("Element with id 'bill-content' not found");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center">
        <label htmlFor="bill-date" className="mr-2 text-gray-700">
          Filter by Bill Date:
        </label>
        <input
          type="date"
          id="bill-date"
          value={filterDate}
          onChange={handleFilter}
          className="border border-gray-300 rounded-md px-2 py-1"
        />
        <button
          className="mx-2 bg-blue-100 px-2 py-1 rounded-md border border-blue-500"
          onClick={() => {
            setFilterDate("");
            setFilteredData(agencyBillData);
          }}
        >
          Clear
        </button>
        <button
          className="mx-2 bg-blue-100 px-2 py-1 rounded-md border border-blue-500"
          onClick={() => {
            navigate("/agency-bill-view/return");
          }}
        >
          Return
        </button>
      </div>
      <div className="text-nowrap text-center rounded-md overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-[--navbar-bg-color] text-white">
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                S.No
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                Bill ID
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                Patient Name
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                Patient ID
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                Total Amount
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                Discount
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                GST Amount
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                Payable Amount
              </th>
              <th className=" bg-[--navbar-bg-color] text-white px-4 py-2">
                View / Download
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {agencyActBillData?.length > 0 ? (
              agencyActBillData.map((item, index) => (
                <tr key={index} className="bg-white hover:bg-gray-100">
                  <td className="px-4 py-2 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-4 py-2 text-center">{item.bi_vID}</td>
                  <td className="px-4 py-2 text-center">
                    {item.bi_vPatient_Name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {item.bi_vPatient_Id}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ₹{item.bi_iTotal_Amout}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ₹{item.bi_iDiscount_Amount}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ₹{item.bi_iTotal_GSTAmount}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ₹{item.bi_iTotal_Payable_Amount}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        showModal(item);
                        setBillId(item.bi_vID);
                      }}
                    >
                      View / Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-2 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal
        title="Agency Bill Details"
        open={isModalVisible}
        width={800}
        onCancel={handleModalClose}
        footer={null}
      >
        {modalData && (
          <div>
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
                <h1>Receipt</h1>
              </div>

              <div className="my-4">
                <hr className="border border-[--navbar-bg-color]" />
                <hr className="border border-[--navbar-bg-color]" />
              </div>

              <div className="flex flex-col gap-2 text-lg">
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold m-0">Bill ID:</h1>
                  <p className="font-bold m-0">{modalData.bi_vID || "-/-"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold m-0">Date:</h1>
                  <p className="font-bold m-0">
                    {formatDate(modalData.bi_vDate) || "-/-"}
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

              {/* Bill Details Section */}
              <div>
                <h1 className="font-semibold text-xl text-center underline">
                  Material Details
                </h1>
                <div className="overflow-x-auto my-4">
                  <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-[--navbar-bg-color] text-white">
                      <tr>
                        <th className="px-2 py-2 border border-gray-300">
                          S.No
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Material Name
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Unit Price
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Quantity
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Size
                        </th>
                        <th className="px-2 py-2 border border-gray-300">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialData.length > 0 &&
                        materialData.map((item, index) => (
                          <tr className="bg-gray-50">
                            <td className="px-2 py-2 border border-gray-300 text-center font-medium text-base">
                              {index + 1}
                            </td>
                            <td className="px-2 py-2 border border-gray-300 font-medium text-base">
                              {item.bim_vMaterial_name}
                            </td>
                            <td className="px-2 py-2 border border-gray-300 font-medium text-base text-center">
                              ₹ {item.bim_iUnit_Amount}
                            </td>
                            <td className="px-2 py-2 border border-gray-300 text-center font-medium text-base">
                              {item.bim_iMaterial_Count}
                            </td>
                            <td className="px-2 py-2 border border-gray-300 text-center font-medium text-base">
                              {item.bim_vMaterial_Size}
                            </td>
                            <td className="px-2 py-2 border border-gray-300 text-center font-medium text-base">
                              ₹ {item.bim_iTotal_Payable_Amount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-4 flex-row justify-between h-full">
                  <div className="mt-16 px-2 py-1 text-sm font-medium border border-gray-300 h-full text-gray-600">
                    {/* Convert the amount to words */}
                    <h2 className="font-bold text-blue-500"> Amount Paid</h2>
                    <h3 className="text-center font-bold text-2xl text-red-500">
                      <i>{convertToWords(modalData.bi_iTotal_Paid_Amount)}</i>
                    </h3>
                  </div>
                  <div className="">
                    <table className="text-nowrap border border-gray-300 w-full text-left">
                      <tbody>
                        {modalData?.fb_jsittingdetails?.length > 0 && (
                          <tr>
                            <th className="px-8 py-1 text-base font-medium border border-gray-300 text-right">
                              Sitting Total:
                            </th>
                            <td className="px-8 py-1 text-lg border border-gray-300 font-medium">
                              ₹{totalAmount()}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <th className="px-8 py-1 text-base font-medium border border-gray-300 text-right">
                            Discount:
                          </th>
                          <td className="px-8 py-1 text-lg border border-gray-300 font-medium">
                            ₹{modalData.bi_iDiscount_Amount}
                          </td>
                        </tr>
                        <tr>
                          <th className="px-8  py-1 text-base  font-medium border border-gray-300 text-right">
                            GST Amount:
                          </th>
                          <td className="px-8 py-1 text-lg border border-gray-300 ">
                            ₹{modalData.bi_iTotal_GSTAmount}
                          </td>
                        </tr>
                        <tr>
                          <th className="px-8 py-2 text-base font-medium border border-gray-300 text-right">
                            Total Amount:
                          </th>
                          <td className="px-8 py-2 text-lg border border-gray-300 font-medium">
                            {modalData.bi_iTotal_Amout}
                          </td>
                        </tr>

                        <tr>
                          <th className="px-8 py-2 text-base font-medium border border-gray-300 text-right">
                            Payment through:
                          </th>
                          <td className="px-8 py-1 text-lg border border-gray-300 uppercase">
                            {modalData.bi_vPayment_method || "-/-"}
                          </td>
                        </tr>
                        <tr>
                          <th className="px-8  py-1 text-base  font-medium border border-gray-300 text-right">
                            Billing by:
                          </th>
                          <td className="px-8 py-1 text-lg border border-gray-300 ">
                            {userInfo.u_vName || "-/-"}
                          </td>
                        </tr>
                        <tr>
                          <th className="px-8  py-1 text-base font-extrabold  border border-gray-300 text-right">
                            Amount To Pay:
                          </th>
                          <td className="px-8 py-1 font-extrabold text-lg border border-gray-300 ">
                            ₹{modalData.bi_iTotal_Payable_Amount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center my-4 p-6">
                  <h1 className="text-red-500 font-semibold">
                    This report is electronically generated and does not require
                    a signature
                  </h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AgencyBillView;
