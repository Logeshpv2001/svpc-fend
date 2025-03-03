import React, { useRef, useState } from "react";
import { Input, Modal, Space } from "antd";
import {
  CloseOutlined,
  PhoneOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import icon from "../../assets/logo.jpg";
import { MdOutlineEmail, MdOutlineLocationOn } from "react-icons/md";

const RehabBillTable = ({ billData }) => {
  const printableDivRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [singleBill, setSingleBill] = useState(null);
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
    message.success("Search reset successfully!");
  };

  const handlePrint = () => {
    const printContents = printableDivRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const filteredBillData = billData?.filter(
    (bill) =>
      bill.r_vname?.toLowerCase().includes(searchText.toLowerCase()) ||
      bill.r_vid?.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if needed
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="">
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Patient Name or ID"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          className="shadow-md"
        />
        <a
          onClick={handleReset}
          className="text-base bg-blue-500 px-5 py-1 rounded-md text-white"
        >
          Reset
        </a>
      </Space>
      <div className="max-w-full overflow-auto text-nowrap">
        <table className="w-full border-collapse bill-table text-center rounded-md overflow-hidden">
          <thead className="bg-[--navbar-bg-color] text-white">
            <tr>
              <th className="border p-2">S No</th>
              <th className="border p-2">Patient ID</th>
              <th className="border p-2">Patient Name</th>
              <th className="border p-2">Invoice Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBillData.length === 0 ? (
              <tr>
                <td colSpan="5" className="border p-4 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              filteredBillData.map((row, index) => (
                <tr key={index} className="bg-white">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{row.r_vpatient_id}</td>
                  <td className="border p-2">{row.r_vname}</td>
                  <td className="border p-2">{formatDate(row.r_cdate)}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setSelectedBill(row);
                        setSingleBill(row);
                        setModalVisible(true);
                      }}
                      className="bg-[--navbar-bg-color] text-white px-4 py-1 rounded-md hover"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modalVisible && selectedBill && (
        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          className=" min-w-[700px]"
          closeIcon={false}
          footer={null}
        >
          <div className="bg-white min-w-[650px] p-4 mb-5 rounded-md shadow-md flex flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold ">Rehab Bill</h2>
            <div className="flex gap-4 flex-row">
              <button onClick={handlePrint}>
                <PrinterOutlined />
              </button>
              <button onClick={() => setModalVisible(false)}>
                <CloseOutlined />
              </button>
            </div>
          </div>
          <div
            className="bg-white p-5 rounded-md shadow-md min-w-[450px]"
            ref={printableDivRef}
            id="printableDiv"
          >
            <div className="flex flex-col justify-between mb-4 text-center">
              <div className="flex items-center justify-center">
                <img
                  src={icon}
                  className="w-40 shadow-md rounded-md"
                  alt="clinic logo"
                />
              </div>
              <div className="">
                <h2 className="text-xl font-bold mb-2 uppercase w-full">
                  Sri Venkateswara Physiotherapy Clinic
                </h2>
                <p className="text-gray-600 text-xs">
                  <span className="font-semibold">
                    12, Collah Chatiram Street,
                    <br /> Kanchipuram - 631502
                    <br /> (Opposite to Sskv Hr. Sec. School).
                  </span>
                </p>
              </div>
            </div>
            <hr className="h-3 my-3 bg-[--navbar-bg-color]" />
            <div className="flex flex-col justify-between mb-4 gap-5">
              <div>
                <h2 className="text-xl font-bold mb-2 Capitalize">
                  Patient Details
                </h2>
                <div className="grid grid-cols-2 w-full text-sm">
                  <p className="w-full flex justify-between border-t border-l border-r border-gray-300 px-2">
                    Name:{" "}
                    <span className="font-semibold">{singleBill?.r_vname}</span>
                  </p>
                  <p className="w-full flex justify-between border-t border-r border-gray-300 px-2">
                    ID:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_vpatient_id}
                    </span>
                  </p>
                  <p className="w-full flex justify-between border-t border-l border-r border-b border-gray-300 px-2">
                    Age:{" "}
                    <span className="font-semibold">{singleBill?.r_iage}</span>
                  </p>
                  <p className="w-full flex justify-between border-r border-t border-b border-gray-300 px-2">
                    Gender:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_egender}
                    </span>
                  </p>
                  <p className="w-full flex justify-between border-b border-l border-r border-gray-300 px-2">
                    Address:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_taddress || "N/A"}
                    </span>
                  </p>
                  <p className="w-full flex justify-between border-b border-r border-gray-300 px-2">
                    Phone:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_vphone}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              <div>
                <h2 className="text-xl font-bold mb-2 Capitalize">
                  Bill Details
                </h2>
                <div className="grid grid-cols-2 w-full text-sm">
                  <p className="w-full flex justify-between border border-gray-300 px-2">
                    Bill ID:{" "}
                    <span className="font-semibold">{singleBill?.r_vbid}</span>
                  </p>
                  <p className="w-full flex justify-between border-t border-r border-b border-gray-300 px-2">
                    Bill Date:{" "}
                    <span className="font-semibold">
                      {formatDate(singleBill?.r_cdate)}
                    </span>
                  </p>
                  <p className="w-full flex justify-between border-l border-r border-b px-2 border-gray-300">
                    Diagnosis:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_vdiagnosis}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              {singleBill.r_jmaterial && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-2 Capitalize">
                      Material Details
                    </h2>
                    <div className="grid grid-cols-2 w-full text-sm">
                      <table className="w-full border border-gray-300 text-center">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="px-2">Material</th>
                            <th className="px-2">Quantity</th>
                            <th className="px-2">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {singleBill?.r_jmaterial?.map((data) => {
                            return (
                              <tr>
                                <td className="px-2">{data.product}</td>
                                <td className="px-2">{data.n_iquantity}</td>
                                <td className="px-2">{data.price}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <hr />
                </>
              )}
              <div>
                <h2 className="text-xl font-bold mb-2 Capitalize">
                  Sitting Details
                </h2>
                <div className="grid grid-cols-2 w-full text-sm">
                  <p className="w-full flex justify-between border border-gray-300 px-2">
                    Sitting No:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_jsittings[0].sittingNo}
                    </span>
                  </p>
                  <p className="w-full flex justify-between border-t border-r border-b border-gray-300 px-2">
                    Sitting Date:{" "}
                    <span className="font-semibold">
                      {formatDate(singleBill?.r_jsittings[0].sittingDate)}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              <div>
                <h2 className="text-xl font-bold mb-2 Capitalize">
                  Bill Details
                </h2>
                <div className="text-sm">
                  {singleBill.r_jmaterial && (
                    <p className="w-full flex justify-between border-l px-2 border-t border-r border-gray-300">
                      Material Amount:{" "}
                      <span className="font-semibold">
                        {singleBill?.r_jmaterial?.reduce(
                          (total, data) => total + data.price,
                          0
                        )}
                        .00
                      </span>
                    </p>
                  )}
                  <p className="w-full flex justify-between border-l border-r border-b border-t px-2 border-gray-300">
                    Sitting Amount:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_jsittings[0].sittingAmt}.00
                    </span>
                  </p>
                  <p className="w-full flex justify-between border-l px-2 border-b border-r border-gray-300">
                    Total:{" "}
                    <span className="font-semibold">
                      {singleBill?.r_dtotal}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center my-5">
              <p className="text-red-500 text-sm">
                *This report is electronically generated and does not require a
                signature*
              </p>
            </div>
            <div className="flex flex-row justify-center bg-[--navbar-bg-color] text-white p-2 rounded-md rounded-b-none">
              <div className="flex flex-row justify-center items-center gap-3 w-full border-r">
                <div className="flex items-center justify-center text-[--navbar-bg-color] h-6 w-6 rounded-full bg-[--light-navbar-bg-color]">
                  <PhoneOutlined />
                </div>
                <p>1234567890</p>
              </div>
              <div className="flex flex-row justify-center items-center gap-3 w-full border-r border-l">
                <div className="flex items-center justify-center text-[--navbar-bg-color] h-6 w-6 rounded-full bg-[--light-navbar-bg-color]">
                  <MdOutlineEmail />
                </div>
                <p>sri@example.com</p>
              </div>
              <div className="flex flex-row justify-center items-center gap-3 w-full border-l">
                <div className="flex items-center justify-center text-[--navbar-bg-color] h-6 w-6 rounded-full bg-[--light-navbar-bg-color]">
                  <MdOutlineLocationOn />
                </div>
                <p>Kanchipuram</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RehabBillTable;
