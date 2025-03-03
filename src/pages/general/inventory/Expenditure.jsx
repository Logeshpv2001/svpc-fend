import React, { useEffect, useState } from "react";
import { message, Tabs } from "antd";
import AxiosInstance from "../../../utilities/AxiosInstance";
import TabPane from "antd/es/tabs/TabPane";
import StocksTable from "../../../component/tables/inventory/StocksTable";
import PurchaseTable from "../../../component/tables/inventory/PurchaseTable";
import ReturnTable from "../../../component/tables/inventory/ReturnTable";
import Item from "antd/es/list/Item";
import SuppliersInnerTab from "../../../component/tables/inventory/SuppliersInnerTab";
import SelasHistory from "../../../component/tables/inventory/SelasHistory";

const Expenditure = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("user"));
  const [renderInventory, setRenderInventory] = useState(false);

  const initialFormValues = {
    i_vsupplier_name: "",
    i_vpt_invoiceno: "",
    i_dinventory_date: "",
    i_dtvalue: "",
    i_vpt_name: "",
    i_vpt_size: "",
    i_ipt_quantity: "",
    i_dpurchase_rate: "",
    i_dpt_gstptpage: "",
    i_dpt_gstamnt: "",
    i_dpt_totalamnt: "",
    i_dmrp: "",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isEditMode, setIsEditMode] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const showModal = () => {
    setIsEditMode(false); // Reset to add mode
    setFormValues(initialFormValues);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "i_dpt_gstptpage" && (value < 0 || value > 100)) {
      message.warning("GST percentage must be between 0 and 100");
      return;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setFormValues(item);
    setIsModalOpen(true);
  };

  const dataTosend = {
    i_vclinicid: userInfo.u_vClinicId,
    ...formValues,
  };

  const getInventoryDetails = async () => {
    try {
      const response = await AxiosInstance.get(
        `/inventory/get-clinic-inventory/${userInfo.u_vClinicId}`
      );

      const inventory = response.data.response || [];

      // Sort inventory data by `created_at` in descending order
      const sortedInventory = inventory.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setInventoryData(sortedInventory);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInventoryDetails();
  }, []);

  const handleOk = async () => {
    try {
      const url = isEditMode
        ? `/inventory/edit-inventory`
        : "/inventory/add-inventory";

      const response = await AxiosInstance[isEditMode ? "patch" : "post"](
        url,
        isEditMode
          ? {
              ...dataTosend,
              i_vid: formValues.i_vid,
              i_dinventory_date: formatDate(formValues.i_dinventory_date),
            }
          : dataTosend
      );
      setRenderInventory(!renderInventory);

      if (response.data.status === 201 || response.data.status === 200) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error submitting form");
      console.log(error);
    }
    setIsModalOpen(false);
    setFormValues(initialFormValues);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] m-0 animationtext">
          Inventory Management
        </h1>
      </div>
      <div>
        <Tabs
          defaultActiveKey="1"
          animated={{ inkBar: true, tabPane: true }}
          tabBarStyle={{ fontWeight: "bold" }}
          className=""
        >
          <Item tab="Stocks Material" key="2">
            <StocksTable />
          </Item>
          <Item tab="Suppliers" key="5">
            <SuppliersInnerTab />
          </Item>
          <Item tab="Stocks Purchase" key="3">
            <PurchaseTable />
          </Item>
          <Item tab="Sales Report" key="6">
            <SelasHistory />
          </Item>
          <Item tab="Product Restock" key="7">
            <ReturnTable />
          </Item>
        </Tabs>
      </div>

      {/* Antd Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl mx-4 rounded-md shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <h1 className="text-lg font-bold mb-4">
              {isEditMode ? "Edit Material" : "Add Material"}
            </h1>
            <hr className="mb-4" />

            <div className="flex flex-col gap-4 w-full">
              <div className="flex max-md:flex-col gap-2 w-full">
                {/* Supplier Name */}
                <div className="flex flex-col w-full">
                  <p>Supplier Name:</p>
                  <input
                    type="text"
                    name="i_vsupplier_name"
                    value={formValues.i_vsupplier_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* Invoice No */}
                <div className="flex flex-col w-full">
                  <p>Invoice No:</p>
                  <input
                    type="text"
                    name="i_vpt_invoiceno"
                    value={formValues.i_vpt_invoiceno}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              <div className="flex max-md:flex-col gap-2 w-full">
                {/* Date */}
                <div className="flex flex-col w-full">
                  <p>Date:</p>
                  <input
                    type="date"
                    name="i_dinventory_date"
                    value={formatDate(formValues.i_dinventory_date)}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* Total Value */}
                <div className="flex flex-col w-full">
                  <p>Total Value:</p>
                  <input
                    type="number"
                    name="i_dtvalue"
                    min={0}
                    value={formValues.i_dtvalue}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <h1 className="text-lg font-bold col-span-2 mt-4">
                Product Information
              </h1>
              <hr className="col-span-2 mb-4" />

              {/* Material Name */}
              <div className="flex max-md:flex-col gap-2 w-full">
                <div className="flex flex-col w-full">
                  <p>Material Name:</p>
                  <input
                    type="text"
                    name="i_vpt_name"
                    value={formValues.i_vpt_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* Size */}
                <div className="flex flex-col w-full">
                  <p>Size:</p>
                  <input
                    type="text"
                    name="i_vpt_size"
                    value={formValues.i_vpt_size}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex max-md:flex-col gap-2 w-full">
                {/* Quantity */}
                <div className="flex flex-col w-full">
                  <p>Quantity:</p>
                  <input
                    type="number"
                    name="i_ipt_quantity"
                    min="0"
                    value={formValues.i_ipt_quantity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* Purchase Rate */}
                <div className="flex flex-col w-full">
                  <p>Purchase Rate:</p>
                  <input
                    type="number"
                    name="i_dpurchase_rate"
                    min={0}
                    value={formValues.i_dpurchase_rate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex max-md:flex-col gap-2 w-full">
                {/* GST Value */}
                <div className="flex flex-col w-full">
                  <p>GST %:</p>
                  <input
                    type="number"
                    name="i_dpt_gstptpage"
                    min={0}
                    max={100}
                    value={formValues.i_dpt_gstptpage}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* GST Amount */}
                <div className="flex flex-col w-full">
                  <p>GST Amount:</p>
                  <input
                    type="number"
                    name="i_dpt_gstamnt"
                    min={0}
                    value={formValues.i_dpt_gstamnt}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex max-md:flex-col gap-2 w-full">
                {/* Total Value */}
                <div className="flex flex-col w-full">
                  <p>Total Value:</p>
                  <input
                    type="number"
                    name="i_dpt_totalamnt"
                    min={0}
                    value={formValues.i_dpt_totalamnt}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* MRP */}
                <div className="flex flex-col w-full">
                  <p>MRP:</p>
                  <input
                    type="text"
                    name="i_dmrp"
                    value={formValues.i_dmrp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleOk}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditMode ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenditure;
