import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utilities/AxiosInstance";
import SwapReturnBillView from "./SwapReturnBillView";
import { Modal } from "antd";

function ReturnBillView() {
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [returnBill, setReturnBill] = useState([]);
  const [returnBillMaterials, setReturnBillMaterials] = useState(null);
  const [returnBillSwap, setReturnBillSwap] = useState(false);

  const getInventoryBillReturn = async () => {
    try {
      const response = await AxiosInstance.get(
        `/returnbill/get-inventorybillreturn/${id}`
      );
      setReturnBill(response.data.response);
    } catch (error) {
      console.error("Error fetching return bill data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getInventoryBillReturn();
    }
  }, [id]);

  const handleView = () => {
    setReturnBillSwap(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalData(null);
  };

  return (
    <div>
      <h2>Return Bill Details</h2>
      <div className="overflow-x-auto">
        {!returnBillSwap ? (
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
                      <img
                        src={svpc}
                        alt="clinic logo"
                        className="w-32 md:w-52"
                      />
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
                      <p className="font-bold m-0">
                        {modalData.bi_vID || "-/-"}
                      </p>
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
                        <h2 className="font-bold text-blue-500">
                          {" "}
                          Amount Paid
                        </h2>
                        <h3 className="text-center font-bold text-2xl text-red-500">
                          <i>
                            {convertToWords(modalData.bi_iTotal_Paid_Amount)}
                          </i>
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
                        This report is electronically generated and does not
                        require a signature
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        ) : (
          <div className="overflow-auto h-[400px] text-nowrap text-center rounded-md relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[--navbar-bg-color] text-white sticky top-0">
                <tr>
                  <th className="text-center py-3 px-2">S.No</th>
                  <th className="text-center py-3 px-2">Date & Time</th>
                  <th className="text-center py-3 px-2">Return Bill ID</th>
                  <th className="text-center py-3 px-2">Total Return Amount</th>
                  <th className="text-center py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {returnBill.map((item, index) => (
                  <tr key={item.br_vID} className="hover:bg-gray-100">
                    <td>{index + 1}</td>
                    <td className="p-2 whitespace-nowrap">
                      {new Date(item.br_vDateTime)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </td>
                    <td className="p-2 whitespace-nowrap">{item.br_vID}</td>
                    <td className="p-2 whitespace-nowrap">
                      {item.br_iTotal_Return_Amount}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => {
                          handleView(item.br_vID, item.materials);
                          setReturnBillMaterials(item.materials);
                          console.log(item.materials, "item.material");
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnBillView;
