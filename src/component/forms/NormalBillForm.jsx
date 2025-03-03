import React, { useEffect, useState } from "react";
import AxiosInstance from "../../utilities/AxiosInstance";
import { MdAddShoppingCart } from "react-icons/md";
import { message } from "antd";

const BillForm = ({ modelData,setIsModalVisible }) => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));

  const initialState = {
    n_vclinicid: "",
    n_vname: "",
    n_iage: "",
    n_egender: "",
    n_vphone: "",
    n_taddress: "",
    n_jmaterial: [],
    n_dprice: "",
    n_iquantity: "",
    n_vdiagnosis: "",
    n_damount: "",
    n_ddiscount: "",
    n_dtotal: "",
    n_dbilldate: "",
  };
  const [billData, setBillData] = useState(initialState);
  const [rows, setRows] = useState([
    { product: "", n_iquantity: 0, price: 0, i_vid: "" },
  ]);
  const [billDate,setBillDate] = useState();
  const [inventoryData, setInventoryData] = useState([]);
  const { patientInfo } = modelData;
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [diagnosis, setDiagnosis] = useState("");

  // Function to calculate total amount after discount and inventory
  const calculateTotal = (baseAmount, discount, price, qty) => {
    const discountAmount = (baseAmount * discount) / 100;
    const inventoryCost = price * qty;
    return baseAmount - discountAmount + inventoryCost;
  };

  // Handle changes for inputs
  const handleAmountChange = (e) => {
    const enteredAmount = parseFloat(e.target.value) || 0;
    setAmount(enteredAmount);
    setTotal(calculateTotal(enteredAmount));
  };

  const handleDiscountChange = (e) => {
    const enteredDiscount = parseFloat(e.target.value) || 0;
    setDiscount(enteredDiscount);
    setTotal(calculateTotal(amount, enteredDiscount, total, discount));
  };

  const handleDiagnosisChange = (e) => {
    setDiagnosis(e.target.value);
  };
  const handleBillDate = (e) => {
    setBillDate(e.target.value);
  };

  useEffect(() => {
    const getInventoryDetails = async () => {
      try {
        const response = await AxiosInstance.get(
          `/inventory/get-clinic-inventory/${userInfo.u_vClinicId}`
        );

        setInventoryData(response.data.response || []);
      } catch (error) {
        console.log(error);
      }
    };

    getInventoryDetails();
  }, [userInfo.u_vClinicId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      n_vpatient_id: patientInfo.p_vid,
      n_vclinicid: userInfo.u_vClinicId,
      n_vname: patientInfo.p_vName,
      n_iage: patientInfo.p_iAge,
      n_egender: patientInfo.p_egender,
      n_vphone: patientInfo.p_vPhone,
      n_taddress: patientInfo.p_tAddress,
      n_jmaterial: rows,
      n_dprice: totalPrice,
      n_iquantity: 0,
      n_vdiagnosis: diagnosis,
      n_damount: amount,
      n_ddiscount: discount,
      n_dtotal: total,
      n_dbilldate: billDate,
    };
    
    try {
      const response = await AxiosInstance.post(
        "/bill/add-normalbill",
        formData
      );
      if (response.data.status === 201) {
        message.success(response.data.message);
        setBillData(initialState);
        setIsModalVisible(false);
      } else {
        message.error(response.data.message);        
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while generating the bill");
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
    calculateTotalPrice(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { product: "", n_iquantity: 1, price: "" }]);
    calculateTotalPrice(setRows);
  };
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const calculateTotalPrice = (rows) => {
    const total = rows.reduce((sum, row) => {
      return sum + (parseFloat(row.price) || 0); // Add price if it exists and is a number
    }, 0);
    setTotalPrice(total); // Update total price
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
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
  }, []);

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
    <div className="container mx-auto">
      {/* Patient Information */}
      <div className="mb-8 border-b">
        {/* Patient details */}
        <div className="mb-8 border-b">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Patient Information
          </h1>

          {/* First Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mb-6">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-600 mb-2"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                disabled
                className="p-3 w-full border capitalize rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={patientInfo.p_vName}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="age"
                className="text-sm font-semibold text-gray-600 mb-2"
              >
                Age:
              </label>
              <input
                type="number"
                id="age"
                disabled
                className="p-3 w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={patientInfo.p_iAge}
              />
            </div>
          </div>

          {/* Second Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="gender"
                className="text-sm font-semibold text-gray-600 mb-2"
              >
                Gender:
              </label>
              <input
                type="text"
                id="gender"
                disabled
                className="p-3 w-full capitalize border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={patientInfo.p_egender}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-gray-600 mb-2"
              >
                Phone:
              </label>
              <input
                type="tel"
                id="phone"
                disabled
                className="p-3 w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={patientInfo.p_vPhone}
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <label
              htmlFor="address"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Address:
            </label>
            <textarea
              id="address"
              disabled
              className="p-3 w-full capitalize border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={patientInfo.p_tAddress}
              rows="3"
            />
          </div>
        </div>
      </div>
      {/* Inventory Details */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Inventory Details (If any)
        </h1>
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
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleMaterial}
            className="bg-blue-100 border h-fit border-blue-500 rounded-md px-4 py-2 text-blue-800 hover:bg-blue-200 duration-300"
          >
            <MdAddShoppingCart size={20} />
          </button>
        </div>
      </div>
      {/* Billing Details */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Billing Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="diagnosis"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Diagnosis
            </label>
            <input
              type="text"
              id="diagnosis"
              value={diagnosis}
              onChange={handleDiagnosisChange}
              className="p-3 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={billDate}
              onChange={handleBillDate}
              className="p-3 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              min={0}
              value={amount}
              onChange={(e) => {
                handleAmountChange(e);
                const newAmount = parseFloat(e.target.value) || 0;
                const discountAmount = newAmount * (discount / 100) || 0;
                setTotal(newAmount - discountAmount);
              }}
              className="p-3 border rounded-lg shadow-sm"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="discount"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => {
                handleDiscountChange(e);
                const discountValue = parseFloat(e.target.value) || 0;
                const discountAmount = amount * (discountValue / 100) || 0;
                setTotal(amount - discountAmount);
              }}
              min={0}
              max={100}
              className="p-3 border rounded-lg shadow-sm"
              placeholder="Enter discount"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="total"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Total
            </label>
            <input
              type="number"
              id="total"
              value={total + totalPrice}
              readOnly
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-fit bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Generate Normal Bill
        </button>
      </form>{" "}
    </div>
  );
};

export default BillForm;
