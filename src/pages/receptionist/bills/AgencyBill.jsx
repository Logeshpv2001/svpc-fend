import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../../utilities/AxiosInstance";
import Select from "react-select";
import { message } from "antd";
import {
  FaArrowLeft,
  FaCalendar,
  FaHeart,
  FaIdCard,
  FaMale,
  FaPhone,
  FaUser,
} from "react-icons/fa";

const AgencyBill = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;

  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [selectedMaterialSize, setSelectedMaterialSize] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [materialName, setMaterialName] = useState([]);
  const [materialSize, setMaterialSize] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [supplierNames, setSupplierNames] = useState([]);
  const [materialCount, setMaterialCount] = useState("");
  const [unitAmount, setUnitAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [gst, setGst] = useState("");
  const [previousData, setPreviousData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [materialLimit, setMaterialLimit] = useState();
  const [billData, setBillData] = useState({
    bi_vClinicID: user.u_vClinicId,
    bi_vDate: new Date().toISOString().slice(0, 19).replace("T", " "),
    bi_vPatient_Id: id || "",
    bi_vPatient_Name: "",
    bi_iPatient_Age: "",
    bi_vPatient_Gender: "",
    bi_vPatient_Phone: "",
    bi_tPatient_Address: "",
    bi_iTotal_Amout: 0,
    bi_iDiscount_Amount: 0,
    bi_iTotal_GSTAmount: 0,
    bi_iTotal_Payable_Amount: 0,
    bi_iTotal_Paid_Amount: 0,
    bi_vPayment_method: "",
    bi_vRecepionist: user.u_vName || "",
    materials: [],
  });

  const getPatientData = async () => {
    try {
      const response = await AxiosInstance.get(`/patient/get-patient/${id}`);
      setPatientData(response.data.response || {});
      setBillData((prev) => ({
        ...prev,
        bi_vPatient_Name: response.data.response?.p_vName || "",
        bi_iPatient_Age: response.data.response?.p_iAge || "",
        bi_vPatient_Gender: response.data.response?.p_egender || "",
        bi_vPatient_Phone: response.data.response?.p_vPhone || "",
        bi_tPatient_Address: response.data.response?.p_tAddress || "",
      }));
    } catch (error) {
      setError("Error fetching patient data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getMaterialName = async () => {
    try {
      const response = await AxiosInstance.get(
        `/stock/get-materialnames/${clinic_id}`
      );
      setMaterialName(response.data.response || []);
    } catch (error) {
      setError("Error fetching material names");
      console.log(error);
    }
  };

  const getMaterialSize = async (materialName) => {
    try {
      const response = await AxiosInstance.get(
        `/stock/get-materialsize/${materialName}`
      );
      if (response.data.status === 404) {
        setError(response.data.message);
      } else {
        setMaterialSize(response.data.response || []);
      }
    } catch (error) {
      console.error("Error fetching material size:", error);
    }
  };

  const getCompanyNameAndSupplierName = async () => {
    try {
      const response = await AxiosInstance.post(
        `/stock/get-supplierandcompany`,
        {
          stm_vMaterial_Name: selectedMaterialName?.value,
          stm_iMaterial_Size: selectedMaterialSize?.value,
        }
      );
      setCompanyNames(response?.data?.response?.company || []);
      setSupplierNames(response?.data?.response?.supplier || []);
    } catch (error) {
      console.error("Error fetching company and supplier names:", error);
    }
  };

  useEffect(() => {
    getPatientData();
    getMaterialName();
  }, [clinic_id, id]);

  useEffect(() => {
    if (selectedMaterialName) {
      getMaterialSize(selectedMaterialName.value);
    }
  }, [selectedMaterialName]);

  useEffect(() => {
    if (selectedMaterialName && selectedMaterialSize) {
      getCompanyNameAndSupplierName();
    }
  }, [selectedMaterialName, selectedMaterialSize]);

  useEffect(() => {
    const calculateTotal = () => {
      if (unitAmount > 0) {
        const baseAmount = unitAmount * materialCount;
        const discountAmount = baseAmount * (discount / 100);
        const discountedPrice = baseAmount - discountAmount;
        const gstAmount = discountedPrice * (gst / 100);
        const finalPrice = discountedPrice + gstAmount;
        setTotalPrice(finalPrice);
      } else {
        setTotalPrice(0);
      }
    };
    calculateTotal();
  }, [unitAmount, materialCount, discount, gst]);

  useEffect(() => {
    let totalAmount = 0;
    let totalDiscount = 0;
    let totalGST = 0;
    let totalPayable = 0;

    previousData.forEach((data) => {
      const baseAmount = data.unitAmount * data.materialCount;
      const discountAmount = baseAmount * (data.discount / 100);
      const discountedPrice = baseAmount - discountAmount;
      const gstAmount = discountedPrice * (data.gst / 100);
      const finalPrice = discountedPrice + gstAmount;

      totalAmount += baseAmount;
      totalDiscount += discountAmount;
      totalGST += gstAmount;
      totalPayable += finalPrice;
    });

    const materials = previousData.map((data) => ({
      bim_vCompany_Name: data.companyName,
      bim_vSupplier_Name: data.supplierName,
      bim_vMaterial_name: data.materialName,
      bim_vMaterial_Size: data.materialSize,
      bim_iMaterial_Count: data.materialCount,
      bim_iUnit_Amount: data.unitAmount,
      bim_iDiscount_Percentage: data.discount,
      bim_iDiscount_Amount:
        (data.unitAmount * data.materialCount * data.discount) / 100,
      bim_iGST_Percentage: data.gst,
      bim_iGST_Amount:
        ((data.unitAmount * data.materialCount -
          (data.unitAmount * data.materialCount * data.discount) / 100) *
          data.gst) /
        100,
      bim_iTotal_Payable_Amount: data.totalPrice,
    }));

    setBillData((prev) => ({
      ...prev,
      bi_iTotal_Amout: totalAmount,
      bi_iDiscount_Amount: totalDiscount,
      bi_iTotal_GSTAmount: totalGST,
      bi_iTotal_Payable_Amount: totalPayable,
      bi_iTotal_Paid_Amount: totalPayable,
      materials: materials,
      // bi_vPayment_method: paymentMethod,
    }));
  }, [previousData]);

  const materialNameOptions = materialName.map((name) => ({
    value: name.toLowerCase(),
    label: name,
  }));

  const materialSizeOptions = materialSize.map((size) => ({
    value: size.toLowerCase(),
    label: size,
  }));

  const companyOptions = companyNames.map((company) => ({
    value: company.toLowerCase(),
    label: company,
  }));

  const supplierOptions = supplierNames.map((supplier) => ({
    value: supplier.toLowerCase(),
    label: supplier,
  }));

  const handleLogData = () => {
    const data = {
      materialName: selectedMaterialName?.label,
      materialSize: selectedMaterialSize?.label,
      companyName: selectedCompanyName?.label,
      supplierName: selectedSupplierName?.label,
      materialCount,
      unitAmount,
      discount,
      gst,
      paymentMethod: paymentMethod,
      totalPrice,
    };

    if (editIndex >= 0) {
      const newData = [...previousData];
      newData[editIndex] = data;
      setPreviousData(newData);
      setEditIndex(-1);
    } else {
      setPreviousData([...previousData, data]);
    }
    clearForm();
  };

  const clearForm = () => {
    setSelectedMaterialName(null);
    setSelectedMaterialSize(null);
    setSelectedCompanyName(null);
    setSelectedSupplierName(null);
    setMaterialCount(0);
    setUnitAmount(0);
    setDiscount(0);
    setGst(0);
    // setPaymentMethod(null);
    setTotalPrice(0);
    setEditIndex(-1);
  };

  const handleEdit = (index) => {
    const data = previousData[index];
    setSelectedMaterialName({
      value: data.materialName.toLowerCase(),
      label: data.materialName,
    });
    setSelectedMaterialSize({
      value: data.materialSize.toLowerCase(),
      label: data.materialSize,
    });
    setSelectedCompanyName({
      value: data.companyName.toLowerCase(),
      label: data.companyName,
    });
    setSelectedSupplierName({
      value: data.supplierName.toLowerCase(),
      label: data.supplierName,
    });
    setMaterialCount(data.materialCount);
    setUnitAmount(data.unitAmount);
    setDiscount(data.discount);
    setGst(data.gst);
    setPaymentMethod(data.paymentMethod);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setPreviousData(previousData.filter((_, i) => i !== index));
  };

  const postMaterials = async () => {
    const payload = {
      ...billData,
      bi_vPayment_method: paymentMethod,
    };
    console.log(payload, "payload");
    try {
      const response = await AxiosInstance.post(
        `/inventorybill/add-inventorybill`,
        payload
      );
      console.log(response, "data");

      message.success("Bill added successfully");
      navigate(-1);
    } catch (error) {
      message.error("Error adding bill");
      console.error("Error adding bill:", error);
    }
  };

  const getMaterialCount = async () => {
    console.log(
      selectedCompanyName.value,
      selectedMaterialName,
      selectedMaterialSize,
      selectedSupplierName
    );
    try {
      const response = await AxiosInstance.post(`/stock/get-material-count`, {
        stm_vClinicID: clinic_id,
        stm_vMaterial_Name: selectedMaterialName.value,
        stm_iMaterial_Size: selectedMaterialSize.value,
        stm_vSupplier_Name: selectedSupplierName.value,
        stm_vCompany_Name: selectedCompanyName.value,
      });
      setMaterialLimit(response.data.response.stm_iMaterial_Total_Count);
      console.log(response.data.response.stm_iMaterial_Total_Count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-5 flex-col mb-4">
      <div className="w-fit">
        <button
          className="bg-[--navbar-bg-color] text-[--light-navbar-bg-color] hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 px-2 py-1 rounded flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center flex-row justify-normal gap-3 text-gray-700 bg-slate-50 rounded-full border p-2">
          <div className="bg-[--navbar-bg-color] p-2 text-white rounded-full">
            <FaIdCard className="text-xl" />
          </div>
          <h1 className="text-lg font-semibold text-center m-0">
            {patientData?.p_vid}
          </h1>
        </div>
        <div className="flex items-center flex-row justify-normal gap-3 text-gray-700 bg-slate-50 rounded-full border p-2">
          <div className="bg-[--navbar-bg-color] p-2 text-white rounded-full">
            <FaUser className="text-xl" />
          </div>
          <h1 className="text-lg font-semibold text-center m-0">
            {patientData?.p_vName}
          </h1>
        </div>
        <div className="flex items-center flex-row justify-normal gap-3 text-gray-700 bg-slate-50 rounded-full border p-2">
          <div className="bg-[--navbar-bg-color] p-2 text-white rounded-full">
            <FaCalendar className="text-xl" />
          </div>
          <h1 className="text-lg font-semibold text-center m-0">
            {patientData?.p_iAge}
          </h1>
        </div>
        <div className="flex items-center flex-row justify-normal gap-3 text-gray-700 bg-slate-50 rounded-full border p-2">
          <div className="bg-[--navbar-bg-color] p-2 text-white rounded-full">
            <FaHeart className="text-xl" />
          </div>
          <h1 className="text-lg font-semibold text-center m-0">
            {patientData?.p_emStatus}
          </h1>
        </div>
        <div className="flex items-center flex-row justify-normal gap-3 text-gray-700 bg-slate-50 rounded-full border p-2">
          <div className="bg-[--navbar-bg-color] p-2 text-white rounded-full">
            <FaMale className="text-xl" />
          </div>
          <h1 className="text-lg font-semibold text-center m-0">
            {patientData?.p_egender}
          </h1>
        </div>
        <div className="flex items-center flex-row justify-normal gap-3 text-gray-700 bg-slate-50 rounded-full border p-2">
          <div className="bg-[--navbar-bg-color] p-2 text-white rounded-full">
            <FaPhone className="text-xl" />
          </div>
          <h1 className="text-lg font-semibold text-center m-0">
            {patientData?.p_vPhone}
          </h1>
        </div>
      </div>{" "}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1>Materials</h1>
        <div className="flex items-center gap-3 flex-wrap p-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Material Name
            </label>
            <Select
              value={selectedMaterialName}
              onChange={setSelectedMaterialName}
              options={materialNameOptions}
              placeholder="Select a material"
              className="w-72"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Material Size
            </label>
            <Select
              value={selectedMaterialSize}
              onChange={setSelectedMaterialSize}
              options={materialSizeOptions}
              placeholder="Select a material size"
              isDisabled={!selectedMaterialName}
              className="w-72"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Company Name
            </label>
            <Select
              value={selectedCompanyName}
              onChange={setSelectedCompanyName}
              options={companyOptions}
              placeholder="Select a company"
              isDisabled={!selectedMaterialName || !selectedMaterialSize}
              className="w-72"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Supplier Name
            </label>
            <Select
              value={selectedSupplierName}
              onChange={setSelectedSupplierName}
              options={supplierOptions}
              placeholder="Select a supplier"
              isDisabled={!selectedMaterialName || !selectedMaterialSize}
              className="w-72"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Material Count
            </label>
            <input
              type="number"
              value={materialCount}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (e.target.value === "" || value <= materialLimit) {
                  setMaterialCount(value);
                } else {
                  message.error("Material count exceeds limit");
                }
              }}
              onClick={() => getMaterialCount()}
              min={0}
              className="w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Unit Amount
            </label>
            <input
              type="number"
              value={unitAmount}
              onChange={(e) => setUnitAmount(Number(e.target.value))}
              min={0}
              className="w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Discount %</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min={0}
              className="w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">GST %</label>
            <input
              type="number"
              value={gst}
              onChange={(e) => setGst(Number(e.target.value))}
              min={0}
              className="w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Payment method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                console.log(e.target.value);
                console.log(paymentMethod);
              }}
              className="w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option defaultValue={""}>select</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            Total Price: {totalPrice}
          </h3>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={handleLogData}
          className="bg-blue-500 w-fit text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          {editIndex >= 0 ? "Update" : "Add"}
        </button>
        <button
          onClick={clearForm}
          className="bg-gray-500 w-fit text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Form
        </button>{" "}
      </div>
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full shadow-sm overflow-hidden text-nowrap">
          <thead className="bg-[--navbar-bg-color] text-white">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Material Name
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Material Size
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Company Name
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Supplier Name
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Material Count
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Unit Amount
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Discount
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                GST
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Payment Method
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Total
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {previousData.map((data, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.materialName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.materialSize}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.companyName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.supplierName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.materialCount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.unitAmount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.discount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.gst}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.paymentMethod}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {data.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm space-x-2 text-center">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={postMaterials}
        className="bg-green-500 w-fit text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
};

export default AgencyBill;
