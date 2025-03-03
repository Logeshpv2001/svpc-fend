import React, { useEffect, useState } from "react";
import NavTabs from "../../../component/tabs/NavTabs";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaBirthdayCake, FaRegUser } from "react-icons/fa";
import { IoFemale, IoMale, IoMaleFemale } from "react-icons/io5";
import { PhoneOutlined } from "@ant-design/icons";
import { MdAddShoppingCart, MdOutlineLocationOn } from "react-icons/md";
import { message } from "antd";

const RehabBill = () => {
  const currentPage = "bill";
  const currentTab = "rehab bill";
  const { id } = useParams();
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const clinicId = userInfo?.u_vClinicId;
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({});
  const [inventoryData, setInventoryData] = useState([]);
  const [allAmtTotal, setAllAmtTotal] = useState(0);
  const [sittingData, setSittingData] = useState([]);
  const [rows, setRows] = useState([
    { product: "", n_iquantity: 0, price: 0, i_vid: "" },
  ]);
  const [totalBillAmt, setTotalBillAmt] = useState();
  const [formData, setFormData] = useState({
    r_vclinicid: clinicId,
    r_vpatient_id: "",
    r_dbilldate: "",
    r_vname: "",
    r_iage: "",
    r_egender: "",
    r_vphone: "",
    r_taddress: "",
    // r_jmaterial: [],
    // r_dprice: allAmtTotal,
    // r_iquantity: 1,
    r_vdiagnosis: "",
    r_dtotal: totalBillAmt,
    r_dbamt: 0,
    r_jsittings: [
      {
        sittingNo: "",
        sittingAmt: "",
        sittingDate: "",
      },
    ],
  });

  const updateFormDataWithPatientData = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      r_vpatient_id: data?.p_vid,
      r_vname: data?.p_vName || "",
      r_iage: data?.p_iAge || "",
      r_egender: data?.p_egender || "",
      r_vphone: data?.p_vPhone || "",
      r_taddress: data?.p_tAddress || "",
    }));
  };

  const getPatientData = async () => {
    try {
      const response = await AxiosInstance.get(`/patient/get-patient/${id}`);
      const data = response.data.response;
      setPatientData(data);
      updateFormDataWithPatientData(data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const getInventoryData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/inventory/get-clinic-inventory/${clinicId}`
      );
      setInventoryData(response.data.response);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const getSittingHistory = async () => {
    try {
      const response = await AxiosInstance.get(
        `/sitting/get-sitting-history/${id}`
      );
      setSittingData(response.data.response || []);
      if (response.data.status === 201) {
        message.success(response.data.message);
        navigate(-1);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching sitting history:", error);
    }
  };

  const handleInputChange = (e, field) => {
    const value =
      field === "sittingDate" ? e.target.value : parseInt(e.target.value) || 1;

    setFormData((prevData) => ({
      ...prevData,
      r_jsittings: [
        {
          ...prevData.r_jsittings[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        r_dprice: allAmtTotal,
        r_dbamt: sittingData.s_dbamt,
        r_dtotal: allAmtTotal + formData.r_jsittings[0].sittingAmt,
        r_jmaterial: rows,
      };
      const response = await AxiosInstance.post(
        `/rehabbill/add-rehabbill`,
        payload
      );
      message.success("Bill submitted successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting bill:", error);
      message.error("Bill not submitted");
    }
  };
  const handleRowChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };

        if (field === "product") {
          const selectedProduct = inventoryData.find(
            (item) => item.i_vpt_name === value
          );
          updatedRow.price =
            selectedProduct && updatedRow.n_iquantity
              ? updatedRow.n_iquantity * selectedProduct.i_dmrp
              : "";
          updatedRow.i_vid = selectedProduct ? selectedProduct.i_vid : "";
        }

        if (field === "n_iquantity") {
          const selectedProduct = inventoryData.find(
            (item) => item.i_vpt_name === row.product
          );
          updatedRow.price =
            selectedProduct && value ? value * selectedProduct.i_dmrp : "";
        }

        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  useEffect(() => {
    getPatientData();
    getInventoryData();
    getSittingHistory();
  }, []);

  const calPrice = () => {
    const total = rows.reduce((sum, row) => sum + (row.price || 0), 0);
    setAllAmtTotal(total);
  };
  const getInventoryDetails = async () => {
    try {
      const updatedInventory = await AxiosInstance.get(
        `/inventory/get-clinic-inventory/${userInfo.u_vClinicId}`
      );
      setInventoryData(updatedInventory.data.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInventoryDetails();
    calPrice();
  }, [rows]);

  const addRow = () => {
    setRows([...rows, { product: "", n_iquantity: 1, price: "" }]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleMaterial = async () => {
    if (!rows) {
      message.error("Please select material and n_iquantity");
      return;
    }
    const SendDB = {
      i_vclinicid: userInfo.u_vClinicId,
      inventoryUpdates: rows,
    };

    try {
      const response = await AxiosInstance.patch(
        "/inventory/inventory-stock-update",
        SendDB
      );
      if (response.data.status === 200) {
        message.success(response.data.message);
        getInventoryDetails();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while updating inventory");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Navigation and Header */}
      <div className="flex justify-between items-center mb-4">
        <NavTabs currentPage={currentPage} currentTab={currentTab} />
        <button
          className="bg-[--navbar-bg-color] flex items-center gap-3 text-white px-4 py-2 rounded-md hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] transition-all shadow-sm"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>

      {/* Patient Details */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Patient Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <FaRegUser className="text-xl text-blue-600" />
            <span>
              <strong className="text-gray-700">Name:</strong>{" "}
              {patientData.p_vName || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {patientData.p_egender === "male" ? (
              <IoMale className="text-xl text-blue-600" />
            ) : patientData.p_egender === "female" ? (
              <IoFemale className="text-xl text-pink-600" />
            ) : (
              <IoMaleFemale className="text-xl text-purple-600" />
            )}
            <span>
              <strong className="text-gray-700">Gender:</strong>{" "}
              {patientData.p_egender || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <PhoneOutlined className="text-xl text-green-600" />
            <span>
              <strong className="text-gray-700">Phone:</strong>{" "}
              {patientData.p_vPhone || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaBirthdayCake className="text-xl text-orange-600" />
            <span>
              <strong className="text-gray-700">Age:</strong>{" "}
              {patientData.p_iAge || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MdOutlineLocationOn className="text-xl text-red-600" />
            <span>
              <strong className="text-gray-700">Address:</strong>{" "}
              {patientData.p_tAddress || "N/A"}
            </span>
          </div>
        </div>{" "}
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Bill Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Diagnosis:
            </label>
            <input
              type="text"
              name="r_vdiagnosis"
              placeholder="Enter diagnosis"
              value={formData.r_vdiagnosis}
              onChange={(e) =>
                setFormData({ ...formData, r_vdiagnosis: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bill Date:
            </label>
            <input
              type="date"
              name="r_dbilldate"
              value={formData.r_dbilldate}
              onChange={(e) =>
                setFormData({ ...formData, r_dbilldate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      {/* Inventory Selection */}

      {/* <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Inventory</h2>
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Product:
              </label>
              <select
                value={row.product}
                onChange={(e) =>
                  handleRowChange(index, "product", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Product --</option>
                {inventoryData.map((item, idx) => (
                  <option key={idx} value={item.i_vpt_name}>
                    {item.i_vpt_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity:
              </label>
              <input
                type="number"
                value={row.n_iquantity}
                onChange={(e) =>
                  handleRowChange(
                    index,
                    "n_iquantity",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price:
              </label>
              <input
                type="text"
                value={row.price || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="mt-6 flex space-x-4">
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={addRow}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={handleMaterial}
            className="bg-blue-100 border h-fit border-blue-500 rounded-md px-4 py-2 text-blue-800 hover:bg-blue-200 duration-300"
          >
            <MdAddShoppingCart size={20} />
          </button>
        </div>
      </div> */}
      {/* sitting history */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-100 w-full">
        <div className="flex flex-row justify-between items-center mb-4 w-full">
          <h2 className="text-2xl font-bold text-nowrap text-gray-800 w-full">
            Sitting History
          </h2>
          <div className="flex items-center gap-6 flex-row w-full">
            <p className="text-lg font-semibold text-gray-800">
              Total Amount:{" "}
              <span className="text-blue-600">₹{sittingData.s_dtamt}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Balance To Pay:{" "}
              <span className="text-blue-600">₹{sittingData.s_dbamt}</span>
            </p>
          </div>{" "}
        </div>
        <div className="flex gap-6 w-full">
          <div className="w-full max-h-60 overflow-y-auto border rounded-lg">
            <table className="w-full text-nowrap relative text-center divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                    Sitting No
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sittingData?.s_jhist?.map((sitting, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sitting.sno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sitting.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      ₹{sitting.sittingAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Sitting Details */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sittings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sitting No:
            </label>
            <input
              type="text"
              value={formData.r_jsittings[0].sittingNo}
              onChange={(e) => handleInputChange(e, "sittingNo")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sitting Date:
            </label>
            <input
              type="date"
              value={formData.r_jsittings[0].sittingDate}
              onChange={(e) => handleInputChange(e, "sittingDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sitting Amount:
            </label>
            <input
              type="text"
              value={formData.r_jsittings[0].sittingAmt}
              onChange={(e) => {
                handleInputChange(e, "sittingAmt");
                setTotalBillAmt(
                  allAmtTotal + formData.r_jsittings[0].sittingAmt
                );
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-800">
            Bill Amount:{" "}
            <span className="text-blue-600">
              ₹{formData.r_jsittings[0].sittingAmt}
            </span>
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2.5 rounded-md hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-semibold"
        >
          Submit Bill
        </button>
      </div>
    </div>
  );
};
export default RehabBill;
