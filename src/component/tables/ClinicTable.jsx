import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import AxiosInstance from "../../utilities/AxiosInstance";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // Import icons

const ClinicTable = () => {
  const [formData, setFormData] = useState({
    c_vName: "",
    c_vPhone: "",
    c_vEmail: "",
    c_tAddress: "",
    c_vLogo: "",
    c_vContactperson: "",
  });

  const [clinicData, setClinicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(clinicData.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const columns = [
    "Name",
    "Clinic ID",
    "Phone",
    "Email",
    "Address",
    "Contact Person",
    "Logo",
  ];

  const clinicRegister = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/clinic/add-clinic", formData);

      if (response.data?.status === 201) {
        message.success(response.data.message || "Clinic added successfully!");
        setFormData({
          c_vName: "",
          c_vPhone: "",
          c_vEmail: "",
          c_tAddress: "",
          c_vLogo: "",
          c_vContactperson: "",
        });
        setIsModalOpen(false);
        getClinicData();
      } else {
        message.error(response.data.message || "Failed to add clinic!");
      }
    } catch (error) {
      message.error("An error occurred while adding the clinic.");
    } finally {
      setLoading(false);
    }
  };

  const getClinicData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/clinic/getall-clinic");

      if (response.data?.status === 200) {
        setClinicData(response.data.response || []);
      } else {
        message.error(response.data.message || "Failed to fetch clinic data!");
      }
    } catch (error) {
      message.error("An error occurred while fetching clinic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClinicData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get paginated data
  const paginatedData = clinicData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="flex justify-between items-center w-full border-l-4 border-[--navbar-bg-color] bg-gradient-to-r from-gray-300 rounded-l-full pl-10 to-gray-100 p-2">
        <h1 className="font-normal text-3xl text-[--navbar-bg-color] animationtext">
          Clinic List
        </h1>
      </div>
      <div className="my-4 flex justify-end">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Clinic
        </Button>
      </div>

      <Modal
        title="Add Clinic"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={clinicRegister}>
          <Form.Item label="Name" required>
            <Input
              name="c_vName"
              value={formData.c_vName}
              onChange={handleInputChange}
              className="shadow-md"
            />
          </Form.Item>
          <Form.Item label="Phone" required>
            <Input
              name="c_vPhone"
              value={formData.c_vPhone}
              onChange={handleInputChange}
              className="shadow-md"
            />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input
              name="c_vEmail"
              value={formData.c_vEmail}
              onChange={handleInputChange}
              className="shadow-md"
            />
          </Form.Item>
          <Form.Item label="Address" required>
            <Input
              name="c_tAddress"
              value={formData.c_tAddress}
              onChange={handleInputChange}
              className="shadow-md"
            />
          </Form.Item>
          <Form.Item label="Logo (URL)" required>
            <Input
              name="c_vLogo"
              value={formData.c_vLogo}
              onChange={handleInputChange}
              className="shadow-md"
            />
          </Form.Item>
          <Form.Item label="Contact Person" required>
            <Input
              name="c_vContactperson"
              value={formData.c_vContactperson}
              onChange={handleInputChange}
              className="shadow-md"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form>
      </Modal>

      <div className="overflow-x-auto">
        {/* <table className="min-w-full table-auto border-collapse border border-gray-200 text-nowrap text-center rounded-md overflow-hidden">
          <thead>
            <tr className="text-lg">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 border bg-[--navbar-bg-color] text-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 text-lg">
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vName}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_clinicid}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vPhone}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vEmail}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_tAddress}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vContactperson}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vLogo}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table> */}
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-nowrap text-center rounded-md overflow-hidden">
          <thead>
            <tr className="text-lg">
              <th className="px-4 py-2 border bg-[--navbar-bg-color] text-white">
                SNo
              </th>{" "}
              {/* Serial Number Column */}
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 border bg-[--navbar-bg-color] text-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 text-lg">
                  <td className="px-4 py-2 border border-gray-300">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>{" "}
                  {/* Serial Number */}
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vName}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_clinicid}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vPhone}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vEmail}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_tAddress}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vContactperson}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {row.c_vLogo}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-between items-center">
        <Button
          type="default"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <LeftOutlined />
        </Button>
        <span>
          Page {currentPage} of {Math.ceil(clinicData.length / pageSize)}
        </span>
        <Button
          type="default"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(clinicData.length / pageSize)}
        >
          <RightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default ClinicTable;
